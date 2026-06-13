'use strict';

import Stream from 'node:stream';

// TODO: use a third party library for this

export const isReadableStreamShape = (stream: object): boolean => {
  return (
    'readable' in stream &&
    !!stream['readable'] &&
    'pipe' in stream &&
    typeof stream['pipe'] === 'function' &&
    'read' in stream &&
    typeof stream['read'] === 'function' &&
    typeof stream['readable'] === 'boolean' &&
    'readableObjectMode' in stream &&
    typeof stream['readableObjectMode'] === 'boolean' &&
    'destroy' in stream &&
    typeof stream['destroy'] === 'function' &&
    'destroyed' in stream &&
    typeof stream['destroyed'] === 'boolean'
  );
};

export const isStream = (stream: unknown): stream is Stream => {
  return stream instanceof Stream || (stream !== null && typeof stream === 'object' && isReadableStreamShape(stream));
};
