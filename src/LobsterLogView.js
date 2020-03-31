// @flow

import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';
import type { ContextRouter, Match } from 'react-router-dom';
import { lobster } from './reducers';
import rootSaga from './sagas';
import urlParse from './sagas/urlParse';
import EvergreenLogViewer from './components/Fetch/EvergreenLogViewer';
import LogkeeperLogViewer from './components/Fetch/LogkeeperLogViewer';
import { logger } from 'redux-logger';
import { isProd } from './config';
import type { EvergreenTaskLog } from './models';
import * as actions from './actions';
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

const logkeeperLogviewer = (props) => (<LogkeeperLogViewer {...props} />);
const evergreenLogviewer = (props) => (<EvergreenLogViewer {...props} />);

type Props = {
  url: string
};

type State = {
  logType: string
};

export default class LobsterLogView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const identity:EvergreenTaskLog = {
      id: 'evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48',
      execution: 0,
      log: 'T',
      type: 'evergreen-task'
    };
    store.dispatch(actions.loadLog(identity));
  }

  render() {
    const match:Match = {
      isExact: false,
      params: {},
      url: this.props.url,
      path: ''
    }
    const ctx:ContextRouter = {
      history: window.history,
      location: window.location,
      match: match
    }
    return (
      <Provider store={store}>
        <React.Fragment>
          { evergreenLogviewer(ctx) }
        </React.Fragment>
      </Provider>
    );
  }
}
