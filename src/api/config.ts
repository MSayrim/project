// Platform tespiti için Capacitor'ü kullanalım
import { Capacitor } from '@capacitor/core';

function detectApiHost() {
  // Önce platformu tespit et
  const isNative = Capacitor.isNativePlatform();
  console.log('Platform:', isNative ? 'Native (Android/iOS)' : 'Web', 'Hostname:', typeof window !== 'undefined' ? window.location.hostname : 'unknown');
  
  // Native platformda (Android/iOS)
  if (isNative) {
    // Android Emülatör için
    if (Capacitor.getPlatform() === 'android') {
      return '10.0.2.2';
    }
    // Gerçek cihazlar için
    return '192.168.1.112';
  }
  
  // Web tarayıcıda
  return 'localhost';
}

export const API_ROOT = `http://${detectApiHost()}:8080`;

export const MIP_CONTEXT = '/mip';
export const API_URLS = {
  price: `${MIP_CONTEXT}/price`,
  foodSearch: `${MIP_CONTEXT}/food/search`,
  calculate: `${MIP_CONTEXT}/price`,
  // diğerleri...
};

console.log('API_ROOT:', API_ROOT);