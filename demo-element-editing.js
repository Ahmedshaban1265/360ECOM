// Export for Node.js environments (guarded for browsers)
try {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      demonstrateElementEditing,
      demonstrateImageLibrary,
      demonstrateElementDiscovery
    };
  }
} catch (e) {
  // no-op in browser
}