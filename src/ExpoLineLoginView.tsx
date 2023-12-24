import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ExpoLineLoginViewProps } from './ExpoLineLogin.types';

const NativeView: React.ComponentType<ExpoLineLoginViewProps> =
  requireNativeViewManager('ExpoLineLogin');

export default function ExpoLineLoginView(props: ExpoLineLoginViewProps) {
  return <NativeView {...props} />;
}
