const tintColorLight = '#FF6B6B'; // Cheerful coral
const tintColorDark = '#FF9B9B';

export default {
  light: {
    text: '#2C3E50', // Dark blue-gray for readability
    background: '#FFFFFF', // Pure white background
    tint: tintColorLight,
    tabIconDefault: '#A0AEC0',
    tabIconSelected: tintColorLight,
    cardBackground: '#FFFFFF', // White card backgrounds
    primary: '#FF6B6B', // Cheerful coral
    secondary: '#4CAF50', // Green
    accent: '#FFB74D', // Orange
    success: '#4CAF50', // Green
    warning: '#FF9800', // Orange
    error: '#F44336', // Red
    border: '#E0E0E0', // Light gray border
  },
  dark: {
    text: '#F7FAFC',
    background: '#1A202C',
    tint: tintColorDark,
    tabIconDefault: '#718096',
    tabIconSelected: tintColorDark,
    cardBackground: '#2D3748',
    primary: '#FF9B9B', // Lighter coral
    secondary: '#68D391', // Lighter green
    accent: '#FFD080', // Lighter orange
    success: '#68D391', // Lighter green
    warning: '#FBB040', // Lighter orange
    error: '#FC8181', // Lighter red
    border: '#4A5568',
  },
};