// Copyright (c) 2022, Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import {
  MoveCallTransaction,
  SignableTransaction,
  SuiAddress,
  SuiTransactionResponse,
} from "@mysten/sui.js";

export interface WalletAdapter {
  // Metadata
  name: string;
  connected: boolean;
  connecting: boolean;
  // Connection Management
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;

  /**
   * Suggest a transaction for the user to sign. Supports all valid transaction types.
   */
  signAndExecuteTransaction?(
    transaction: SignableTransaction
  ): Promise<SuiTransactionResponse>;

  getAccounts: () => Promise<SuiAddress[]>;

  /** @deprecated Prefer `signAndExecuteTransaction` when available. */
  executeMoveCall?: (
    transaction: MoveCallTransaction
  ) => Promise<SuiTransactionResponse>;

  /** @deprecated Prefer `signAndExecuteTransaction` when available. */
  executeSerializedMoveCall?: (
    transactionBytes: Uint8Array
  ) => Promise<SuiTransactionResponse>;
}

type WalletAdapterProviderUnsubscribe = () => void;

/**
 * An interface that can dynamically provide wallet adapters. This is useful for
 * cases where the list of wallet adapters is dynamic.
 */
export interface WalletAdapterProvider {
  /** Get a list of wallet adapters from this provider. */
  get(): WalletAdapter[];
  /** Detect changes to the list of wallet adapters. */
  on(eventName: "changed"): WalletAdapterProviderUnsubscribe;
}
