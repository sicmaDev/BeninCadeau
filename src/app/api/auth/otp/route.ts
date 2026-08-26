import { NextResponse } from 'next/server';
import { prisma } from '../../../../utils/db';
import { sendOtpEmail } from '../../../../utils/emails';

// Memory cache for OTPs
const otpStore = new Map<string, { otp: string; expires: number }>();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, email, code } = body;

    if (!email) {
      return NextResponse.json({ error: 'Adresse e-mail requise.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (action === 'send') {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      otpStore.set(normalizedEmail, { otp, expires: Date.now() + 5 * 60 * 1000 });

      await sendOtpEmail(normalizedEmail, otp);

      return NextResponse.json({ success: true, message: 'Code envoyé avec succès.' });
    }

    if (action === 'verify') {
      if (!code) {
        return NextResponse.json({ error: 'Code de vérification requis.' }, { status: 400 });
      }

      const stored = otpStore.get(normalizedEmail);
      if (!stored) {
        return NextResponse.json({ error: 'Aucun code généré pour cet e-mail.' }, { status: 400 });
      }

      if (Date.now() > stored.expires) {
        otpStore.delete(normalizedEmail);
        return NextResponse.json({ error: 'Le code a expiré.' }, { status: 400 });
      }

      if (stored.otp !== code.trim()) {
        return NextResponse.json({ error: 'Code de vérification incorrect.' }, { status: 400 });
      }

      // Successful verification
      otpStore.delete(normalizedEmail);

      // Fetch all orders associated with this email
      const orders = await prisma.order.findMany({
        where: { clientEmail: normalizedEmail },
        orderBy: { createdAt: 'desc' },
        include: {
          orderItems: {
            include: {
              product: {
                select: {
                  name: true,
                  slug: true,
                  images: true,
                },
              },
            },
          },
          shippingZone: {
            select: {
              name: true,
            },
          },
        },
      });

      return NextResponse.json({ success: true, orders });
    }

    return NextResponse.json({ error: 'Action invalide.' }, { status: 400 });
  } catch (error) {
    console.error('OTP Route Error:', error);
    return NextResponse.json({ error: 'Une erreur interne est survenue.' }, { status: 500 });
  }
}
