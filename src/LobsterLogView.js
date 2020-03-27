// @flow

import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { lobster } from './reducers';
import rootSaga from './sagas';
import urlParse from './sagas/urlParse';
import EvergreenLogViewer from './components/Fetch/EvergreenLogViewer';
import LogkeeperLogViewer from './components/Fetch/LogkeeperLogViewer';
import type { Line } from 'src/models';
import { logger } from 'redux-logger';
import { isProd } from './config';
import './index.css';

// Polyfills
import 'babel-polyfill';
import 'url-search-params-polyfill';
import 'whatwg-fetch';
// TODO: maybe Firefox support?
// import '../node_modules/idb.filesystem.js/dist/idb.filesystem.min.js';

const saga = createSagaMiddleware();
const middlewares = [saga];
if (!isProd) {
  middlewares.push(logger);
}

const store = createStore(lobster, applyMiddleware(...middlewares));
saga.run(urlParse);
saga.run(rootSaga);

const logviewer = (props) => (<LogkeeperLogViewer {...props} />);
const evergreenLogviewer = (props) => (<EvergreenLogViewer {...props} />);

const Main = () => (
  <main className="lobster">
    <Switch>
      <Route path="/lobster/build/:build/test/:test" render={logviewer} />
      <Route path="/lobster/build/:build/all" render={logviewer} />
      <Route exact path="/lobster/evergreen/task/:id/:execution/:type" render={evergreenLogviewer} />
      <Route exact path="/lobster/evergreen/test/:id" render={evergreenLogviewer} />
      <Route exact path="/lobster/evergreen/test/:id/:execution/:type" render={evergreenLogviewer} />
      <Route path="/lobster/logdrop" render={logviewer} />
    </Switch>
  </main>
);

type Props = {
  url: string
};

type State = {
  lines: Line[],
};

export default class LobsterLogView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      lines: []
    };
  }

  render() {
    return (
      <Provider store={store}>
        <Main />
      </Provider>
    );
  }
}
