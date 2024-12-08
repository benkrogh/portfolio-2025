import { atom } from 'nanostores';

// Initialize with the current path from window if available, otherwise empty string
const initialPath = typeof window !== 'undefined' ? window.location.pathname : '';
export const currentPath = atom<string>(initialPath); 