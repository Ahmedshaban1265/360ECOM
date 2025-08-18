import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  SearchX, 
  ArrowLeft,
  Compass
} from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4">
      <div className="text-center space-y-8 max-w-md mx-auto">
        {/* Simple Icon */}
        <div className="mb-6">
          <SearchX className="w-16 h-16 mx-auto text-primary" />
        </div>

        {/* 404 Heading */}
        <div className="space-y-4">
          <h1 className="text-8xl md:text-9xl font-black text-primary/80 leading-none tracking-tighter">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Page Not Found
          </h2>
        </div>

        {/* Friendly Message */}
        <div className="space-y-4">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-sm text-muted-foreground">
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
          <Button
            onClick={handleGoHome}
            size="lg"
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group"
          >
            <Home className="w-4 h-4 mr-2 group-hover:animate-bounce" />
            Go Home
          </Button>
          
          <Button
            onClick={handleGoBack}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-2 hover:bg-muted/50 transform hover:scale-105 transition-all duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </Button>
        </div>

        {/* Decorative Elements */}
        <div className="flex justify-center items-center space-x-2 pt-8 opacity-50">
          <SearchX className="w-4 h-4 text-muted-foreground" />
          <div className="w-16 h-px bg-muted-foreground"></div>
          <SearchX className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/20 rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-primary/30 rounded-full animate-float animation-delay-300"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-primary/40 rounded-full animate-float animation-delay-700"></div>
        <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-primary/25 rounded-full animate-float animation-delay-500"></div>
      </div>

      {/* Custom CSS for animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-20px) rotate(180deg);
            }
          }
          
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          
          .animation-delay-300 {
            animation-delay: 300ms;
          }
          
          .animation-delay-500 {
            animation-delay: 500ms;
          }
          
          .animation-delay-700 {
            animation-delay: 700ms;
          }
          
          /* Responsive adjustments */
          @media (max-width: 640px) {
            .text-8xl {
              font-size: 6rem;
            }
          }
          
          @media (max-width: 480px) {
            .text-8xl {
              font-size: 4.5rem;
            }
          }
        `
      }} />
    </div>
  );
}
