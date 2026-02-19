import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "DriveMetric <noreply@drivemetric.com>";
const APP_NAME = "DriveMetric";

export async function sendPasswordResetEmail(to: string, url: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Réinitialisez votre mot de passe",
    html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:system-ui,sans-serif;background:#f9fafb;margin:0;padding:32px 0">
  <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden">
    <div style="background:#0f172a;padding:24px 32px">
      <h1 style="color:#fff;margin:0;font-size:20px;font-weight:700">${APP_NAME}</h1>
    </div>
    <div style="padding:32px">
      <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827">Réinitialisation du mot de passe</h2>
      <p style="color:#6b7280;margin:0 0 24px;line-height:1.6">
        Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour en définir un nouveau.
      </p>
      <a href="${url}" style="display:inline-block;background:#0f172a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px">
        Réinitialiser mon mot de passe
      </a>
      <p style="color:#9ca3af;margin:24px 0 0;font-size:13px;line-height:1.5">
        Ce lien expire dans 1 heure. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
      </p>
    </div>
    <div style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb">
      <p style="color:#9ca3af;margin:0;font-size:12px">© ${new Date().getFullYear()} ${APP_NAME}. Tous droits réservés.</p>
    </div>
  </div>
</body>
</html>`,
  });
}

export async function sendEmailVerification(to: string, url: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Vérifiez votre adresse email",
    html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:system-ui,sans-serif;background:#f9fafb;margin:0;padding:32px 0">
  <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden">
    <div style="background:#0f172a;padding:24px 32px">
      <h1 style="color:#fff;margin:0;font-size:20px;font-weight:700">${APP_NAME}</h1>
    </div>
    <div style="padding:32px">
      <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827">Vérifiez votre email</h2>
      <p style="color:#6b7280;margin:0 0 24px;line-height:1.6">
        Merci de vous être inscrit sur ${APP_NAME} ! Cliquez sur le bouton ci-dessous pour confirmer votre adresse email et activer votre compte.
      </p>
      <a href="${url}" style="display:inline-block;background:#0f172a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px">
        Vérifier mon email
      </a>
      <p style="color:#9ca3af;margin:24px 0 0;font-size:13px;line-height:1.5">
        Ce lien expire dans 24 heures. Si vous n'avez pas créé de compte, ignorez cet email.
      </p>
    </div>
    <div style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb">
      <p style="color:#9ca3af;margin:0;font-size:12px">© ${new Date().getFullYear()} ${APP_NAME}. Tous droits réservés.</p>
    </div>
  </div>
</body>
</html>`,
  });
}

export async function sendWelcomeEmail(to: string, name: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Bienvenue sur ${APP_NAME} !`,
    html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:system-ui,sans-serif;background:#f9fafb;margin:0;padding:32px 0">
  <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden">
    <div style="background:#0f172a;padding:24px 32px">
      <h1 style="color:#fff;margin:0;font-size:20px;font-weight:700">${APP_NAME}</h1>
    </div>
    <div style="padding:32px">
      <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827">Bienvenue, ${name} !</h2>
      <p style="color:#6b7280;margin:0 0 16px;line-height:1.6">
        Votre compte ${APP_NAME} a été créé avec succès. Vous pouvez maintenant accéder à des milliers de fiches techniques et à l'analyse IA de fiabilité.
      </p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin-bottom:24px">
        <p style="margin:0;font-size:14px;color:#166534;font-weight:600">
          🎁 3 crédits offerts à l'inscription !
        </p>
        <p style="margin:4px 0 0;font-size:13px;color:#15803d">
          Utilisez-les pour générer des analyses IA de fiabilité sur les véhicules de votre choix.
        </p>
      </div>
      <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://drivemetric.com"}/specification" style="display:inline-block;background:#0f172a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px">
        Explorer les fiches techniques
      </a>
    </div>
    <div style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb">
      <p style="color:#9ca3af;margin:0;font-size:12px">© ${new Date().getFullYear()} ${APP_NAME}. Tous droits réservés.</p>
    </div>
  </div>
</body>
</html>`,
  });
}

export async function sendCreditPurchaseConfirmation(
  to: string,
  name: string,
  credits: number,
  amount: number
) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Confirmation d'achat — ${credits} crédits`,
    html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:system-ui,sans-serif;background:#f9fafb;margin:0;padding:32px 0">
  <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden">
    <div style="background:#0f172a;padding:24px 32px">
      <h1 style="color:#fff;margin:0;font-size:20px;font-weight:700">${APP_NAME}</h1>
    </div>
    <div style="padding:32px">
      <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827">Achat confirmé !</h2>
      <p style="color:#6b7280;margin:0 0 24px;line-height:1.6">
        Bonjour ${name}, votre achat a bien été enregistré.
      </p>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin-bottom:24px">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px">
          <span style="color:#6b7280;font-size:14px">Crédits achetés</span>
          <span style="font-weight:700;color:#111827;font-size:14px">${credits} crédits</span>
        </div>
        <div style="display:flex;justify-content:space-between">
          <span style="color:#6b7280;font-size:14px">Montant</span>
          <span style="font-weight:700;color:#111827;font-size:14px">${(amount / 100).toFixed(2)} €</span>
        </div>
      </div>
      <p style="color:#6b7280;margin:0 0 24px;font-size:14px;line-height:1.6">
        Vos crédits sont immédiatement disponibles sur votre compte. Utilisez-les pour générer des analyses IA de fiabilité.
      </p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://drivemetric.com"}/specification" style="display:inline-block;background:#0f172a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px">
        Utiliser mes crédits
      </a>
    </div>
    <div style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb">
      <p style="color:#9ca3af;margin:0;font-size:12px">© ${new Date().getFullYear()} ${APP_NAME}. Tous droits réservés.</p>
    </div>
  </div>
</body>
</html>`,
  });
}

export async function sendDeleteAccountVerification(to: string, url: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Confirmation de suppression de compte",
    html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:system-ui,sans-serif;background:#f9fafb;margin:0;padding:32px 0">
  <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden">
    <div style="background:#0f172a;padding:24px 32px">
      <h1 style="color:#fff;margin:0;font-size:20px;font-weight:700">${APP_NAME}</h1>
    </div>
    <div style="padding:32px">
      <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#dc2626">Suppression de compte</h2>
      <p style="color:#6b7280;margin:0 0 24px;line-height:1.6">
        Vous avez demandé la suppression de votre compte. Cette action est <strong>irréversible</strong>. Cliquez sur le bouton ci-dessous pour confirmer.
      </p>
      <a href="${url}" style="display:inline-block;background:#dc2626;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px">
        Confirmer la suppression
      </a>
      <p style="color:#9ca3af;margin:24px 0 0;font-size:13px;line-height:1.5">
        Si vous n'avez pas demandé cette suppression, ignorez cet email et sécurisez votre compte.
      </p>
    </div>
    <div style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb">
      <p style="color:#9ca3af;margin:0;font-size:12px">© ${new Date().getFullYear()} ${APP_NAME}. Tous droits réservés.</p>
    </div>
  </div>
</body>
</html>`,
  });
}
