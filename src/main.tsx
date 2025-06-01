import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App.tsx';
import './i18n';
import './index.css';

// Capacitor plugins
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App as CapApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

// Initialize Capacitor plugins
const initializeCapacitor = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      // Set status bar style
      await StatusBar.setStyle({ style: Style.Dark });
      
      // Set status bar background color (only for Android)
      if (Capacitor.getPlatform() === 'android') {
        await StatusBar.setBackgroundColor({ color: '#ffffff' });
      }
      
      // Hide splash screen with fade
      await SplashScreen.hide({
        fadeOutDuration: 500
      });
      
      // Handle back button for Android
      CapApp.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
          CapApp.exitApp();
        } else {
          window.history.back();
        }
      });
    } catch (error) {
      console.error('Error initializing Capacitor plugins:', error);
    }
  }
};

// Call the initialization function
initializeCapacitor();

const AppWrapper = () => {
  useEffect(() => {
    // Add any additional initialization here
    document.addEventListener('touchstart', function() {}, { passive: true });
  }, []);

  return (
    <StrictMode>
      <HelmetProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </HelmetProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<AppWrapper />);