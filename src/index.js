import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import { Main, Signin } from './pages';
import theme from './theme';
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import { StateProvider, InitialState, MainReducer } from './store'

const createHistory = require("history").createHashHistory

const APP = () => {
  return (
    <StateProvider initialState={InitialState} reducer={MainReducer}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router history={createHistory()}>
          <Switch>
            <Route key='signin' component={Signin} exact={true} path='/signin' />
            <Route key='main' component={Main} path='/' />
          </Switch>
        </Router>
      </ThemeProvider>
    </StateProvider>
  )
}

ReactDOM.render(
  <APP />,
  document.querySelector('#root'),
);
