import { atom } from 'jotai';

// Define the location data interface
export interface LocationData {
  lat: number;
  lng: number;
  address: string;
}

// Default initial state
const defaultLocation: LocationData = {
  lat: 6.9271, 
  lng: 79.8612,
  address: '',
};

// Create atoms
export const locationAtom = atom<LocationData>(defaultLocation);
export const locationSelectedAtom = atom<boolean>(false);
export const showMapAtom = atom<boolean>(false);

// Derived atom that gets the current location
export const currentLocationAtom = atom(
  (get) => get(locationAtom)
);

// Actions as atoms (functions that can update state)
export const setLocationAtom = atom(
  null,
  (get, set, newLocation: LocationData) => {
    set(locationAtom, newLocation);
  }
);

export const confirmLocationAtom = atom(
  null,
  (get, set) => {
    set(locationSelectedAtom, true);
  }
);

export const toggleMapAtom = atom(
  null,
  (get, set, isOpen: boolean) => {
    set(showMapAtom, isOpen);
  }
);