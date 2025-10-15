/**
 * Base class for connector collaborators
 * Provides shared dependencies and utilities for all manager classes
 */

import type { StateManager } from './state-manager';
import type { EventEmitter } from './event-emitter';
import { createLogger } from '../utils/secure-logger';

/**
 * Configuration for base collaborator
 */
export interface BaseCollaboratorConfig {
    stateManager: StateManager;
    eventEmitter: EventEmitter;
    debug?: boolean;
}

/**
 * Base collaborator class that all managers extend
 * Provides common functionality and reduces boilerplate
 */
export abstract class BaseCollaborator {
    protected readonly stateManager: StateManager;
    protected readonly eventEmitter: EventEmitter;
    protected readonly debug: boolean;
    protected readonly logger: ReturnType<typeof createLogger>;

    constructor(config: BaseCollaboratorConfig, loggerPrefix: string) {
        this.stateManager = config.stateManager;
        this.eventEmitter = config.eventEmitter;
        this.debug = config.debug ?? false;
        this.logger = createLogger(loggerPrefix);
    }

    /**
     * Log debug message if debug mode is enabled
     */
    protected log(message: string, data?: unknown): void {
        if (this.debug) {
            this.logger.debug(message, data);
        }
    }

    /**
     * Log error message if debug mode is enabled
     */
    protected error(message: string, data?: unknown): void {
        if (this.debug) {
            this.logger.error(message, data);
        }
    }

    /**
     * Get current state snapshot
     */
    protected getState() {
        return this.stateManager.getSnapshot();
    }
}
