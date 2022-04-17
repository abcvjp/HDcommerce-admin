import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import { Provider } from 'react-redux';
import GlobalStyles from './components/GlobalStyles';
import './mixins/chartjs';
import theme from './theme';
import store from './store';
import GlobalComponents from './components/global';
import { setUser } from './actions/user';
import Routing from './components/Routing';

const App = () => {
  const savedUser = sessionStorage.getItem('user');
  if (savedUser) {
    store.dispatch(setUser(JSON.parse(savedUser)));
  }
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Provider store={store}>
        <BrowserRouter>
          <Routing />
        </BrowserRouter>
        <GlobalComponents />
      </Provider>
    </ThemeProvider>
  );
};

export default App;
