import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io';
const port = parseInt(process.env.SMTP_PORT || '2525', 10);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const fromEmail = process.env.SMTP_FROM || 'noreply@benincadeau.com';

function getTransporter() {
  if (!user || user.includes('remplacez_par')) {
    console.warn("SMTP credentials are not configured in .env. Skipping actual email delivery.");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendOrderConfirmationEmail(order: any, items: any[]) {
  const transporter = getTransporter();
  if (!transporter) return;

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; color: #1e293b;">
        <strong>${item.name}</strong>
        ${item.customizationMessage ? `
          <div style="font-size: 11px; color: #6366f1; margin-top: 4px; font-style: italic;">
            Personnalisation : "${item.customizationMessage}"
          </div>
        ` : ''}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; text-align: center; color: #475569;">
        ${item.quantity}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; text-align: right; color: #1e293b; font-weight: bold;">
        ${item.price.toLocaleString('fr-FR')} FCFA
      </td>
    </tr>
  `).join('');

  const mailOptions = {
    from: `"Bénin Cadeau" <${fromEmail}>`,
    to: order.clientEmail,
    subject: `Confirmation de commande : ${order.orderNumber}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 25px; border-bottom: 3px solid #F7BD0D; padding-bottom: 20px;">
          <h1 style="color: #311974; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">BÉNIN CADEAU</h1>
          <p style="color: #64748b; font-size: 14px; margin: 5px 0 0 0;">L'art d'offrir avec élégance</p>
        </div>

        <h2 style="color: #1e293b; font-size: 18px; font-weight: 700; margin-bottom: 10px;">Merci pour votre commande !</h2>
        <p style="color: #475569; font-size: 14px; line-height: 1.6; margin-bottom: 25px;">
          Bonjour <strong>${order.clientName}</strong>,<br>
          Votre commande a bien été enregistrée sous le numéro <strong>${order.orderNumber}</strong>. 
          Elle est actuellement en attente de paiement. Dès que le paiement sera finalisé via FedaPay, nous lancerons sa préparation immédiate.
        </p>

        <div style="background-color: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 25px;">
          <h3 style="color: #311974; font-size: 14px; font-weight: 700; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px;">Récapitulatif de livraison</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #475569; line-height: 1.5;">
            <tr>
              <td style="padding: 4px 0; font-weight: bold; width: 120px;">Adresse :</td>
              <td style="padding: 4px 0;">${order.shippingAddress}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: bold;">Téléphone :</td>
              <td style="padding: 4px 0;">${order.clientPhone}</td>
            </tr>
          </table>
        </div>

        <h3 style="color: #1e293b; font-size: 14px; font-weight: 700; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Détails des articles</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 25px;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="padding: 10px; text-align: left; color: #475569; font-weight: 600;">Article</th>
              <th style="padding: 10px; text-align: center; color: #475569; font-weight: 600; width: 60px;">Qté</th>
              <th style="padding: 10px; text-align: right; color: #475569; font-weight: 600; width: 100px;">Prix unit.</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2" style="padding: 12px 10px; text-align: right; color: #64748b; font-weight: bold;">Frais de livraison :</td>
              <td style="padding: 12px 10px; text-align: right; color: #1e293b; font-weight: bold;">${order.shippingFee.toLocaleString('fr-FR')} FCFA</td>
            </tr>
            <tr style="border-top: 2px solid #e2e8f0;">
              <td colSpan="2" style="padding: 15px 10px; text-align: right; color: #311974; font-weight: 800; font-size: 16px;">Montant Total :</td>
              <td style="padding: 15px 10px; text-align: right; color: #311974; font-weight: 900; font-size: 18px; background-color: #fef08a; border-radius: 8px;">
                ${order.totalAmount.toLocaleString('fr-FR')} FCFA
              </td>
            </tr>
          </tfoot>
        </table>

        <div style="text-align: center; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
          <p style="color: #64748b; font-size: 12px; margin: 0 0 10px 0;">Des questions sur votre commande ?</p>
          <a href="https://wa.me/22955250000" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: bold;">
            Nous contacter sur WhatsApp
          </a>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
  }
}

export async function sendPaymentConfirmationEmail(order: any) {
  const transporter = getTransporter();
  if (!transporter) return;

  const mailOptions = {
    from: `"Bénin Cadeau" <${fromEmail}>`,
    to: order.clientEmail,
    subject: `Paiement validé - Commande ${order.orderNumber}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 25px; border-bottom: 3px solid #25D366; padding-bottom: 20px;">
          <h1 style="color: #311974; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">BÉNIN CADEAU</h1>
          <p style="color: #64748b; font-size: 14px; margin: 5px 0 0 0;">Votre paiement a été reçu avec succès</p>
        </div>

        <h2 style="color: #1e293b; font-size: 18px; font-weight: 700; margin-bottom: 10px;">Paiement Confirmé !</h2>
        <p style="color: #475569; font-size: 14px; line-height: 1.6; margin-bottom: 25px;">
          Bonjour <strong>${order.clientName}</strong>,<br>
          Nous avons le plaisir de vous confirmer la validation de votre paiement pour la commande <strong>${order.orderNumber}</strong>.<br>
          Le montant de <strong>${order.totalAmount.toLocaleString('fr-FR')} FCFA</strong> a bien été réglé.
        </p>

        <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 15px; margin-bottom: 25px; color: #065f46;">
          <h3 style="font-size: 14px; font-weight: 700; margin: 0 0 5px 0;">Préparation en cours</h3>
          <p style="margin: 0; font-size: 13px; line-height: 1.5;">
            Notre équipe prépare minutieusement votre colis cadeau. Vous serez notifié par e-mail ou WhatsApp lors de son expédition.
          </p>
        </div>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #64748b; line-height: 1.6;">
          <strong>Récapitulatif de la commande :</strong><br>
          Numéro de commande : ${order.orderNumber}<br>
          Date de validation : ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}<br>
          Adresse de livraison : ${order.shippingAddress}
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
  }
}
