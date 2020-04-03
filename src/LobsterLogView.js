// @flow

import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';
import { lobster } from './reducers';
import rootSaga from './sagas';
import urlParse from './sagas/urlParse';
import { logger } from 'redux-logger';
import { isProd } from './config';
import './index.css';
import EvergreenLogViewer from './components/Fetch/EvergreenLogViewer';

const saga = createSagaMiddleware();
const middlewares = [saga];
if (!isProd) {
  middlewares.push(logger);
}

const store = createStore(lobster, applyMiddleware(...middlewares));
saga.run(urlParse);
saga.run(rootSaga);

type Props = {
  url: string
};

function LobsterLogView(props: Props) {
  return (
    <Provider store={store}>
      <EvergreenLogViewer url={props.url} />
    </Provider>
  );
}

export default LobsterLogView;
