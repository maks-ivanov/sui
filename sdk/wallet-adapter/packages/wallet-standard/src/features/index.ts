import type { WalletWithFeatures } from '@wallet-standard/standard';
import type { SuiSignAndExecuteTransactionFeature } from './suiSignAndExecuteTransaction';
import type { SuiSignTransactionFeature } from './suiSignTransaction';

/** TODO: docs */
export type SuiFeatures = SuiSignTransactionFeature | SuiSignAndExecuteTransactionFeature;

/** TODO: docs */
export type WalletWithSuiFeatures = WalletWithFeatures<SuiFeatures>;

export * from './suiSignTransaction';
export * from './suiSignAndExecuteTransaction';
