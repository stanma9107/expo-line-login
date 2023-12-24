import * as React from 'react';

import { ExpoLineLoginViewProps } from './ExpoLineLogin.types';

export default function ExpoLineLoginView(props: ExpoLineLoginViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
