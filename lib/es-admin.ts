'use server'

import { auth } from '@clerk/nextjs/server';

export async function EsAdmin() {
    const { sessionClaims } = await auth();

    return sessionClaims?.metadata?.role === "admin";

}