'use server'

import { auth } from '@clerk/nextjs/server';

interface SessionClaims {
    metadata?: { role?: string };
}

export async function EsAdmin() {
    const { sessionClaims } = await auth();
    const claims = sessionClaims as SessionClaims;

    return claims?.metadata?.role === "admin";
}