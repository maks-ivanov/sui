// Copyright (c) 2022, Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type {
  SignableTransaction,
  SuiTransactionResponse,
} from "@mysten/sui.js";
import type {
  SignAndSendTransactionInput,
} from "@wallet-standard/features";

/** TODO: docs */
export type SuiSignAndExecuteTransactionFeature = {
  /** Namespace for the feature. */
  "sui:signAndExecuteTransaction": {
    /** Version of the feature API. */
    version: SuiSignAndExecuteTransactionVersion;

    /**
     * Sign transactions using the account's secret key and send them to the chain.
     *
     * @param inputs Inputs for signing and sending transactions.
     *
     * @return Outputs of signing and sending transactions.
     */
    signAndExecuteTransaction: SuiSignAndExecuteTransactionMethod;
  };
};

/** TODO: docs */
export type SuiSignAndExecuteTransactionVersion = "1.0.0";

/** TODO: docs */
export type SuiSignAndExecuteTransactionMethod = (
  input: SuiSignAndExecuteTransactionInput
) => Promise<SuiSignAndExecuteTransactionOutput>;

/** Input for signing and sending transactions. */
export interface SuiSignAndExecuteTransactionInput
  extends Omit<SignAndSendTransactionInput, "transaction"> {
  /** TODO: docs */
  options?: SuiSignAndExecuteTransactionOptions;
  transaction: SignableTransaction;
}

/** Output of signing and sending transactions. */
export interface SuiSignAndExecuteTransactionOutput
  extends SuiTransactionResponse {}

// TODO: figure out what options are actually needed
/** Options for signing and sending transactions. */
export interface SuiSignAndExecuteTransactionOptions {}
