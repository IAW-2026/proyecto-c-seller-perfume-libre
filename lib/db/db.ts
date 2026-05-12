/*
    Dedicado al export general para usar operaciones de bases de datos
*/

import { neon } from '@neondatabase/serverless';
export { putComment, getComments } from './queries/test';

export const sql = neon(process.env.DATABASE_URL);