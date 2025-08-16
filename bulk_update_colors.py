#!/usr/bin/env python3
import os
import re

def update_colors_in_file(file_path):
    """Update emerald colors to blue colors in a single file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Define replacements - more specific patterns first
    replacements = [
        # Gradient patterns
        (r'bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600', 
         'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800'),
        (r'hover:from-emerald-700 hover:via-blue-700 hover:to-purple-700', 
         'hover:from-blue-700 hover:via-blue-800 hover:to-blue-900'),
        (r'from-purple-600 via-blue-600 to-emerald-600', 
         'from-blue-800 via-blue-700 to-blue-600'),
        (r'from-emerald-600 to-blue-600', 
         'from-blue-600 to-blue-700'),
        (r'hover:from-emerald-700 hover:to-blue-700', 
         'hover:from-blue-700 hover:to-blue-800'),
        
        # Background gradients with alpha
        (r'bg-gradient-to-r from-emerald-600/20 via-blue-600/20 to-purple-600/20', 
         'bg-gradient-to-r from-blue-600/20 via-blue-700/20 to-blue-800/20'),
        (r'border-emerald-600/30', 'border-blue-600/30'),
        (r'from-emerald-100 via-blue-100 to-purple-100', 
         'from-blue-100 via-blue-200 to-blue-300'),
        (r'from-emerald-900/20 via-blue-900/20 to-purple-900/20', 
         'from-blue-900/20 via-blue-800/20 to-blue-700/20'),
        (r'from-emerald-50 to-blue-50', 'from-blue-50 to-blue-100'),
        
        # Individual color classes
        (r'text-emerald-600', 'text-blue-600'),
        (r'text-emerald-500', 'text-blue-500'),
        (r'border-emerald-600', 'border-blue-600'),
        (r'border-emerald-500', 'border-blue-500'),
        (r'hover:text-emerald-600', 'hover:text-blue-600'),
        (r'hover:bg-emerald-600', 'hover:bg-blue-600'),
        (r'hover:border-emerald-600/30', 'hover:border-blue-600/30'),
        (r'bg-emerald-600', 'bg-blue-600'),
        (r'bg-emerald-700', 'bg-blue-700'),
        (r'bg-emerald-100', 'bg-blue-100'),
        (r'bg-emerald-900', 'bg-blue-900'),
        (r'hover:bg-emerald-700', 'hover:bg-blue-700'),
        
        # Group hover states
        (r'group-hover:text-emerald-600', 'group-hover:text-blue-600'),
    ]
    
    # Apply replacements
    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content)
    
    # Only write if content changed
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    """Update colors in all JSX files"""
    jsx_files = []
    
    # Find all .jsx files in src directory
    for root, dirs, files in os.walk('src'):
        for file in files:
            if file.endswith('.jsx'):
                jsx_files.append(os.path.join(root, file))
    
    updated_files = []
    
    for file_path in jsx_files:
        try:
            if update_colors_in_file(file_path):
                updated_files.append(file_path)
                print(f"Updated: {file_path}")
        except Exception as e:
            print(f"Error updating {file_path}: {e}")
    
    print(f"\nCompleted! Updated {len(updated_files)} files.")
    if updated_files:
        print("Updated files:")
        for file in updated_files:
            print(f"  - {file}")

if __name__ == "__main__":
    main()
