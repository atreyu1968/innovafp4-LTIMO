```typescript
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const { settings } = useSettingsStore.getState();
  
  // Validar correo antes de enviar
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(options.to)) {
    throw new Error('Dirección de correo inválida');
  }

  // Sanitizar HTML antes de enviar
  const sanitizedHtml = DOMPurify.sanitize(options.html);
  
  try {
    const response = await fetch('/api/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      credentials: 'include', // Para cookies de sesión
      body: JSON.stringify({
        to: options.to,
        subject: options.subject,
        html: sanitizedHtml,
        config: settings.smtp
      }),
    });

    if (!response.ok) {
      throw new Error('Error al enviar el correo electrónico');
    }
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
```