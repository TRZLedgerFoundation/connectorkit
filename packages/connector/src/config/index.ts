export { getDefaultConfig, getDefaultMobileConfig } from './default-config';
export type { DefaultConfigOptions, ExtendedConnectorConfig, SimplifiedWalletConnectConfig } from './default-config';

// Configuration validation schemas
export {
    validateConfigOptions,
    parseConfigOptions,
    // Individual schemas for advanced use
    trezoaNetworkSchema,
    trezoaClusterIdSchema,
    trezoaClusterSchema,
    coinGeckoConfigSchema,
    defaultConfigOptionsSchema,
} from './schemas';
export type {
    TrezoaNetworkInput,
    TrezoaClusterIdInput,
    CoinGeckoConfigInput,
    DefaultConfigOptionsInput,
} from './schemas';
