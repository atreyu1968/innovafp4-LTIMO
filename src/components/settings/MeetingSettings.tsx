import React from 'react';
import { Video, Save } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { useNotifications } from '../notifications/NotificationProvider';

const MeetingSettings = () => {
  const { settings, updateSettings } = useSettingsStore();
  const { showNotification } = useNotifications();

  // Ensure meetings settings exist with default values
  const meetings = settings.meetings || {
    enabled: false,
    provider: 'jitsi' as const,
    allowedRoles: ['coordinador_general'],
    maxDuration: 120,
    maxParticipants: 50,
    requireApproval: false,
    autoRecording: false,
    serverUrl: 'https://meet.jit.si',
  };

  const handleSave = () => {
    try {
      // Validar configuración
      if (meetings.maxDuration < 15 || meetings.maxDuration > 480) {
        throw new Error('La duración debe estar entre 15 y 480 minutos');
      }
      
      if (meetings.maxParticipants < 2 || meetings.maxParticipants > 100) {
        throw new Error('El número de participantes debe estar entre 2 y 100');
      }

      if (meetings.enabled && !meetings.serverUrl?.startsWith('https://')) {
        throw new Error('La URL del servidor debe usar HTTPS');
      }

      updateSettings({ meetings });
      showNotification('success', 'Configuración de videoconferencias actualizada');
    } catch (error) {
      showNotification('error', (error as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Video className="h-5 w-5 mr-2 text-blue-500" />
          Videoconferencias
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Configura el servicio de videoconferencias
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Activar Videoconferencias
            </label>
            <p className="text-sm text-gray-500">
              Habilita el servicio de videoconferencias en la plataforma
            </p>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={meetings.enabled}
              onChange={(e) => updateSettings({
                meetings: { ...meetings, enabled: e.target.checked }
              })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>

        {meetings.enabled && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Proveedor
              </label>
              <select
                value={meetings.provider}
                onChange={(e) => updateSettings({
                  meetings: { ...meetings, provider: e.target.value as 'jitsi' | 'zoom' | 'meet' }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="jitsi">Jitsi Meet</option>
                <option value="zoom">Zoom</option>
                <option value="meet">Google Meet</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                URL del Servidor
              </label>
              <input
                type="url"
                value={meetings.serverUrl}
                onChange={(e) => updateSettings({
                  meetings: { ...meetings, serverUrl: e.target.value }
                })}
                placeholder="https://meet.jit.si"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Roles que pueden convocar reuniones
              </label>
              <div className="mt-2 space-y-2">
                {['gestor', 'coordinador_subred', 'coordinador_general'].map((role) => (
                  <label key={role} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={meetings.allowedRoles.includes(role)}
                      onChange={(e) => {
                        const roles = e.target.checked
                          ? [...meetings.allowedRoles, role]
                          : meetings.allowedRoles.filter(r => r !== role);
                        updateSettings({
                          meetings: { ...meetings, allowedRoles: roles }
                        });
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {role === 'gestor'
                        ? 'Gestor'
                        : role === 'coordinador_subred'
                        ? 'Coordinador de Subred'
                        : 'Coordinador General'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Duración máxima (minutos)
                </label>
                <input
                  type="number"
                  min="15"
                  max="480"
                  value={meetings.maxDuration}
                  onChange={(e) => updateSettings({
                    meetings: { ...meetings, maxDuration: Number(e.target.value) }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Máximo de participantes
                </label>
                <input
                  type="number"
                  min="2"
                  max="100"
                  value={meetings.maxParticipants}
                  onChange={(e) => updateSettings({
                    meetings: { ...meetings, maxParticipants: Number(e.target.value) }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Requerir aprobación
                </label>
                <p className="text-sm text-gray-500">
                  Las reuniones deben ser aprobadas por un administrador
                </p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={meetings.requireApproval}
                  onChange={(e) => updateSettings({
                    meetings: { ...meetings, requireApproval: e.target.checked }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Grabación automática
                </label>
                <p className="text-sm text-gray-500">
                  Grabar automáticamente todas las reuniones
                </p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={meetings.autoRecording}
                  onChange={(e) => updateSettings({
                    meetings: { ...meetings, autoRecording: e.target.checked }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>

            {meetings.provider !== 'jitsi' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  API Key
                </label>
                <input
                  type="password"
                  value={meetings.apiKey}
                  onChange={(e) => updateSettings({
                    meetings: { ...meetings, apiKey: e.target.value }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Save className="h-4 w-4 mr-2" />
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default MeetingSettings;