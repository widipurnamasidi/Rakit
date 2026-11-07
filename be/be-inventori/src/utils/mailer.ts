import nodemailer from "nodemailer";

// Konfigurasi transporter menggunakan data dari .env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // false untuk port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendActivationEmail = async (
  toEmail: string,
  activationLink: string,
) => {
  const mailOptions = {
    from: `"Admin RAKIT" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: "Aktivasi Akun Teknisi RAKIT",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Selamat datang di RAKIT!</h2>
        <p>Akun teknisi Anda telah didaftarkan oleh Admin. Untuk mulai menggunakan aplikasi, silakan aktifkan akun Anda dan buat password baru dengan mengklik tombol di bawah ini:</p>
        <a href="${activationLink}" style="display: inline-block; padding: 10px 20px; background-color: #22c55e; color: white; text-decoration: none; border-radius: 5px; margin: 15px 0;">Aktifkan Akun Saya</a>
        <p>Atau salin tautan berikut ke browser Anda:</p>
        <p><a href="${activationLink}">${activationLink}</a></p>
        <p><i>Tautan ini hanya berlaku selama 24 jam.</i></p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
