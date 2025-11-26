import { EventFailedToRegisterDomainEventsException } from '@/event-store-context/event/domain/exceptions/event-failed-to-register-domain-events/event-failed-to-register-domain-events.exception';
import { EventUnsupportedEventTypeException } from '@/event-store-context/event/domain/exceptions/event-unsupported-event-type/event-unsupported-event-type.exception';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';
import { Injectable, Logger } from '@nestjs/common';
import { existsSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';

type Constructor<T> = new (metadata: IEventMetadata, data: any) => T;

@Injectable()
export class DomainEventFactory {
  private static readonly EVENT_FILE_REGEX = /\.event\.(t|j)s$/;
  private readonly logger = new Logger(DomainEventFactory.name);
  private readonly registry = new Map<
    string,
    Constructor<BaseEvent<unknown>>
  >();

  constructor() {
    this.registerDomainEvents();
  }

  /**
   * Creates a new domain event.
   *
   * @param eventType - The type of the event.
   * @param metadata - The metadata of the event.
   * @param data - The data of the event.
   * @returns The domain event.
   */
  public create(
    eventType: string,
    metadata: IEventMetadata,
    data: unknown,
  ): BaseEvent<unknown> {
    const EventCtor = this.registry.get(eventType);
    if (!EventCtor) {
      this.logger.error(`Unsupported eventType for replay: ${eventType}`);
      throw new EventUnsupportedEventTypeException(eventType);
    }
    return new EventCtor(metadata, data);
  }

  /**
   * Registers all domain events in the events directory.
   *
   * The flow of this method is:
   * 1. Resolve the events directory.
   * 2. Collect all event files in the events directory.
   * 3. Register all domain events in the events directory.
   *
   * @returns {void}
   */
  private registerDomainEvents(): void {
    this.logger.log('Registering domain events');

    const eventsDirectory = this.resolveEventsDirectory();

    if (!existsSync(eventsDirectory)) {
      this.logger.warn(
        `Events directory not found, skipping domain events auto-registration: ${eventsDirectory}`,
      );
      return;
    }

    const eventFiles = this.collectEventFiles(eventsDirectory);
    eventFiles.forEach((file) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const exportsFromModule = require(file);
        Object.values(exportsFromModule).forEach((exported) => {
          if (this.isDomainEventConstructor(exported)) {
            this.registry.set(exported.name, exported);
          }
        });
      } catch (error) {
        const stack = (error as Error)?.stack;
        this.logger.error(
          `Failed to register domain events from file: ${file}`,
          stack,
        );
        throw new EventFailedToRegisterDomainEventsException(
          file,
          error as Error,
        );
      }
    });
  }

  /**
   * Resolves the events directory.
   *
   * The flow of this method is:
   * 1. Resolve the events directory.
   * 2. Return the events directory.
   *
   * @returns {string} The events directory.
   */
  private resolveEventsDirectory(): string {
    const compiledPath = resolve(__dirname, '../../../../shared/domain/events');

    if (existsSync(compiledPath)) {
      return compiledPath;
    }

    return resolve(__dirname, '../../../../../shared/domain/events');
  }

  /**
   * Collects all event files in the events directory.
   *
   * The flow of this method is:
   * 1. Collect all event files in the events directory.
   * 2. Return the event files.
   *
   * @returns {string[]} The event files.
   */
  private collectEventFiles(directory: string): string[] {
    const dirents = readdirSync(directory, { withFileTypes: true });

    return dirents.flatMap((dirent) => {
      const fullPath = join(directory, dirent.name);

      if (dirent.isDirectory()) {
        return this.collectEventFiles(fullPath);
      }

      if (!DomainEventFactory.EVENT_FILE_REGEX.test(dirent.name)) {
        return [];
      }

      if (dirent.name.endsWith('.d.ts')) {
        return [];
      }

      const stats = statSync(fullPath);
      if (!stats.isFile()) {
        return [];
      }

      return [fullPath];
    });
  }

  /**
   * Checks if the exported object is a domain event constructor.
   *
   * The flow of this method is:
   * 1. Check if the exported object is a function.
   * 2. Check if the exported object is a subclass of BaseEvent.
   * 3. Return the result.
   *
   * @param exported - The exported object to check.
   * @returns True if the exported object is a domain event constructor, false otherwise.
   */
  private isDomainEventConstructor(
    exported: unknown,
  ): exported is Constructor<BaseEvent<unknown>> {
    if (typeof exported !== 'function') {
      return false;
    }

    return exported.prototype instanceof BaseEvent;
  }
}
