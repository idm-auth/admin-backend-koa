import { injectable, inject } from 'inversify';
import mongoose, { Connection } from 'mongoose';
import { Logger } from 'pino';
import { ILifecycle } from '@/infrastructure/core/app';
import { LoggerSymbol } from '@/infrastructure/logger/logger.provider';
import { Env, EnvSymbol, EnvKey } from '@/infrastructure/env/env.provider';

export const MongoDBSymbol = Symbol.for('MongoDB');

@injectable()
export class MongoDB implements ILifecycle {
  private connection: Connection | null = null;

  constructor(
    @inject(LoggerSymbol) private logger: Logger,
    @inject(EnvSymbol) private env: Env
  ) {}

  async init(): Promise<void> {
    const uri = this.env.get(EnvKey.MONGODB_URI);
    this.connection = await mongoose.createConnection(uri).asPromise();

    if (this.env.get(EnvKey.NODE_ENV) === 'development') {
      this.connection.on('open', () => {
        this.logger.debug(
          { connectionId: this.connection?.id },
          'MongoDB connection opened'
        );
      });

      mongoose.connection.on('createConnection', (conn: Connection) => {
        this.logger.debug(
          { connectionId: conn.id, db: conn.name },
          'MongoDB connection created'
        );
      });
    }
  }

  async shutdown(): Promise<void> {
    if (!this.connection) return;

    if (this.env.get(EnvKey.NODE_ENV) === 'development') {
      const openConnections = mongoose.connections.filter(
        (c) => c.readyState === 1
      );
      this.logger.debug(
        { count: openConnections.length },
        'Closing MongoDB connections'
      );
      openConnections.forEach((c) =>
        this.logger.debug({ connectionId: c.id, db: c.name }, 'Open connection')
      );
    }

    await this.connection.close();
    this.connection = null;
  }

  getConn(): Connection {
    if (!this.connection) throw new Error('Connection not initialized');
    return this.connection;
  }

  getCoreDb(): Connection {
    const dbName = this.env.get(EnvKey.MONGODB_CORE_DBNAME);
    const db = this.getConn().useDb(dbName, { useCache: true });
    if (this.env.get(EnvKey.NODE_ENV) === 'development') {
      this.logger.debug({ db: dbName }, 'useDb called (cached)');
    }
    return db;
  }

  getRealmDb(dbName: string): Connection {
    const db = this.getConn().useDb(dbName, { useCache: true });
    if (this.env.get(EnvKey.NODE_ENV) === 'development') {
      this.logger.debug({ db: dbName }, 'useDb called (cached)');
    }
    return db;
  }
}
