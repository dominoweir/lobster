// @flow

import React from 'react';
import Fetch from '.';
import { stringToEvergreenTaskLogType, type LogIdentity } from '../../models';

type Props = {
  url: string
}

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
    type: 'evergreen-test',
    id: id
  };
}

const lineRegex = new RegExp('#L([0-9]+)');

const EvergreenLogViewer = (props: Props) => {
  const id = '5e8541ac9dbe3228b5a3cbc2';
  const type = null;
  const execution = '0';
  const logID = makeEvergreenLogID(false, id, type, execution);

  return (<Fetch logIdentity={logID} />);
};

export default EvergreenLogViewer;
