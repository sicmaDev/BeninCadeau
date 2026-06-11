import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, subject, phone, message } = await request.json();

    // Verification
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Les champs obligatoires (nom, email et message) sont requis.' },
        { status: 400 }
      );
    }

    // Configure Mailer transport
    const host = process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io';
    const port = parseInt(process.env.SMTP_PORT || '2525', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const fromEmail = process.env.SMTP_FROM || 'noreply@benincadeau.com';

    // Si les identifiants SMTP ne sont pas encore configurés (valeur par défaut)
    if (!user || user.includes('remplacez_par')) {
      console.warn("SMTP credentials are not configured. Logging contact form submission instead:", {
        name,
        email,
        subject,
        phone,
        message,
      });
      
      // On retourne une réponse positive en mode développement / maquette si l'adresse n'est pas configurée
      return NextResponse.json({ 
        success: true, 
        message: 'Message reçu (simulé car SMTP non configuré).' 
      });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      auth: {
        user,
        pass,
      },
    });

    const mailOptions = {
      from: `"Bénin Cadeau Contact Form" <${fromEmail}>`,
      to: 'info@sicmagroup.com', // Destinataire par défaut configuré
      subject: `Nouveau message de contact : ${subject || 'Sans sujet'}`,
      text: `
        Nom complet : ${name}
        Email : ${email}
        Téléphone : ${phone || 'Non renseigné'}
        Sujet : ${subject || 'Non renseigné'}
        
        Message :
        ${message}
      `,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 10px;">
          <h2 style="color: #311974; border-bottom: 2px solid #F7BD0D; padding-bottom: 10px;">Nouveau Message de Contact</h2>
          <p>Vous avez reçu un nouveau message depuis le formulaire de contact de <strong>Bénin Cadeau</strong>.</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; width: 150px;">Nom complet :</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Email :</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Téléphone :</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${phone || 'Non renseigné'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Sujet :</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${subject || 'Non renseigné'}</td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding: 15px; background-color: #F5F7FF; border-radius: 8px; border-left: 4px solid #311974;">
            <h4 style="margin-top: 0; color: #311974;">Message :</h4>
            <p style="white-space: pre-wrap; line-height: 1.6; color: #514E4E;">${message}</p>
          </div>
          <footer style="margin-top: 30px; text-align: center; font-size: 12px; color: #94a3b8;">
            Ce message a été généré automatiquement par le serveur Bénin Cadeau.
          </footer>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Message envoyé avec succès.' });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Une erreur interne est survenue lors de l\'envoi du message.' },
      { status: 500 }
    );
  }
}
