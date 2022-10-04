import { WalletAdapter } from "@mysten/wallet-adapter-base";
import { StandardWalletAdapterWallet } from "@mysten/wallet-standard";

export interface StandardWalletAdapterConfig {
  wallet: StandardWalletAdapterWallet;
}

export class StandardWalletAdapter implements WalletAdapter {
  name = "";
  connected = false;
  connecting = false;
  constructor({ wallet }: StandardWalletAdapterConfig) {
    console.log(wallet);
  }
  async getAccounts() {
    return [];
  }
  async connect() {}
  async disconnect() {}
}
