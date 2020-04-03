// @flow

import React from 'react';
import Fetch from '.';
import type { LogIdentity } from '../../models';

type Props = {
  url: string
}

function makeLogkeeperLogID(build: ?string, test: ?string, server: ?string, url: ?string): ?LogIdentity {
  if (server != null && url != null) {
    return {
      type: 'lobster',
      server: server,
      url: url
    };
  }

  if (build == null) {
    return null;
  }

  if (test == null) {
    return {
      type: 'logkeeper',
      build: build
    };
  }

  return {
    type: 'logkeeper',
    build: build,
    test: test
  };
}

const LogkeeperLogViewer = (props: Props) => {
  const server = null
  const url = null
  const build = 'f889d33f8a0914582fdc4b655a9334df'
  const test = '5e83d544f84ae874fb20978f'

  const logID = makeLogkeeperLogID(build, test, server, url);

  return (<Fetch logIdentity={logID} />);
};

export default LogkeeperLogViewer;
