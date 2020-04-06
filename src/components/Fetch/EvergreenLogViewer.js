// @flow

import React from 'react';
import Fetch from '.';
import { stringToEvergreenTaskLogType, type LogIdentity, typeIsTaskLogType } from '../../models';
import type { ContextRouter } from 'react-router-dom';

type URLProps = {
  url: string
};

type Props = URLProps | ContextRouter;

function makeEvergreenLogID(isTest: boolean, id: ?string, type: ?string, execution: ?string): ?LogIdentity {
  if (id == null) {
    return null;
  }

  if (type != null) {
    if (isTest) {
      return {
        type: 'evergreen-test-by-name',
        task: id,
        execution: parseInt(execution, 10),
        test: type
      };
    }
    if (!typeIsTaskLogType(type)) {
      console.log('wrong path')
      const logType = stringToEvergreenTaskLogType(type);
      if (logType == null) {
        return null;
      }
      return {
        type: 'evergreen-task',
        id: id,
        execution: parseInt(execution, 10) || 0,
        log: logType
      };
    }
    return {
      type: 'evergreen-task',
      id: id,
      execution: parseInt(execution, 10) || 0,
      log: type
    };
  }

  return {
    type: 'evergreen-test',
    id: id
  };
}

const lineRegex = new RegExp('#L([0-9]+)');

const EvergreenLogViewer = (props: Props) => {
  let logID = {};
  if (props.url === undefined) {
    const newProps = Object.assign({}, props);
    const matches = lineRegex.exec(props.location.hash);
    if (matches && matches.length > 1) {
      const line = matches[1];
      newProps.location.hash = `#scroll=${line}&bookmarks=${line}`;
    }
    const { id, type, execution } = props.match.params;
    logID = makeEvergreenLogID(props.location.pathname.startsWith('/lobster/evergreen/test/'), id, type, execution);
  } else {
    const route = props.url.split('/');
    let id = null;
    let type = null;
    let execution = null;
    let isTest = false;
    if (route[3] === 'test_log') {
      isTest = true;
      id = route[4].split('?')[0];
    } else if (route[3] === 'task_log_raw') {
      id = route[4];
      execution = route[5].split('?')[0];
      type = route[5].split('?')[1].split('=')[1].split('&')[0];
    }
    logID = makeEvergreenLogID(isTest, id, type, execution);
  }

  return (<Fetch logIdentity={logID} />);
};

export default EvergreenLogViewer;
