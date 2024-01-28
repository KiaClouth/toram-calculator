import { type ThemeOptions } from '@mui/material/styles';
import tailwind from "tailwind.config"

export const themeOptions: ThemeOptions = {
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        "popper": ({ theme }) =>
          theme.unstable_sx({
            bgcolor: tailwind.theme.colors['bg-grey'][8]
          }),
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        // "root": {
        //   ":hover .MuiOutlinedInput-notchedOutline": {
        //     borderColor: tailwind.theme.colors['brand-color-orange']
        //   }
        // },
        "root": ({ theme }) =>
          theme.unstable_sx({
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: tailwind.theme.colors['brand-color-blue'],
            }
          }),
        "notchedOutline": {
          borderColor: tailwind.theme.colors['bg-grey'][8],
        },
      }
    }
  },
  transitions: {

  },
  palette: {
    mode: 'light',
    primary: {
      main: tailwind.theme.colors['main-color'][100],
    },
    secondary: {
      main: tailwind.theme.colors['brand-color-orange'],
      light: '#FF8A4F',
      dark: '#FF5500',
    },
    background: {
      default: '#F7F7F7',
      paper: '#F7F7F7',
    },
  },
};