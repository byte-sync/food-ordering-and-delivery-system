"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAtom } from 'jotai';
import { locationAtom, confirmLocationAtom, setLocationAtom, LocationData } from '@/atoms/location-atoms';
import dynamic from 'next/dynamic';
import { MapPin } from 'lucide-react';

// Import MapComponent with dynamic import (no SSR) since Leaflet requires window object
const MapComponent = dynamic(() => import('./map-component').then(mod => mod.MapComponent), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center">
      <span className="text-gray-400">Loading map...</span>
    </div>
  ),
});

interface SelectedLocation {
  lat: number;
  lng: number;
  address: string;
}

interface MapSelectorProps {
  height?: string;
  onConfirmLocation?: (selectedLocation: SelectedLocation) => void;
}

export function MapSelector({ height = "400px", onConfirmLocation }: MapSelectorProps) {
  const [location, setLocation] = useAtom(locationAtom);
  const [, confirmLocation] = useAtom(confirmLocationAtom);
  
  const handleLocationChange = (newLocation: LocationData) => {
    setLocation(newLocation);
  };
  
  const handleConfirm = () => {
    confirmLocation();
    if (onConfirmLocation) {
      onConfirmLocation(location);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="w-full" style={{ height }}>
        <MapComponent 
          location={location} 
          onLocationChange={handleLocationChange} 
          height={height} 
        />
      </div>
      
      {location.address && (
        <div className="p-3 bg-gray-50 rounded-md">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Selected Location:</span>
          </div>
          <p className="mt-1 text-sm text-gray-600">{location.address}</p>
          <p className="text-xs text-gray-500">
            Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
          </p>
        </div>
      )}
      
      <Button 
        className="w-full" 
        onClick={handleConfirm}
        disabled={!location.address}
      >
        Confirm This Location
      </Button>
    </div>
  );
}