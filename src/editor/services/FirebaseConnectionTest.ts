import { storage } from '@/firebase';
import { ref, listAll, connectStorageEmulator } from 'firebase/storage';

export class FirebaseConnectionTest {
  
  static async testStorageConnection(): Promise<{ success: boolean; error?: string; details?: any }> {
    try {
      console.log('Testing Firebase Storage connection...');
      
      // Test connection by listing the media root (allowed by rules without auth)
      const mediaRef = ref(storage, 'theme-media');
      
      // Reasonable timeout for slow networks
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Connection timeout')), 20000);
      });
      
      const testPromise = listAll(mediaRef);
      
      await Promise.race([testPromise, timeoutPromise]);
      
      console.log('✅ Firebase Storage connection successful');
      return { success: true };
      
    } catch (error: any) {
      console.error('❌ Firebase Storage connection failed:', error);
      
      let errorMessage = 'Unknown error';
      
      if (error?.code === 'storage/retry-limit-exceeded') {
        errorMessage = 'Connection retry limit exceeded. Check your internet connection and Firebase configuration.';
      } else if (error?.code === 'storage/unauthorized') {
        errorMessage = 'Unauthorized access. Check Firebase Storage rules and authentication.';
      } else if (error?.code === 'storage/project-not-found') {
        errorMessage = 'Firebase project not found. Check your project configuration.';
      } else if (error?.code === 'storage/object-not-found') {
        // Folder doesn't exist yet, but connection is fine
        console.log('⚠️ theme-media folder not found yet; treating as connected.');
        return { success: true };
      } else if (error?.message === 'Connection timeout') {
        errorMessage = 'Connection timeout. Check your internet connection.';
      } else if (error?.code === 'storage/unknown') {
        errorMessage = 'Unknown storage error. Check Firebase configuration.';
      } else {
        errorMessage = error?.message || 'Connection failed';
      }
      
      return { 
        success: false, 
        error: errorMessage,
        details: {
          code: error?.code,
          message: error?.message,
          stack: error?.stack
        }
      };
    }
  }
  
  static async testWithFallback(): Promise<void> {
    const result = await this.testStorageConnection();
    
    if (!result.success) {
      console.log('🔄 Firebase Storage connection failed, attempting fallback strategies...');
      
      // Strategy 1: Try connecting to storage emulator if available
      try {
        if (window.location.hostname === 'localhost') {
          console.log('🔧 Attempting to connect to local Firebase emulator...');
          connectStorageEmulator(storage, 'localhost', 9199);
          
          const retryResult = await this.testStorageConnection();
          if (retryResult.success) {
            console.log('✅ Connected to Firebase Storage emulator');
            return;
          }
        }
      } catch (emulatorError) {
        console.log('❌ Firebase emulator connection failed:', emulatorError);
      }
      
      // Strategy 2: Log diagnostic information
      console.log('🔍 Diagnostic Information:');
      console.log('- Firebase config:', {
        projectId: storage.app.options.projectId,
        storageBucket: storage.app.options.storageBucket,
        authDomain: storage.app.options.authDomain
      });
      console.log('- Current URL:', window.location.href);
      console.log('- User Agent:', navigator.userAgent);
      console.log('- Online:', navigator.onLine);
      
      throw new Error(`Firebase Storage connection failed: ${result.error}`);
    }
  }
}
