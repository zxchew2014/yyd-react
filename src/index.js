import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import 'semantic-ui-css/semantic.min.css';
import { composeWithDevTools } from 'redux-devtools-extension';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import rootReducer from './reducers/rootReducer';
import { userLoggedIn } from './actions/auth';
import firebase from 'firebase/compat/app';
import { config } from './utils/firebase';
import { fetchTeacher } from './actions/teachers';
import { fetchFeatureFlagList } from "./actions/feature_flag";

firebase.initializeApp(config);

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

if (localStorage.user) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      store.dispatch(fetchFeatureFlagList());
      store.dispatch(fetchTeacher(user));
      store.dispatch(userLoggedIn(user));

    }
  });
}

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <Route component={App} />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);
registerServiceWorker();
