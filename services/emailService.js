import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { getEmailTemplate } from './emailTemplate.js'; // Importar la plantilla HTML

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendEmail(to, subject, text) {
    const htmlContent = getEmailTemplate(text); // Obtener la plantilla con el mensaje dinámico

    const mailOptions = {
        from: `"APPDEN: Notificaciones" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text, // Versión en texto plano
        html: htmlContent, // Versión en HTML usando la plantilla
        replyTo: process.env.EMAIL_USER
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Correo enviado correctamente a ${to}`);
    } catch (error) {
        console.error("Error enviando correo:", error);
    }
}

export { sendEmail };
