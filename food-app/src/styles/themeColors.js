export const themeColors = {
  primary: {
    main: '#ff6b6b',
    light: '#ff9999',
    dark: '#ff3333',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#ffa500',
    light: '#ffcc66',
    dark: '#cc8400',
    contrastText: '#ffffff',
  },
  background: {
    light: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    dark: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  text: {
    light: {
      primary: '#333333',
      secondary: '#666666',
    },
    dark: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)',
    primaryReverse: 'linear-gradient(135deg, #ffa500 0%, #ff6b6b 100%)',
    auth: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 50%, #ffa500 100%)',
  },
  shadows: {
    light: {
      card: '0 4px 8px rgba(0, 0, 0, 0.1)',
      cardHover: '0 8px 16px rgba(0, 0, 0, 0.15)',
      navbar: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    dark: {
      card: '0 4px 8px rgba(0, 0, 0, 0.3)',
      cardHover: '0 8px 16px rgba(0, 0, 0, 0.4)',
      navbar: '0 2px 8px rgba(0, 0, 0, 0.3)',
    },
  },
  glass: {
    light: {
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
    },
    dark: {
      background: 'rgba(30, 30, 30, 0.85)', 
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
  },
};
