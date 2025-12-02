import {
  DocIdSchema,
  publicUUIDSchema,
} from '@/domains/commons/base/base.schema';
import {
  PaginatedResponse,
  PaginationQuery,
} from '@/domains/commons/base/pagination.schema';
import { PublicUUID } from '@/domains/commons/base/base.schema';
import { validateZod } from '@/domains/commons/validations/validation.service';
import { getModel, Realm, RealmCreate } from './realm.model';
import { ConflictError } from '@/errors/conflict';
import { NotFoundError } from '@/errors/not-found';
import { getLogger } from '@/utils/localStorage.util';
import { withSpanAsync } from '@/utils/tracing.util';
import { executePagination } from '@/utils/pagination.util';
import { getMainConnection } from '@/plugins/mongo.plugin';

export type GetDBNameParams = {
  publicUUID: PublicUUID;
};

const SERVICE_NAME = 'realm.service';

const validateDBName = async (dbName: string): Promise<void> => {
  const maliciousPatterns = [
    /^https?:\/\//i,
    /^ftp:\/\//i,
    /^file:\/\//i,
    /^ldap:\/\//i,
    /^mongodb:\/\//i,
    /\.\./,
    /\/\/+/,
    /@/,
    /:/,
  ];

  for (const pattern of maliciousPatterns) {
    if (pattern.test(dbName)) {
      throw new Error('Invalid database name format');
    }
  }
};

export const create = async (data: RealmCreate) => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.create`,
      attributes: {
        operation: 'create',
        'realm.name': data.name,
        'realm.dbName': data.dbName,
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.debug({ data: JSON.stringify(data) }, 'create data:');

      await validateDBName(data.dbName);

      try {
        const realm = await getModel().create(data);
        span.setAttributes({ 'realm.id': realm._id });
        return realm;
      } catch (error: unknown) {
        if (
          error &&
          typeof error === 'object' &&
          'code' in error &&
          error.code === 11000
        ) {
          // MongoDB duplicate key error
          const mongoError = error as { keyPattern?: { name?: unknown } };
          if (mongoError.keyPattern?.name) {
            throw new ConflictError('Resource already exists', {
              field: 'name',
              details: 'A resource with this name already exists',
            });
          }
        }
        throw error;
      }
    }
  );
};

export const findById = async (id: string) => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.findById`,
      attributes: {
        'realm.id': id,
        operation: 'findById',
      },
    },
    async () => {
      const logger = await getLogger();
      logger.debug({ id });

      const realm = await getModel().findById(id);
      if (!realm) {
        throw new NotFoundError('Realm not found');
      }
      return realm;
    }
  );
};

export const findByPublicUUID = async (publicUUID: PublicUUID) => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.findByPublicUUID`,
      attributes: {
        'realm.publicUUID': publicUUID,
        operation: 'findByPublicUUID',
      },
    },
    async () => {
      const logger = await getLogger();
      logger.debug({ publicUUID });

      const realm = await getModel().findOne({ publicUUID });
      if (!realm) {
        throw new NotFoundError('Realm not found');
      }
      return realm;
    }
  );
};

export const findByName = async (name: string) => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.findByName`,
      attributes: {
        'realm.name': name,
        operation: 'findByName',
      },
    },
    async () => {
      const logger = await getLogger();
      logger.debug({ name });

      const realm = await getModel().findOne({ name });
      if (!realm) {
        throw new NotFoundError('Realm not found');
      }
      return realm;
    }
  );
};

export const update = async (id: string, data: Partial<Realm>) => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.update`,
      attributes: {
        'realm.id': id,
        operation: 'update',
      },
    },
    async () => {
      const logger = await getLogger();
      logger.debug({ id });

      if (data.dbName) {
        await validateDBName(data.dbName);
      }

      const realm = await getModel().findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });
      if (!realm) {
        throw new NotFoundError('Realm not found');
      }
      return realm;
    }
  );
};

export const findAllPaginated = async (
  query: PaginationQuery
): Promise<PaginatedResponse<Realm>> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.findAllPaginated`,
      attributes: {
        operation: 'findAllPaginated',
        'pagination.page': query.page,
        'pagination.limit': query.limit,
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.debug(
        { query: JSON.stringify(query) },
        'Finding realms with pagination'
      );

      return await executePagination(
        {
          model: getModel(),
          query,
          defaultSortField: 'name',
          span,
        },
        (sanitizedFilter: string) => ({
          $or: [
            { name: { $regex: sanitizedFilter, $options: 'i' } },
            { description: { $regex: sanitizedFilter, $options: 'i' } },
            { dbName: { $regex: sanitizedFilter, $options: 'i' } },
            { _id: { $regex: sanitizedFilter, $options: 'i' } },
            { publicUUID: { $regex: sanitizedFilter, $options: 'i' } },
          ],
        })
      );
    }
  );
};

export const remove = async (id: string): Promise<void> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.remove`,
      attributes: {
        'realm.id': id,
        operation: 'remove',
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.debug({ id });

      await validateZod(id, DocIdSchema);

      const realm = await getModel().findByIdAndDelete(id);
      if (!realm) {
        throw new NotFoundError('Realm not found');
      }

      const mainConnection = getMainConnection();

      span.setAttributes({ 'realm.dbName': realm.dbName });
      logger.info({ dbName: realm.dbName }, 'Dropping realm database');

      await mainConnection.useDb(realm.dbName).dropDatabase();

      logger.info(
        { dbName: realm.dbName },
        'Realm database dropped successfully'
      );
    }
  );
};

export const getDBName = async ({ publicUUID }: GetDBNameParams) => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.getDBName`,
      attributes: {
        'realm.publicUUID': publicUUID,
        operation: 'getDBName',
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.debug({ publicUUID });

      // Validar formato do publicUUID antes de buscar
      await validateZod(publicUUID, publicUUIDSchema);

      const realm = await getModel().findOne({ publicUUID });

      if (!realm || !realm.dbName) {
        throw new NotFoundError(
          `DBName not found for publicUUID: ${publicUUID}`
        );
      }

      span.setAttributes({ 'realm.dbName': realm.dbName });
      return realm.dbName;
    }
  );
};

export const initSetup = async () => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.initSetup`,
      attributes: {
        operation: 'initSetup',
      },
    },
    async (span) => {
      const coreDBName = 'idm-core-db';

      span.setAttributes({ 'realm.coreDBName': coreDBName });

      let coreRealm = await getModel().findOne({
        dbName: coreDBName,
      });

      if (!coreRealm) {
        coreRealm = await getModel().create({
          dbName: coreDBName,
          name: 'idm-core-realm',
          description: 'Realm Core',
        });
        span.setAttributes({ 'realm.created': true });
      } else {
        span.setAttributes({ 'realm.created': false });
      }

      span.setAttributes({ 'realm.id': coreRealm._id });
      return coreRealm;
    }
  );
};
