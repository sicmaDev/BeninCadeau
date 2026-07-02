import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-12345';
const COOKIE_NAME = 'bc_session';

// Decode helper to handle base64url padding
function base64urlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
}

// Verify JWT signature using Web Crypto API (Edge compatible)
async function verifyJWT(token: string, secret: string): Promise<any | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;

    const encoder = new TextEncoder();
    const data = encoder.encode(`${headerB64}.${payloadB64}`);
    
    // Import secret as CryptoKey
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // Decode signature string to Uint8Array bytes
    const signatureString = base64urlDecode(signatureB64);
    const signatureBytes = new Uint8Array(signatureString.length);
    for (let i = 0; i < signatureString.length; i++) {
      signatureBytes[i] = signatureString.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes,
      data
    );

    if (!isValid) return null;

    const payload = JSON.parse(base64urlDecode(payloadB64));
    return payload;
  } catch (err) {
    console.error('JWT Edge verification failed:', err);
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPath = pathname.startsWith('/admin');
  const isAdminApiPath = pathname.startsWith('/api/admin');

  if (isAdminPath || isAdminApiPath) {
    // Ignorer la page de connexion admin
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    const token = req.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      if (isAdminApiPath) {
        return NextResponse.json({ error: 'Accès interdit.' }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    const payload = await verifyJWT(token, JWT_SECRET);

    if (!payload || payload.role !== 'ADMIN') {
      if (isAdminApiPath) {
        return NextResponse.json({ error: 'Accès interdit.' }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
