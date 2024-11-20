import React from 'react';
import { Mail, Save, TestTube } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { useNotifications } from '../notifications/NotificationProvider';
import { sendEmail } from '../../services/email/emailService';

const EmailSettings = () => {
  const { settings, updateSettings } = useSettingsStore();
  const { showNotification } = useNotifications();

  // Ensure SMTP settings exist with default values
  const smtp = settings.smtp || {
    enabled: false,
    host: '',
    port: 587,
    secure: false,
    user: '',
    password: '',
    from: '',
  };

  const handleTestEmail = async () => {
    if (!smtp.enabled) {
      showNotification('error', 'El servicio de correo no está activado');
      return;
    }

    try {
      await sendEmail({
        to: smtp.user,
        subject: 'Prueba de configuración SMTP',
        html: '<h1>Prueba de correo</h1><p>Si recibes este correo, la configuración SMTP es correcta.</p>',
      });
      showNotification('success', 'Correo de prueba enviado correctamente');
    } catch (error) {
      showNotification('error', 'Error al enviar el correo de prueba');
    }
  };

  const handleSave = () => {
    try {
      // Validar configuración
      if (smtp.enabled) {
        if (!smtp.host || !smtp.user || !smtp.password || !smtp.from) {
          throw new Error('Todos los campos son obligatorios');
        }

        if (smtp.port < 1 || smtp.port > 65535) {
          throw new Error('Puerto inválido');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(smtp.from)) {
          throw new Error('Dirección de correo remitente inválida');
        }
      }

      updateSettings({ smtp });
      showNotification('success', 'Configuración de correo actualizada');
    } catch (error) {
      showNotification('error', (error as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Mail className="h-5 w-5 mr-2 text-blue-500" />
          Configuración de Correo
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Configura el servidor SMTP para el envío de correos
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Activar Servicio de Correo
            </label>
            <p className="text-sm text-gray-500">
              Habilita el envío de correos electrónicos
            </p>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={smtp.enabled}
              onChange={(e) => updateSettings({
                smtp: { ...smtp, enabled: e.target.checked }
              })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>

        {smtp.enabled && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Servidor SMTP
              </label>
              <input
                type="text"
                value={smtp.host}
                onChange={(e) => updateSettings({
                  smtp: { ...smtp, host: e.target.value }
                })}
                placeholder="smtp.gmail.com"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Puerto
                </label>
                <input
                  type="number"
                  value={smtp.port}
                  onChange={(e) => updateSettings({
                    smtp: { ...smtp, port: Number(e.target.value) }
                  })}
                  min="1"
                  max="65535"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={smtp.secure}
                    onChange={(e) => updateSettings({
                      smtp: { ...smtp, secure: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Usar SSL/TLS
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Usuario SMTP
              </label>
              <input
                type="email"
                value={smtp.user}
                onChange={(e) => updateSettings({
                  smtp: { ...smtp, user: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contraseña SMTP
              </label>
              <input
                type="password"
                value={smtp.password}
                onChange={(e) => updateSettings({
                  smtp: { ...smtp, password: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Dirección de Correo Remitente
              </label>
              <input
                type="email"
                value={smtp.from}
                onChange={(e) => updateSettings({
                  smtp: { ...smtp, from: e.target.value }
                })}
                placeholder="Red de Innovación FP <noreply@example.com>"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleTestEmail}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <TestTube className="h-4 w-4 mr-2" />
                Probar Configuración
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Guardar Cambios
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailSettings;