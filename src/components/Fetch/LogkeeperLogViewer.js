// @flow

import React from 'react';
import Fetch from '.';
import type { LogIdentity } from '../../models';
import type { ContextRouter } from 'react-router-dom';
import queryString from '../../thirdparty/query-string';

type URLProps = {
  url: string
};

type Props = URLProps | ContextRouter;

function makeLogkeeperLogID(
  build: ?string,
  test: ?string,
  server: ?string,
  url: ?string
): ?LogIdentity {
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
  let logID = {};
  if (props.url === undefined) {
    const { server, url } = queryString.parse(
      props.location.search === '' ? props.location.hash : props.location.search
    );
    const { build, test } = props.match.params;
    logID = makeLogkeeperLogID(build, test, server, url);
  } else {
    const route = props.url.split('/');
    const server = null;
    const url = null;
    const build = route[6];
    const test = route[8];
    logID = makeLogkeeperLogID(build, test, server, url);
  }

  return <Fetch logIdentity={logID} />;
};

export default LogkeeperLogViewer;
