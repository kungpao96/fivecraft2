import { Platform } from 'react-native';

/**
 * Applies web-specific optimizations when the app is running in a web browser
 */
export function applyWebOptimizations() {
  if (Platform.OS !== 'web') return;
  
  // Add event listeners for keyboard shortcuts
  setupKeyboardShortcuts();
  
  // Improve focus styles for accessibility
  improveFocusStyles();
  
  // Add service worker for offline support
  registerServiceWorker();
  
  // Optimize images
  setupLazyLoading();
}

/**
 * Sets up keyboard shortcuts for web users
 */
function setupKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    // Prevent browser back on backspace
    if (e.key === 'Backspace' && 
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
      e.preventDefault();
    }
    
    // Add other global shortcuts here
  });
}

/**
 * Improves focus styles for better accessibility
 */
function improveFocusStyles() {
  // Add a class to the body when using keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });
  
  // Remove the class when using mouse
  window.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });
}

/**
 * Registers a service worker for offline support
 */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registration successful');
        })
        .catch(error => {
          console.log('ServiceWorker registration failed:', error);
        });
    });
  }
}

/**
 * Sets up lazy loading for images
 */
function setupLazyLoading() {
  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.setAttribute('loading', 'lazy');
    });
  } else {
    // Could implement a fallback lazy loading solution here
  }
}