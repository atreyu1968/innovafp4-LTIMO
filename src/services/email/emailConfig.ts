import nodemailer from 'nodemailer';
import { useSettingsStore } from '../../stores/settingsStore';

export const createTransporter = () => {
  const { settings } = useSettingsStore.getState();
  
  if (!settings.smtp?.enabled) {
    throw new Error('SMTP service is not enabled');
  }
  
  return nodemailer.createTransport({
    host: settings.smtp.host,
    port: settings.smtp.port,
    secure: settings.smtp.secure,
    auth: {
      user: settings.smtp.user,
      pass: settings.smtp.password,
    },
  });
};