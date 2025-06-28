import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Google Maps API yükleme işlemi için tip tanımları
declare global {
  interface Window {
    initGoogleMaps: () => void;
    google: any;
  }
}

interface GoogleMapsComponentProps {
  apiKey: string;
  onDistanceCalculated: (distanceInKm: number) => void;
}

const GoogleMapsComponent: React.FC<GoogleMapsComponentProps> = ({ apiKey, onDistanceCalculated }) => {
  const { t } = useTranslation();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [startLocation, setStartLocation] = useState<string>('');
  const [endLocation, setEndLocation] = useState<string>('');
  const [distance, setDistance] = useState<string>('');
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const mapRef = useRef<HTMLDivElement>(null);
  const startAutocompleteRef = useRef<HTMLInputElement>(null);
  const endAutocompleteRef = useRef<HTMLInputElement>(null);

  const startAutocomplete = useRef<google.maps.places.Autocomplete | null>(null);
  const endAutocomplete = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        initMap();
        return;
      }

      if (window.initGoogleMaps) {
        return; // Zaten yükleniyor
      }

      window.initGoogleMaps = initMap;

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      const style = document.createElement('style');
      style.innerHTML = `
        .pac-container {
          position: absolute !important;
          top: 100% !important; 
          left: 0 !important;
          width: 100% !important;
          z-index: 1000 !important;
          background-color: #fff;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid rgba(139, 92, 246, 0.3);
          font-family: inherit;
          margin-top: 4px;
        }
        .dark .pac-container {
          background-color: #1f2937;
          border: 1px solid rgba(139, 92, 246, 0.4);
        }
        .pac-item {
          padding: 8px 12px;
          cursor: pointer;
          color: #1a202c; /* Dark text for light mode */
        }
        .dark .pac-item {
          color: #e5e7eb !important; /* Light text for dark mode */
        }
        .pac-item:hover {
          background-color: rgba(139, 92, 246, 0.1);
        }
        .dark .pac-item:hover {
          background-color: rgba(139, 92, 246, 0.2);
        }
        .pac-item-selected {
          background-color: rgba(139, 92, 246, 0.2);
        }
        .dark .pac-item-selected {
          background-color: rgba(139, 92, 246, 0.3);
        }
        .pac-icon {
          margin-right: 8px;
        }
        .dark .pac-item-query,
        .dark .pac-item span {
          color: #f7fafc !important; /* Ensure all text within items is light in dark mode */
        }
      `;
      document.head.appendChild(style);
    };

    loadGoogleMaps();

    return () => {
      const script = document.querySelector(`script[src*="${apiKey}"]`);
      if (script) {
        // document.head.removeChild(script);
      }
      delete window.initGoogleMaps;
    };
  }, [apiKey]);

  const initMap = () => {
    if (mapRef.current && window.google) {
      // Türkiye'nin ortasından başlat
      const defaultLocation = { lat: 39.9334, lng: 32.8597 }; // Ankara

      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: defaultLocation,
        zoom: 6,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: false,
      });

      setMap(mapInstance);

      // Yön servisi ve görselleştiriciyi ayarla
      const directionsServiceInstance = new window.google.maps.DirectionsService();
      const directionsRendererInstance = new window.google.maps.DirectionsRenderer({
        map: mapInstance,
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: '#8B5CF6', // Mor renk (violet-500)
          strokeWeight: 5,
        },
      });

      setDirectionsService(directionsServiceInstance);
      setDirectionsRenderer(directionsRendererInstance);

      // Otomatik tamamlama alanlarını ayarla
      if (startAutocompleteRef.current && endAutocompleteRef.current) {
        const startAutocompleteInstance = new window.google.maps.places.Autocomplete(
          startAutocompleteRef.current,
          { types: ['geocode'], fields: ['formatted_address', 'geometry'] },
        );
        const endAutocompleteInstance = new window.google.maps.places.Autocomplete(
          endAutocompleteRef.current,
          { types: ['geocode'], fields: ['formatted_address', 'geometry'] },
        );

        startAutocomplete.current = startAutocompleteInstance;
        endAutocomplete.current = endAutocompleteInstance;

        const onInputFocus = (e: FocusEvent) => {
          const input = e.target as HTMLInputElement;
          const pacContainer = document.querySelector('.pac-container');
          if (pacContainer && input.parentElement) {
            input.parentElement.appendChild(pacContainer);
          }
        };

        const onInputBlur = () => {
          // Delay moving the container to allow for clicks on suggestions.
          setTimeout(() => {
            const pacContainer = document.querySelector('.pac-container');
            if (pacContainer && pacContainer.parentElement !== document.body) {
              document.body.appendChild(pacContainer);
            }
          }, 200);
        };

        if (startAutocompleteRef.current && endAutocompleteRef.current) {
          startAutocompleteRef.current.addEventListener('focus', onInputFocus);
          endAutocompleteRef.current.addEventListener('focus', onInputFocus);

          startAutocompleteRef.current.addEventListener('blur', onInputBlur);
          endAutocompleteRef.current.addEventListener('blur', onInputBlur);
        }

        startAutocompleteInstance.addListener('place_changed', () => {
          const place = startAutocompleteInstance.getPlace();
          setStartLocation(place.formatted_address || '');
        });

        endAutocompleteInstance.addListener('place_changed', () => {
          const place = endAutocompleteInstance.getPlace();
          setEndLocation(place.formatted_address || '');
        });
      }
    }
  };

  const calculateRoute = () => {
    if (!directionsService || !directionsRenderer || !startLocation || !endLocation) {
      setError(t('vehicle.maps.bothLocationsRequired'));
      return;
    }

    setIsCalculating(true);
    setError('');

    directionsService.route(
      {
        origin: startLocation,
        destination: endLocation,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        setIsCalculating(false);

        if (status === window.google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);

          // Mesafeyi al ve kilometre olarak hesapla
          const route = result?.routes[0];
          if (route && route.legs.length > 0) {
            const leg = route.legs[0];
            const distanceInMeters = leg.distance.value;
            const distanceInKm = distanceInMeters / 1000;

            setDistance(`${leg.distance.text} (${leg.duration.text})`);
            onDistanceCalculated(distanceInKm); // Üst bileşene kilometre olarak bildir
          }
        } else {
          setError(t('vehicle.maps.routeError'));
          directionsRenderer.setDirections({ routes: [] });
        }
      },
    );
  };

  const swapLocations = () => {
    setStartLocation(endLocation);
    setEndLocation(startLocation);

    // Eğer hesaplanmış rota varsa, yeni lokasyonlarla tekrar hesapla
    if (startLocation && endLocation) {
      setTimeout(calculateRoute, 100);
    }
  };

  return (
    <div className="my-4 border-2 border-violet-200 dark:border-violet-900/30 rounded-xl p-4 bg-gray-50 dark:bg-gray-800">
      <h3 className="text-lg font-bold mb-3 text-violet-700 dark:text-violet-300">{t('vehicle.maps.title')}</h3>

      <div className="mb-4 flex flex-col md:flex-row gap-2">
        <div className="flex-1 relative">
          <input
            ref={startAutocompleteRef}
            type="text"
            placeholder={t('vehicle.maps.startLocation')}
            className="w-full p-2 pl-8 rounded-lg border-2 border-violet-200 dark:border-violet-900/40 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-violet-400 transition"
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
          />
          <span className="absolute top-2.5 left-2 text-violet-500">🚩</span>
        </div>

        <button
          onClick={swapLocations}
          className="py-2 px-3 rounded-lg bg-violet-100 hover:bg-violet-200 dark:bg-violet-900 dark:hover:bg-violet-800 text-violet-700 dark:text-violet-200 transition"
          title={t('vehicle.maps.swapLocations')}
        >
          ⇄
        </button>

        <div className="flex-1 relative">
          <input
            ref={endAutocompleteRef}
            type="text"
            placeholder={t('vehicle.maps.endLocation')}
            className="w-full p-2 pl-8 rounded-lg border-2 border-violet-200 dark:border-violet-900/40 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-violet-400 transition"
            value={endLocation}
            onChange={(e) => setEndLocation(e.target.value)}
          />
          <span className="absolute top-2.5 left-2 text-violet-500">📍</span>
        </div>

        <button
          onClick={calculateRoute}
          className="py-2 px-4 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium transition disabled:opacity-50"
          disabled={isCalculating || !startLocation || !endLocation}
        >
          {isCalculating ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('vehicle.maps.calculating')}
            </span>
          ) : (
            t('vehicle.maps.calculate')
          )}
        </button>
      </div>

      {error && (
        <div className="mb-3 p-2 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-lg text-sm">
          ⚠️ {error}
        </div>
      )}

      {distance && (
        <div className="mb-3 p-2 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-200 rounded-lg text-sm flex items-center justify-between">
          <span className="font-medium">📏 {t('vehicle.maps.distance')}: {distance}</span>
          <button
            onClick={() => {
              setDistance('');
              setStartLocation('');
              setEndLocation('');
              directionsRenderer?.setDirections({ routes: [] });
            }}
            className="text-xs text-green-600 dark:text-green-300 hover:underline"
          >
            {t('common.reset')}
          </button>
        </div>
      )}

      <div ref={mapRef} className="w-full h-[300px] rounded-lg shadow-inner border-2 border-violet-100 dark:border-violet-900/20"></div>
    </div>
  );
};

export default GoogleMapsComponent;
