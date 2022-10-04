// Copyright (c) 2022, Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import {
  MoveCallTransaction,
  SignableTransaction,
  SuiAddress,
  SuiTransactionResponse,
} from "@mysten/sui.js";
import { createContext, useContext } from "react";
import { WalletAdapter, WalletAdapterList } from "@mysten/wallet-adapter-base";

export interface Wallet {
  adapter: WalletAdapter;
}

export interface WalletContextState {
  adapters: WalletAdapterList;
  // Wallet that we are currently connected to
  wallet: Wallet | null;

  connecting: boolean;
  connected: boolean;
  // disconnecting: boolean;

  select(walletName: string): void;
  connect(): Promise<void>;
  disconnect(): Promise<void>;

  getAccounts: () => Promise<SuiAddress[]>;

  signAndExecuteTransaction(
    transaction: SignableTransaction
  ): Promise<SuiTransactionResponse>;

  /** @deprecated Prefer `signAndExecuteTransaction` when available. */
  executeMoveCall: (
    transaction: MoveCallTransaction
  ) => Promise<SuiTransactionResponse>;
  /** @deprecated Prefer `signAndExecuteTransaction` when available. */
  executeSerializedMoveCall: (
    transactionBytes: Uint8Array
  ) => Promise<SuiTransactionResponse>;
}

export const WalletContext = createContext<WalletContextState | null>(
  null
);

export function useWallet(): WalletContextState {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error('You tried to access the `WalletContext` outside of the `WalletProvider`.');
  }

  return context;
}
