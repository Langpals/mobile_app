const tintColorLight = '#EB858C';
const tintColorDark = '#EB858C';

export default {
  light: {
    text: '#231F20', // Very dark grey
    background: '#F5F5F4', // Light grey-white
    tint: tintColorLight,
    tabIconDefault: '#F5F5F4', // Light grey-white
    tabIconSelected: tintColorLight,
    cardBackground: '#F5F5F4', // Light grey-white
    primary: '#EB858C', // Reddish
    secondary: '#088FFF', // Blue
    accent: '#FFCA0B', // Yellow
    success: '#088FFF', // Using blue for success
    warning: '#FFCA0B', // Using yellow for warning
    error: '#EB858C', // Using reddish for error
    border: '#F5F5F4', // Light grey-white
  },
  dark: {
    text: '#F5F5F4', // Light grey-white
    background: '#231F20', // Very dark grey
    tint: tintColorDark,
    tabIconDefault: '#F5F5F4',
    tabIconSelected: tintColorDark,
    cardBackground: '#F5F5F4', // Using light grey for dark card backgrounds
    primary: '#EB858C',
    secondary: '#088FFF',
    accent: '#FFCA0B',
    success: '#088FFF',
    warning: '#FFCA0B',
    error: '#EB858C',
    border: '#F5F5F4',
  },
};