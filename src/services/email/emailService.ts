import { useSettingsStore } from '../../stores/settingsStore';
import DOMPurify from 'dompurify';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const { settings } = useSettingsStore.getState();
  
  if (!settings.smtp?.enabled) {
    throw new Error('El servicio de correo no está configurado o está desactivado');
  }

  // Validar correo
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(options.to)) {
    throw new Error('Dirección de correo inválida');
  }
  
  // Sanitizar HTML
  const sanitizedHtml = DOMPurify.sanitize(options.html);
  
  try {
    const response = await fetch('/api/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: options.to,
        subject: options.subject,
        html: sanitizedHtml,
        config: {
          from: settings.smtp.from,
          host: settings.smtp.host,
          port: settings.smtp.port,
          secure: settings.smtp.secure,
          auth: {
            user: settings.smtp.user,
            pass: settings.smtp.password,
          }
        }
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al enviar el correo');
    }
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error al enviar el correo electrónico');
  }
};