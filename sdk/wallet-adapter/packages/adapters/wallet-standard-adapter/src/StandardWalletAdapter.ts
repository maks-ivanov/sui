// Copyright (c) 2022, Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { WalletAdapter } from "@mysten/wallet-adapter-base";
import { StandardWalletAdapterWallet } from "@mysten/wallet-standard";

export interface StandardWalletAdapterConfig {
  wallet: StandardWalletAdapterWallet;
}

export class StandardWalletAdapter implements WalletAdapter {
  connected = false;
  connecting = false;

  #wallet: StandardWalletAdapterWallet;

  constructor({ wallet }: StandardWalletAdapterConfig) {
    this.#wallet = wallet;
  }

  get name() {
    return this.#wallet.name;
  }

  async getAccounts() {
    return [];
  }
  async connect() {}
  async disconnect() {}
}
