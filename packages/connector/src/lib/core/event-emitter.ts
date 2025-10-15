import type { ConnectorEvent, ConnectorEventListener } from '../../types/events';
import { createLogger } from '../utils/secure-logger';

const logger = createLogger('EventEmitter');

/**
 * EventEmitter - Handles event system for connector
 *
 * Provides event listener management and emission with error handling.
 * Automatically adds timestamps to events if not provided.
 * Used for analytics, logging, monitoring, and custom behavior.
 */
export class EventEmitter {
    private listeners = new Set<ConnectorEventListener>();
    private debug: boolean;

    constructor(debug = false) {
        this.debug = debug;
    }

    /**
     * Subscribe to connector events
     */
    on(listener: ConnectorEventListener): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    /**
     * Remove a specific event listener
     */
    off(listener: ConnectorEventListener): void {
        this.listeners.delete(listener);
    }

    /**
     * Remove all event listeners
     */
    offAll(): void {
        this.listeners.clear();
    }

    /**
     * Emit an event to all listeners
     * Automatically adds timestamp if not already present
     */
    emit(event: ConnectorEvent): void {
        // Ensure timestamp is present
        const eventWithTimestamp: ConnectorEvent = {
            ...event,
            timestamp: event.timestamp ?? new Date().toISOString(),
        } as ConnectorEvent;

        // Log events in debug mode
        if (this.debug) {
            logger.debug('Event emitted', { type: eventWithTimestamp.type, event: eventWithTimestamp });
        }

        // Call all event listeners
        this.listeners.forEach(listener => {
            try {
                listener(eventWithTimestamp);
            } catch (error) {
                // Don't let listener errors crash the connector
                logger.error('Event listener error', { error });
            }
        });
    }

    /**
     * Get the number of active listeners
     */
    getListenerCount(): number {
        return this.listeners.size;
    }

    /**
     * Generate ISO timestamp for events
     * Utility method for creating timestamps consistently
     */
    static timestamp(): string {
        return new Date().toISOString();
    }
}
