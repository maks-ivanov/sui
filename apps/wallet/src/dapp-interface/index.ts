// Copyright (c) 2022, Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { WalletsWindow } from '@wallet-standard/standard';

import { DAppInterface } from './DAppInterface';
import { SuiWallet } from './WalletStandardInterface';

declare const window: WalletsWindow;

window.navigator.wallets = window.navigator.wallets || [];
window.navigator.wallets.push(({ register }) => {
    register(new SuiWallet());
});

Object.defineProperty(window, 'suiWallet', {
    enumerable: false,
    configurable: false,
    value: new DAppInterface(),
});
