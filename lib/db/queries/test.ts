import { sql } from '../db';

export async function putComment(comment: string)
{
    const result = await sql`
    INSERT INTO comments (comment) 
    VALUES (${comment})
    RETURNING *
  `;
    return result[0];
}

export async function getComments()
{
    return await sql`
    SELECT *
    FROM comments`;
}