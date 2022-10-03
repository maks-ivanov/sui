// Copyright (c) 2022, Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type {
  SignTransactionInput,
  SignTransactionOutput,
} from "@wallet-standard/features";

/** TODO: docs */
export type SuiSignTransactionFeature = {
  /** Namespace for the feature. */
  "sui:signTransaction": {
    /** Version of the feature API. */
    version: SuiSignTransactionVersion;

    /**
     * Sign transactions using the account's secret key.
     *
     * @param inputs Inputs for signing transactions.
     *
     * @return Outputs of signing transactions.
     */
    signTransaction: SuiSignTransactionMethod;
  };
};

/** TODO: docs */
export type SuiSignTransactionVersion = "1.0.0";

/** TODO: docs */
export type SuiSignTransactionMethod = (
  ...inputs: SuiSignTransactionInput[]
) => Promise<SuiSignTransactionOutput[]>;

/** Input for signing and sending transactions. */
export interface SuiSignTransactionInput extends SignTransactionInput {
  /** TODO: docs */
  options?: SuiSignTransactionOptions;
}

/** Output of signing and sending transactions. */
export interface SuiSignTransactionOutput extends SignTransactionOutput {}

// TODO: figure out what options are actually needed
/** Options for signing transactions. */
export type SuiSignTransactionOptions = {};
