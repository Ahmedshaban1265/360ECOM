#!/bin/bash

# Script to update emerald colors to blue colors across all JSX files
echo "Updating emerald colors to blue colors..."

# Function to replace emerald colors with blue colors
replace_colors() {
    # Basic emerald to blue replacements
    find src -name "*.jsx" -type f -exec sed -i 's/emerald-600/blue-600/g' {} \;
    find src -name "*.jsx" -type f -exec sed -i 's/emerald-700/blue-700/g' {} \;
    find src -name "*.jsx" -type f -exec sed -i 's/emerald-500/blue-500/g' {} \;
    find src -name "*.jsx" -type f -exec sed -i 's/emerald-400/blue-400/g' {} \;
    find src -name "*.jsx" -type f -exec sed -i 's/emerald-800/blue-800/g' {} \;
    find src -name "*.jsx" -type f -exec sed -i 's/emerald-900/blue-900/g' {} \;
    find src -name "*.jsx" -type f -exec sed -i 's/emerald-100/blue-100/g' {} \;
    find src -name "*.jsx" -type f -exec sed -i 's/emerald-50/blue-50/g' {} \;

    # Update gradients to use blue as primary color instead of emerald
    find src -name "*.jsx" -type f -exec sed -i 's/from-blue-600 via-blue-600 to-purple-600/from-blue-600 via-blue-700 to-blue-800/g' {} \;
    find src -name "*.jsx" -type f -exec sed -i 's/from-blue-600 via-blue-700 to-purple-600/from-blue-600 via-blue-700 to-blue-800/g' {} \;
    find src -name "*.jsx" -type f -exec sed -i 's/from-blue-700 via-blue-700 to-purple-700/from-blue-700 via-blue-800 to-blue-900/g' {} \;
    find src -name "*.jsx" -type f -exec sed -i 's/from-blue-800 via-blue-700 to-blue-600/from-blue-800 via-blue-700 to-blue-600/g' {} \;
    
    echo "Color replacements completed!"
}

# Run the replacement function
replace_colors

echo "Script completed!"
