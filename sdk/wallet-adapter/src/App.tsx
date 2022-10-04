// Copyright (c) 2022, Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import "./App.css";
import { Wallet, WalletProvider } from "@mysten/wallet-adapter-react";
import { SuiWalletAdapter } from "@mysten/wallet-adapter-all-wallets";
import { WalletStandardAdapterProvider } from "@mysten/wallet-adapter-wallet-standard";
import { WalletWrapper } from "@mysten/wallet-adapter-react-ui";
import { TestButton } from "./TestButton";

const provider = new WalletStandardAdapterProvider();
console.log(provider.get());

function App() {
  const supportedWallets: Wallet[] = [
    {
      adapter: new SuiWalletAdapter(),
    },
  ];

  return (
    <div className="App">
      <header className="App-header">
        <WalletProvider supportedWallets={supportedWallets}>
          <TestButton />
          <WalletWrapper />
        </WalletProvider>
      </header>
    </div>
  );
}

export default App;
