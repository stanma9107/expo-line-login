import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to ExpoLineLogin.web.ts
// and on native platforms to ExpoLineLogin.ts
import ExpoLineLoginModule from './ExpoLineLoginModule';
import ExpoLineLoginView from './ExpoLineLoginView';
import { ChangeEventPayload, ExpoLineLoginViewProps } from './ExpoLineLogin.types';

// Get the native constant value.
export const PI = ExpoLineLoginModule.PI;

export function hello(): string {
  return ExpoLineLoginModule.hello();
}

export async function setValueAsync(value: string) {
  return await ExpoLineLoginModule.setValueAsync(value);
}

const emitter = new EventEmitter(ExpoLineLoginModule ?? NativeModulesProxy.ExpoLineLogin);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ExpoLineLoginView, ExpoLineLoginViewProps, ChangeEventPayload };
