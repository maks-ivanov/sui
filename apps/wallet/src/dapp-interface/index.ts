// Copyright (c) 2022, Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { DAppInterface } from './DAppInterface';
import { SuiWallet } from './WalletStandardInterface';

import type { WalletsWindow } from '@mysten/wallet-standard';

declare const window: WalletsWindow;

setTimeout(() => {
    console.log('INJECTING WALLET');
    window.navigator.wallets = window.navigator.wallets || [];
    window.navigator.wallets.push(({ register }) => {
        register(new SuiWallet());
    });
}, 5000);

Object.defineProperty(window, 'suiWallet', {
    enumerable: false,
    configurable: false,
    value: new DAppInterface(),
});
