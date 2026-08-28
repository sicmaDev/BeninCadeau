import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io';
const port = parseInt(process.env.SMTP_PORT || '2525', 10);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const fromEmail = process.env.SMTP_FROM || 'noreply@benincadeau.com';

type EmailOrder = {
  orderNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  shippingAddress: string;
  shippingFee: number;
  totalAmount: number;
};

type EmailItem = {
  name: string;
  quantity: number;
  price: number;
  customizationMessage?: string | null;
};

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

export async function sendOrderConfirmationEmail(order: EmailOrder, items: EmailItem[]) {
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

export async function sendPaymentConfirmationEmail(order: EmailOrder) {
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

export async function sendOtpEmail(email: string, otp: string) {
  const transporter = getTransporter();
  if (!transporter) {
    console.log(`[OTP Skip Delivery] OTP for ${email} is ${otp}`);
    return;
  }

  const mailOptions = {
    from: `"Bénin Cadeau" <${fromEmail}>`,
    to: email,
    subject: `Votre code de vérification - Bénin Cadeau`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 25px; border-bottom: 3px solid #F7BD0D; padding-bottom: 20px;">
          <h1 style="color: #311974; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">BÉNIN CADEAU</h1>
        </div>
        <h2 style="color: #1e293b; font-size: 18px; font-weight: 700; margin-bottom: 10px; text-align: center;">Code de vérification</h2>
        <p style="color: #475569; font-size: 14px; line-height: 1.6; text-align: center; margin-bottom: 25px;">
          Utilisez le code de vérification ci-dessous pour accéder au suivi et à l'historique de vos commandes :
        </p>
        <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 15px; margin-bottom: 25px; text-align: center;">
          <span style="font-size: 28px; font-weight: bold; color: #311974; letter-spacing: 4px;">${otp}</span>
        </div>
        <p style="color: #64748b; font-size: 11px; text-align: center; margin: 0;">
          Ce code est valable pendant 5 minutes. Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending OTP email:', error);
  }
}

export async function sendOrderStatusUpdateEmail(order: EmailOrder, oldStatus: string, newStatus: string) {
  const transporter = getTransporter();
  if (!transporter) return;

  const STATUS_LABELS: Record<string, string> = {
    EN_ATTENTE: "En attente de paiement",
    PAYEE: "Payée / Confirmée",
    EN_PREPARATION: "En préparation",
    EXPEDIEE: "Expédiée",
    LIVREE: "Livrée",
    ANNULEE: "Annulée",
  };

  const oldLabel = STATUS_LABELS[oldStatus] || oldStatus;
  const newLabel = STATUS_LABELS[newStatus] || newStatus;

  const mailOptions = {
    from: `"Bénin Cadeau" <${fromEmail}>`,
    to: order.clientEmail,
    subject: `Mise à jour de votre commande ${order.orderNumber}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 25px; border-bottom: 3px solid #1A2B6D; padding-bottom: 20px;">
          <h1 style="color: #311974; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">BÉNIN CADEAU</h1>
          <p style="color: #64748b; font-size: 14px; margin: 5px 0 0 0;">L'art d'offrir avec élégance</p>
        </div>

        <h2 style="color: #1e293b; font-size: 18px; font-weight: 700; margin-bottom: 15px;">Mise à jour de statut</h2>
        <p style="color: #475569; font-size: 14px; line-height: 1.6; margin-bottom: 25px;">
          Bonjour <strong>${order.clientName}</strong>,<br>
          Nous vous informons que le statut de votre commande <strong>${order.orderNumber}</strong> a été mis à jour par notre équipe.
        </p>

        <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 25px; border: 1px solid #e2e8f0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #475569;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 140px; color: #64748b;">Ancien statut :</td>
              <td style="padding: 6px 0; text-decoration: line-through; color: #ef4444;">${oldLabel}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #64748b;">Nouveau statut :</td>
              <td style="padding: 6px 0; font-weight: bold; color: #10b981; font-size: 15px;">${newLabel}</td>
            </tr>
          </table>
        </div>

        <p style="color: #475569; font-size: 13px; line-height: 1.6; margin-bottom: 25px;">
          Vous pouvez suivre l'avancement de votre commande à tout moment dans votre espace personnel sur notre site.
        </p>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #64748b; line-height: 1.6; text-align: center;">
          Pour toute question, n'hésitez pas à nous contacter sur WhatsApp.
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending status update email:', error);
  }
}

export async function sendAdminNewOrderEmail(order: EmailOrder, items: EmailItem[]) {
  const transporter = getTransporter();
  if (!transporter) return;

  const adminEmail = process.env.ADMIN_EMAIL || fromEmail;

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #1e293b;">
        <strong>${item.name}</strong>
        ${item.customizationMessage ? `<br><small style="color: #6366f1;">Perso: "${item.customizationMessage}"</small>` : ''}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold;">${item.price.toLocaleString('fr-FR')} FCFA</td>
    </tr>
  `).join('');

  const mailOptions = {
    from: `"Bénin Cadeau" <${fromEmail}>`,
    to: adminEmail,
    subject: `[ADMIN] Nouvelle commande reçue : ${order.orderNumber}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="background-color: #1A2B6D; color: #ffffff; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 25px;">
          <h1 style="margin: 0; font-size: 20px; font-weight: bold;">Nouvelle Commande Reçue !</h1>
          <p style="margin: 5px 0 0 0; font-size: 13px; opacity: 0.9;">Commande numéro : ${order.orderNumber}</p>
        </div>

        <h3 style="color: #1e293b; margin-top: 0;">Détails du Client</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #475569; margin-bottom: 25px; background: #f8fafc; padding: 15px; border-radius: 8px;">
          <tr>
            <td style="padding: 6px; font-weight: bold; width: 120px;">Nom :</td>
            <td style="padding: 6px;">${order.clientName}</td>
          </tr>
          <tr>
            <td style="padding: 6px; font-weight: bold;">E-mail :</td>
            <td style="padding: 6px;">${order.clientEmail}</td>
          </tr>
          <tr>
            <td style="padding: 6px; font-weight: bold;">Téléphone :</td>
            <td style="padding: 6px;">${order.clientPhone}</td>
          </tr>
          <tr>
            <td style="padding: 6px; font-weight: bold;">Adresse :</td>
            <td style="padding: 6px;">${order.shippingAddress}</td>
          </tr>
        </table>

        <h3 style="color: #1e293b;">Articles Commandés</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 25px;">
          <thead>
            <tr style="background-color: #f1f5f9; color: #475569;">
              <th style="padding: 10px; text-align: left;">Article</th>
              <th style="padding: 10px; text-align: center; width: 60px;">Qté</th>
              <th style="padding: 10px; text-align: right; width: 100px;">Prix</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2" style="padding: 12px 10px; text-align: right; font-weight: bold; color: #64748b;">Frais de livraison :</td>
              <td style="padding: 12px 10px; text-align: right; font-weight: bold; color: #1e293b;">${order.shippingFee.toLocaleString('fr-FR')} FCFA</td>
            </tr>
            <tr style="border-top: 2px solid #e2e8f0;">
              <td colSpan="2" style="padding: 15px 10px; text-align: right; font-weight: bold; font-size: 15px; color: #1A2B6D;">Montant Total :</td>
              <td style="padding: 15px 10px; text-align: right; font-weight: bold; font-size: 16px; color: #1A2B6D; background-color: #fef08a;">
                ${order.totalAmount.toLocaleString('fr-FR')} FCFA
              </td>
            </tr>
          </tfoot>
        </table>

        <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #64748b;">
          Veuillez vous connecter sur le panneau d'administration pour gérer cette commande.
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending admin notification email:', error);
  }
}
