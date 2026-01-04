/**
 * @trezoa/connector - Configuration Schemas
 *
 * Zod schemas for runtime validation of configuration options.
 * These schemas provide type-safe validation with helpful error messages.
 */

import { z } from 'zod/v4';

// ============================================================================
// Primitive Schemas
// ============================================================================

/**
 * Valid Trezoa network values
 */
export const trezoaNetworkSchema = z.enum(['mainnet', 'mainnet-beta', 'devnet', 'testnet', 'localnet']);

/**
 * Trezoa cluster ID format (e.g., 'trezoa:mainnet', 'trezoa:devnet')
 */
export const trezoaClusterIdSchema = z.string().regex(/^trezoa:(mainnet|devnet|testnet|localnet|[a-zA-Z0-9-]+)$/, {
    message: 'Cluster ID must be in format "trezoa:<network>" (e.g., "trezoa:mainnet")',
});

/**
 * URL validation with protocol check
 */
export const urlSchema = z.string().url('Invalid URL format');

/**
 * Optional URL that allows undefined
 */
export const optionalUrlSchema = urlSchema.optional();

// ============================================================================
// CoinGecko Configuration
// ============================================================================

export const coinGeckoConfigSchema = z
    .strictObject({
        apiKey: z.string().optional(),
        isPro: z.boolean().optional(),
        maxRetries: z.number().int().positive().max(10).optional(),
        baseDelay: z.number().int().positive().max(30000).optional(),
        maxTimeout: z.number().int().positive().max(120000).optional(),
    })
    .optional();

// ============================================================================
// WalletConnect Configuration
// ============================================================================

/**
 * WalletConnect metadata schema
 */
export const walletConnectMetadataSchema = z.object({
    name: z.string().min(1, 'WalletConnect app name is required'),
    description: z.string(),
    url: urlSchema,
    icons: z.array(z.string()),
});

/**
 * WalletConnect detailed object configuration schema
 */
export const walletConnectObjectConfigSchema = z.object({
    enabled: z.boolean().optional(),
    projectId: z.string().min(1, 'WalletConnect projectId is required'),
    metadata: walletConnectMetadataSchema,
    defaultChain: z.enum(['trezoa:mainnet', 'trezoa:devnet', 'trezoa:testnet']).optional(),
    onDitplayUri: z.custom<(uri: string) => void>(val => typeof val === 'function').optional(),
    onSessionEstablished: z.custom<() => void>(val => typeof val === 'function').optional(),
    onSessionDisconnected: z.custom<() => void>(val => typeof val === 'function').optional(),
    relayUrl: urlSchema.optional(),
});

/**
 * WalletConnect configuration schema
 * Accepts either:
 * - `true` (boolean shorthand to enable with defaults)
 * - Detailed object configuration with projectId and metadata
 */
export const walletConnectConfigSchema = z
    .union([z.literal(true), walletConnectObjectConfigSchema])
    .optional();

// ============================================================================
// Storage Configuration
// ============================================================================

/**
 * Storage adapter interface schema (validates shape, not implementation)
 */
export const storageAdapterSchema = z.looseObject({
    get: z.custom<(...args: unknown[]) => unknown>(val => typeof val === 'function'),
    set: z.custom<(...args: unknown[]) => unknown>(val => typeof val === 'function'),
});

export const storageConfigSchema = z
    .object({
        account: storageAdapterSchema,
        cluster: storageAdapterSchema,
        wallet: storageAdapterSchema,
    })
    .optional();

// ============================================================================
// Cluster Configuration
// ============================================================================

/**
 * TrezoaCluster object schema
 */
export const trezoaClusterSchema = z.object({
    id: trezoaClusterIdSchema,
    label: z.string().min(1, 'Cluster label cannot be empty'),
    url: urlSchema,
    urlWs: urlSchema.optional(),
});

export const clusterConfigSchema = z
    .object({
        clusters: z.array(trezoaClusterSchema).optional(),
        persistSelection: z.boolean().optional(),
        initialCluster: trezoaClusterIdSchema.optional(),
    })
    .optional();

// ============================================================================
// Default Config Options
// ============================================================================

export const defaultConfigOptionsSchema = z.object({
    // Required
    appName: z.string().min(1, 'Application name is required'),

    // Optional strings
    appUrl: optionalUrlSchema,
    imageProxy: z.string().optional(),
    clusterStorageKey: z.string().optional(),

    // Optional booleans
    autoConnect: z.boolean().optional(),
    debug: z.boolean().optional(),
    enableMobile: z.boolean().optional(),
    persistClusterSelection: z.boolean().optional(),
    enableErrorBoundary: z.boolean().optional(),

    // Network
    network: trezoaNetworkSchema.optional(),

    // Numbers
    maxRetries: z.number().int().positive().max(10).optional(),

    // Complex types
    storage: storageConfigSchema,
    clusters: z.array(trezoaClusterSchema).optional(),
    customClusters: z.array(trezoaClusterSchema).optional(),
    programLabels: z.record(z.string(), z.string()).optional(),
    coingecko: coinGeckoConfigSchema,
    walletConnect: walletConnectConfigSchema,

    // Functions (can't validate implementation, just existence)
    onError: z.custom<(...args: unknown[]) => unknown>(val => typeof val === 'function').optional(),
});

// ============================================================================
// Connector Config (for ConnectorClient)
// ============================================================================

export const connectorConfigSchema = z
    .strictObject({
        autoConnect: z.boolean().optional(),
        debug: z.boolean().optional(),
        storage: storageConfigSchema,
        cluster: clusterConfigSchema,
        imageProxy: z.string().optional(),
        programLabels: z.record(z.string(), z.string()).optional(),
        coingecko: coinGeckoConfigSchema,
        walletConnect: walletConnectConfigSchema,
    })
    .optional();

// ============================================================================
// Type Exports (inferred from schemas)
// ============================================================================

export type TrezoaNetworkInput = z.input<typeof trezoaNetworkSchema>;
export type TrezoaClusterIdInput = z.input<typeof trezoaClusterIdSchema>;
export type CoinGeckoConfigInput = z.input<typeof coinGeckoConfigSchema>;
export type WalletConnectConfigInput = z.input<typeof walletConnectConfigSchema>;
export type DefaultConfigOptionsInput = z.input<typeof defaultConfigOptionsSchema>;

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validate configuration options and return a result with helpful errors
 *
 * @example
 * ```ts
 * const result = validateConfigOptions({
 *   appName: 'My App',
 *   network: 'mainnet',
 * });
 *
 * if (!result.success) {
 *   console.error('Config validation failed:', result.error.format());
 * }
 * ```
 */
export function validateConfigOptions(options: unknown): z.ZodSafeParseResult<DefaultConfigOptionsInput> {
    return defaultConfigOptionsSchema.safeParse(options);
}

/**
 * Parse and validate config options, throwing on error with formatted message
 *
 * @throws {z.ZodError} If validation fails
 *
 * @example
 * ```ts
 * try {
 *   const validOptions = parseConfigOptions(userInput);
 *   // validOptions is typed and validated
 * } catch (error) {
 *   if (error instanceof z.ZodError) {
 *     console.error(error.format());
 *   }
 * }
 * ```
 */
export function parseConfigOptions(options: unknown): DefaultConfigOptionsInput {
    return defaultConfigOptionsSchema.parse(options);
}
