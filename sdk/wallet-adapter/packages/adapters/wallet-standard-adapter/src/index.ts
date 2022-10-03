import { initialize } from "@wallet-standard/app";
import { Wallets } from "@wallet-standard/standard";

export class WalletStandardAdapter {
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
}
