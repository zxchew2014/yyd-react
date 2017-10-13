import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
//import decode from "jwt-decode";
import 'semantic-ui-css/semantic.min.css';
import { composeWithDevTools } from 'redux-devtools-extension';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import rootReducer from './rootReducer';
//import { browserHistory } from "react-router";
//import { userLoggedIn } from "./actions/auth";

//const router = routerMiddleware(browserHistory);
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

// if (localStorage.yydJWT) {
//   const payload = decode(localStorage.yydJWT);
//   const user = {
//     token: localStorage.yydJWT,
//     phoneNumber: payload.phoneNumber
//   };
//   store.dispatch(userLoggedIn(user));
// }

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);
registerServiceWorker();
