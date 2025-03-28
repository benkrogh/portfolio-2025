export const BLOG_COLORS = {
  coral: '#EC6A5C',
  orange: '#F09456',
  blue: '#67B6EB',
  green: '#C1E5C3',
  purple: '#96A0FA',
} as const;

export const TEXT_COLOR = '#14120F';

// Get a color based on the post index or any other parameter
export const getPostColor = (index: number): string => {
  const colors = Object.values(BLOG_COLORS);
  // Ensure we always get a valid color by using modulo
  return colors[index % colors.length];
};

// Lighten a color for hover states
export const adjustColor = (hex: string, percent: number): string => {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
  const B = Math.min(255, (num & 0x0000ff) + amt);
  return `#${((1 << 24) | (R << 16) | (G << 8) | B).toString(16).slice(1)}`;
}; 