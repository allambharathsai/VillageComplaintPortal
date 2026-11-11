import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface MapPreviewProps {
  lat: number;
  lng: number;
  accuracy?: number;
  zoom?: number;
  heightClass?: string;
  popupText?: string;
}

export const MapPreview: React.FC<MapPreviewProps> = ({
  lat,
  lng,
  accuracy,
  zoom = 16,
  heightClass = 'h-48',
  popupText
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Fix leaflet default icon path issues in bundled React
    const customIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    const safeLat = typeof lat === 'number' && !isNaN(lat) ? lat : 16.7348;
    const safeLng = typeof lng === 'number' && !isNaN(lng) ? lng : 80.6198;

    if (!mapInstanceRef.current) {
      const map = L.map(containerRef.current, {
        center: [safeLat, safeLng],
        zoom: zoom,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      // Add zoom control in top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      const marker = L.marker([safeLat, safeLng], { icon: customIcon }).addTo(map);
      if (popupText) {
        marker.bindPopup(popupText).openPopup();
      }

      if (accuracy && accuracy > 0) {
        L.circle([safeLat, safeLng], {
          radius: accuracy,
          color: '#10b981',
          fillColor: '#34d399',
          fillOpacity: 0.2,
          weight: 1.5
        }).addTo(map);
      }

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([safeLat, safeLng], zoom);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, accuracy, zoom, popupText]);

  return (
    <div className={`relative w-full ${heightClass} rounded-xl overflow-hidden border border-slate-200 shadow-sm z-0`}>
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};
