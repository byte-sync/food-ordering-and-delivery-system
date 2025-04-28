"use client";

import { useState, useEffect, useRef } from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Dynamic import for Leaflet components
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
import { useMap } from 'react-leaflet';

// Define the LocationData interface
interface LocationData {
  lat: number;
  lng: number;
  address: string;
}

interface MapComponentProps {
  location: LocationData;
  onLocationChange: (location: LocationData) => void;
  height: string;
}

// Add interface for search suggestions
interface SearchSuggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

// Component to handle map events
function MapEventHandler({ onLocationChange }: { onLocationChange: (location: LocationData) => void }) {
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;
    
    const handleClick = async (e: any) => {
      const { lat, lng } = e.latlng;
      const address = await reverseGeocode(lat, lng);
      onLocationChange({ lat, lng, address });
    };
    
    map.on('click', handleClick);
    
    return () => {
      map.off('click', handleClick);
    };
  }, [map, onLocationChange]);
  
  return null;
}

// Component to display marker
function LocationMarkerComponent({ location, onLocationChange }: { 
  location: LocationData;
  onLocationChange: (location: LocationData) => void;
}) {
  const map = useMap();
  
  // Initialize Leaflet icons globally
  useEffect(() => {
    if (typeof window !== 'undefined') {
      L.Icon.Default.mergeOptions({
        iconUrl: '/marker-icon.png',
        iconRetinaUrl: '/marker-icon-2x.png',
        shadowUrl: '/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
    }
  }, []);
  
  useEffect(() => {
    if (!map || !location?.lat || !location?.lng) return;
    
    // Create a marker using the default icon
    const marker = L.marker([location.lat, location.lng], { 
      // Use the default icon (which we've configured above)
      draggable: true
    }).addTo(map);
    
    // Add popup
    if (location.address) {
      marker.bindPopup(location.address).openPopup();
    }
    
    // Handle drag events to update location
    marker.on('dragend', async function(e) {
      const position = marker.getLatLng();
      const address = await reverseGeocode(position.lat, position.lng);
      onLocationChange({
        lat: position.lat,
        lng: position.lng,
        address
      });
    });
    
    // Center map on marker
    map.setView([location.lat, location.lng], map.getZoom());
    
    // Return a cleanup function
    return () => {
      map.removeLayer(marker);
    };
  }, [map, location, onLocationChange]);
  
  // We don't use the react-leaflet Marker component
  return null;
}

// Geocoding functions
async function geocode(address: string): Promise<[number, number] | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

// Function to get search suggestions
async function getSuggestions(query: string): Promise<SearchSuggestion[]> {
  if (!query || query.length < 3) return [];
  
  try {
    console.log("Fetching suggestions for:", query);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
    );
    const data = await response.json();
    console.log("Received suggestions:", data);
    return data;
  } catch (error) {
    console.error('Suggestions error:', error);
    return [];
  }
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    const data = await response.json();
    
    if (data && data.display_name) {
      return data.display_name;
    }
    return '';
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return '';
  }
}

export function MapComponent({ location, onLocationChange, height }: MapComponentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  // Add CSS for the custom marker
  useEffect(() => {
    // Create style element for custom marker
    const style = document.createElement('style');
    style.textContent = `
      .custom-map-marker {
        background: none !important;
        border: none !important;
        box-shadow: none !important;
        outline: none !important;
      }
      
      .custom-marker-container {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .custom-marker-pin {
        width: 30px;
        height: 40px;
        position: relative;
        background-color: #3b82f6;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        overflow: hidden;
      }
      
      .custom-marker-pin::after {
        content: '';
        width: 22px;
        height: 22px;
        background: white;
        border-radius: 50%;
        position: absolute;
      }
      
      .custom-marker-icon {
        width: 20px;
        height: 20px;
        color: #3b82f6;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
        z-index: 10;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle search query change with debounce
  useEffect(() => {
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Don't search for very short queries
    if (searchQuery.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    // Set a new timeout
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await getSuggestions(searchQuery);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    }, 500);
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);
  
  const initialLocation = location && location.lat && location.lng 
    ? [location.lat, location.lng] 
    : [6.9271, 79.8612]; // Default to Colombo, Sri Lanka
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setShowSuggestions(false);
    try {
      const coordinates = await geocode(searchQuery);
      
      if (coordinates) {
        const [lat, lng] = coordinates;
        const address = await reverseGeocode(lat, lng);
        onLocationChange({ lat, lng, address });
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleSuggestionClick = async (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.display_name);
    setShowSuggestions(false);
    
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    onLocationChange({ 
      lat, 
      lng, 
      address: suggestion.display_name 
    });
  };

  return (
    <div className="space-y-2">
      <div className="relative" style={{ zIndex: 1000 }} ref={suggestionsRef}>
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for a location..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0 && searchQuery.length >= 3) {
                  setShowSuggestions(true);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch(e);
                }
              }}
            />
            
            {showSuggestions && suggestions.length > 0 && (
              <div 
                className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white rounded-md border shadow-lg"
                style={{ zIndex: 1100 }}
              >
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.place_id}
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 focus:bg-slate-100 focus:outline-none text-sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.display_name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button 
            type="button" 
            onClick={handleSearch}
            size="sm"
            disabled={isSearching}
          >
            {isSearching ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Searching...
              </>
            ) : (
              'Search'
            )}
          </Button>
        </div>
      </div>
      
      <div style={{ 
        height, 
        width: '100%', 
        position: 'relative',
        zIndex: 1 
      }}>
        <MapContainer
          center={initialLocation as [number, number]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarkerComponent location={location} onLocationChange={onLocationChange} />
          <MapEventHandler onLocationChange={onLocationChange} />
        </MapContainer>
      </div>
      
      {location && location.address && (
        <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-2 rounded text-xs">
          <strong>Selected location:</strong> {location.address}
        </div>
      )}
    </div>
  );
}