import { WalletAdapterProvider } from '@mysten/wallet-adapter-base';
import { initialize } from "@wallet-standard/app";
import { Wallets } from "@wallet-standard/standard";

export class WalletStandardAdapter implements WalletAdapterProvider {
  #wallets: Wallets;

  constructor() {
    this.#wallets = initialize();

    this.#wallets.on('register', () => {
      console.log('registered')
    });

    this.#wallets.on('unregister', () => {
      console.log('un-registered');
    });

    console.log(this.#wallets.get());
  }

  get() {
    return this.#wallets;
  }

  on(eventName: 'changed') {
    return () => {};
  }
}
