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
import LogkeeperLogViewer from './components/Fetch/LogkeeperLogViewer';

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
  const isEvergreenLog = props.url.split('/')[2].includes('evergreen');
  return (
    <Provider store={store}>
      {isEvergreenLog ? (
        <EvergreenLogViewer url={props.url} />
      ) : (
        <LogkeeperLogViewer url={props.url} />
      )}
    </Provider>
  );
}

export default LobsterLogView;
