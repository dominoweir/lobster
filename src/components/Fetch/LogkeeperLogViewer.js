// @flow

import React from 'react';
import Fetch from '.';
import type { LogIdentity } from '../../models';
import type { ContextRouter } from 'react-router-dom';
import queryString from '../../thirdparty/query-string';

type Props = {
  url: string
} | ContextRouter;

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
  if (props.url === undefined) {
    const { server, url } = queryString.parse(
      props.location.search === '' ? props.location.hash : props.location.search
    );
    const { build, test } = props.match.params;
    const logID = makeLogkeeperLogID(build, test, server, url);
    return <Fetch {...props} logIdentity={logID} />;
  }
  const route = props.url.split('/');
  const build = route[6];
  const test = route[8];
  const logID = makeLogkeeperLogID(build, test, null, null);

  return <Fetch logIdentity={logID} />;
};

export default LogkeeperLogViewer;
