export async function sendVerificationEmail({
  email,
  token,
  name,
}: {
  email: string;
  token: string;
  name: string;
}) {
  const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "CarMarket <contact@nicolas-abreu.com>",
      to: [email],
      subject: "Confirmez votre adresse email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Bonjour ${name},</h1>
          <p>Merci de vous être inscrit sur CarMarket. Pour finaliser votre inscription, veuillez confirmer votre adresse email en cliquant sur le lien ci-dessous :</p>
          <a href="${confirmLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 15px 0;">Confirmer mon email</a>
          <p style="color: #666;">Ce lien expirera dans 24 heures.</p>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">Si vous n'avez pas créé de compte sur CarMarket, vous pouvez ignorer cet email.</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de l'envoi de l'email");
  }

  return response;
}
