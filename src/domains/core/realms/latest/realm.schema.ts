import { z } from 'zod';

export const realmCreateSchema = z.object({
  name: z.string({ message: 'Name is required' }),
  dbName: z.string({ message: 'Database name is required' }),
  jwtConfig: z
    .object({
      secret: z.string().optional(),
      expiresIn: z.string().optional(),
    })
    .optional(),
});

export const realmUpdateSchema = z.object({
  name: z.string().optional(),
  dbName: z.string().optional(),
  jwtConfig: z
    .object({
      secret: z.string().optional(),
      expiresIn: z.string().optional(),
    })
    .optional(),
});

export type RealmCreate = z.infer<typeof realmCreateSchema>;
export type RealmUpdate = z.infer<typeof realmUpdateSchema>;
