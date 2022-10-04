// Copyright (c) 2022, Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { WalletAdapterProvider } from "@mysten/wallet-adapter-base";
import {
  isStandardWalletAdapterCompatibleWallet,
  StandardWalletAdapterWallet,
} from "@mysten/wallet-standard";
import { initialize } from "@wallet-standard/app";
import { Wallets } from "@wallet-standard/standard";
import { StandardWalletAdapter } from "./StandardWalletAdapter";

export class WalletStandardAdapterProvider implements WalletAdapterProvider {
  #wallets: Wallets;
  #adapters: Map<StandardWalletAdapterWallet, StandardWalletAdapter>;

  constructor() {
    this.#adapters = new Map();
    this.#wallets = initialize();

    this.#wallets.on("register", () => {
      console.log("registered");
    });

    this.#wallets.on("unregister", () => {
      console.log("un-registered");
    });

    console.log(this.#wallets.get());
  }

  get() {
    const filtered = this.#wallets
      .get()
      .filter(isStandardWalletAdapterCompatibleWallet);

    filtered.forEach((wallet) => {
      if (!this.#adapters.has(wallet)) {
        this.#adapters.set(wallet, new StandardWalletAdapter({ wallet }));
      }
    });

    return [...this.#adapters.values()];
  }

  on(eventName: "changed") {
    return () => {};
  }
}
