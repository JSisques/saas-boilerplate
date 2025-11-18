'use client';

import React, { createContext, useContext } from 'react';
import { SDK } from '../index.js';
import type { Storage } from '../shared/storage/storage.interface.js';
import { useSDK } from './hooks/use-sdk.js';

type SDKContextValue = SDK | null;

const SDKContext = createContext<SDKContextValue>(null);

export type SDKProviderProps = {
  sdk: SDK;
  children: React.ReactNode;
};

export function SDKProvider({ sdk, children }: SDKProviderProps) {
  return React.createElement(SDKContext.Provider, { value: sdk }, children);
}

export type SDKAutoProviderProps = {
  /**
   * GraphQL API base URL
   */
  apiUrl: string;
  /**
   * Optional storage implementation to persist tokens
   */
  storage?: Storage;
  children: React.ReactNode;
};

/**
 * Convenience provider that creates the SDK instance from an apiUrl (and optional storage)
 * and injects it into context, avoiding repetition in apps.
 */
export function SDKAutoProvider({
  apiUrl,
  storage,
  children,
}: SDKAutoProviderProps) {
  const sdk = useSDK({ apiUrl }, storage);
  return React.createElement(SDKContext.Provider, { value: sdk }, children);
}

export function useSDKContext(): SDK {
  const ctx = useContext(SDKContext);
  if (!ctx) {
    throw new Error(
      'SDK not found in context. Wrap your app with <SDKProvider sdk={sdk} /> or pass the sdk instance to the hook.',
    );
  }
  return ctx;
}

export function useSDKOptional(): SDK | null {
  return useContext(SDKContext);
}
