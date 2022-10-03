// Copyright (c) 2022, Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type {
  SignAndSendTransactionInput,
  SignAndSendTransactionOutput,
} from "@wallet-standard/features";

import type { SuiSignTransactionOptions } from "./suiSignTransaction";

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
  ...inputs: SuiSignAndExecuteTransactionInput[]
) => Promise<SuiSignAndExecuteTransactionOutput[]>;

/** Input for signing and sending transactions. */
export interface SuiSignAndExecuteTransactionInput
  extends SignAndSendTransactionInput {
  /** TODO: docs */
  options?: SuiSignAndExecuteTransactionOptions;
}

/** Output of signing and sending transactions. */
export interface SuiSignAndExecuteTransactionOutput
  extends SignAndSendTransactionOutput {}

// TODO: figure out what options are actually needed
/** Options for signing and sending transactions. */
export type SuiSignAndExecuteTransactionOptions =
  SuiSignTransactionOptions & {};
