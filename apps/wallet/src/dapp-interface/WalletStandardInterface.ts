// Copyright (c) 2022, Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { ConnectFeature, ConnectMethod } from '@wallet-standard/features';
import {
    SuiSignAndExecuteTransactionFeature,
    SuiSignAndExecuteTransactionMethod,
    SUI_CHAINS,
} from '@mysten/wallet-standard';
import type {
    Wallet,
    WalletEventNames,
    WalletEvents,
} from '@wallet-standard/standard';
import { ReadonlyWalletAccount } from '@wallet-standard/util';
import { filter, map, type Observable } from 'rxjs';

import { type Payload } from '_payloads';
import type {
    ExecuteTransactionRequest,
    ExecuteTransactionResponse,
} from '_payloads/transactions';
import {
    PermissionType,
    HasPermissionsRequest,
    HasPermissionsResponse,
    AcquirePermissionsRequest,
    AcquirePermissionsResponse,
    ALL_PERMISSION_TYPES,
} from '_payloads/permissions';
import { createMessage } from '_messages';
import { WindowMessageStream } from '_messaging/WindowMessageStream';
import type { GetAccount } from '_payloads/account/GetAccount';
import type { GetAccountResponse } from '_payloads/account/GetAccountResponse';

import icon from '../manifest/icons/sui-icon-128.png';

console.log(icon);

import { mapToPromise } from './utils';

export class SuiWallet implements Wallet {
    readonly #listeners: { [E in WalletEventNames]?: WalletEvents[E][] } = {};
    readonly #version = '1.0.0' as const;
    readonly #name = 'Sui Wallet' as const;
    readonly #icon = 'icon';
    #account: ReadonlyWalletAccount | null;
    #messagesStream: WindowMessageStream;

    get version() {
        return this.#version;
    }

    get name() {
        return this.#name;
    }

    get icon() {
        // TODO: Improve this with ideally a vector logo.
        return icon as any;
    }

    get chains() {
        // TODO: Extract chain from wallet:
        return SUI_CHAINS;
    }

    get features(): ConnectFeature & SuiSignAndExecuteTransactionFeature {
        return {
            'standard:connect': {
                version: '1.0.0',
                connect: this.#connect,
            },
            'sui:signAndExecuteTransaction': {
                version: '1.0.0',
                signAndExecuteTransaction: this.#signAndExecuteTransaction,
            },
        };
    }

    get accounts() {
        return this.#account ? [this.#account] : [];
    }

    constructor() {
        this.#account = null;
        this.#messagesStream = new WindowMessageStream(
            'sui_in-page',
            'sui_content-script'
        );

        this.#connected();
    }

    on<E extends WalletEventNames>(
        event: E,
        listener: WalletEvents[E]
    ): () => void {
        this.#listeners[event]?.push(listener) ||
            (this.#listeners[event] = [listener]);
        return (): void => this.#off(event, listener);
    }

    #emit<E extends WalletEventNames>(
        event: E,
        ...args: Parameters<WalletEvents[E]>
    ): void {
        // @ts-expect-error: Incorrectly thinking the spread is bad.
        this.#listeners[event]?.forEach((listener) => listener(...args));
    }

    #off<E extends WalletEventNames>(
        event: E,
        listener: WalletEvents[E]
    ): void {
        this.#listeners[event] = this.#listeners[event]?.filter(
            (existingListener) => listener !== existingListener
        );
    }

    #connected = async () => {
        const accounts = await mapToPromise(
            this.#send<GetAccount, GetAccountResponse>({
                type: 'get-account',
            }),
            (response) => response.accounts
        );

        const properties: ('accounts' | 'chains')[] = [];

        const [address] = accounts;

        if (address) {
            const account = this.#account;
            if (!account || account.address !== address) {
                this.#account = new ReadonlyWalletAccount({
                    address,
                    // TODO: Expose public key instead of address:
                    publicKey: new Uint8Array(),
                    chains: SUI_CHAINS,
                    features: [
                        'sui:signAndExecuteTransaction',
                        'standard:signMessage',
                    ],
                });
                properties.push('accounts');
            }
        }

        if (properties.length) {
            this.#emit('standard:change', properties);
        }
    };

    #connect: ConnectMethod = async (input) => {
        if (!input?.silent) {
            await mapToPromise(
                this.#send<
                    AcquirePermissionsRequest,
                    AcquirePermissionsResponse
                >({
                    type: 'acquire-permissions-request',
                    permissions: ALL_PERMISSION_TYPES,
                }),
                (response) => response.result
            );
        }

        this.#connected();

        return { accounts: this.accounts };
    };

    #signAndExecuteTransaction: SuiSignAndExecuteTransactionMethod = async (
        input
    ) => {
        return mapToPromise(
            this.#send<ExecuteTransactionRequest, ExecuteTransactionResponse>({
                type: 'execute-transaction-request',
                transaction: {
                    type: 'v2',
                    data: input.transaction,
                },
            }),
            (response) => response.result
        );
    };

    #send<
        RequestPayload extends Payload,
        ResponsePayload extends Payload | void = void
    >(
        payload: RequestPayload,
        responseForID?: string
    ): Observable<ResponsePayload> {
        const msg = createMessage(payload, responseForID);
        this.#messagesStream.send(msg);
        return this.#messagesStream.messages.pipe(
            filter(({ id }) => id === msg.id),
            map((msg) => msg.payload as ResponsePayload)
        );
    }
}
