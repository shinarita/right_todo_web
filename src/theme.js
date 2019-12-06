import { red, green } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red[500],
      light: red[300],
      dark: red[700]
    },
    background: {
      default: '#fff',
    },
    success: green[500]
  },
});

export default theme;
