import React, { useState } from 'react';
import { Save, Upload, RefreshCw, Shield, Lock, Wrench } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import { useAuthStore } from '../stores/authStore';
import ColorPicker from '../components/settings/ColorPicker';
import BackupManager from '../components/backup/BackupManager';
import SecuritySettings from '../components/settings/SecuritySettings';
import MaintenanceSettings from '../components/settings/MaintenanceSettings';
import UpdateSettings from '../components/settings/UpdateSettings';
import RegistrationSettings from '../components/settings/RegistrationSettings';
import ObservatorySettings from '../components/observatory/ObservatorySettings';
import EmailSettings from '../components/settings/EmailSettings';
import MeetingSettings from '../components/settings/MeetingSettings';
import RolePermissionsSettings from '../components/settings/RolePermissionsSettings';
import { useNotifications } from '../components/notifications/NotificationProvider';

const Settings = () => {
  const { user } = useAuthStore();
  const { settings, updateSettings } = useSettingsStore();
  const { showNotification } = useNotifications();
  const [formData, setFormData] = useState(settings);
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'permissions' | 'maintenance' | 'updates' | 'backups' | 'registration' | 'observatory' | 'email' | 'meetings'>('general');

  if (user?.role !== 'coordinador_general') {
    return (
      <div className="bg-yellow-50 p-4 rounded-md">
        <p className="text-yellow-700">
          No tienes permisos para acceder a esta sección.
        </p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      updateSettings(formData);
      showNotification('success', 'Configuración guardada correctamente');
    } catch (error) {
      showNotification('error', 'Error al guardar la configuración');
    }
  };

  const handleColorChange = (color: string, path: string[]) => {
    setFormData((prev) => {
      const newData = { ...prev };
      let current: any = newData;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = color;
      return newData;
    });
  };

  const handleReset = () => {
    setFormData(settings);
  };

  const TABS = [
    { id: 'general', label: 'General', icon: Save },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'permissions', label: 'Permisos', icon: Lock },
    { id: 'maintenance', label: 'Mantenimiento', icon: Wrench },
    { id: 'updates', label: 'Actualizaciones', icon: RefreshCw },
    { id: 'backups', label: 'Backups', icon: Upload },
    { id: 'registration', label: 'Registro', icon: Lock },
    { id: 'observatory', label: 'Observatorio', icon: Lock },
    { id: 'email', label: 'Correo', icon: Lock },
    { id: 'meetings', label: 'Videoconferencias', icon: Lock },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Configuración</h2>
        <p className="mt-1 text-sm text-gray-500">
          Personaliza la apariencia y configuración general de la aplicación
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex flex-wrap">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-4 px-6 text-sm font-medium flex items-center ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ... (resto del contenido del formulario general) ... */}
            </form>
          )}

          {activeTab === 'security' && <SecuritySettings />}
          {activeTab === 'permissions' && <RolePermissionsSettings />}
          {activeTab === 'maintenance' && <MaintenanceSettings />}
          {activeTab === 'updates' && <UpdateSettings />}
          {activeTab === 'backups' && <BackupManager />}
          {activeTab === 'registration' && <RegistrationSettings />}
          {activeTab === 'observatory' && <ObservatorySettings onClose={() => setActiveTab('general')} />}
          {activeTab === 'email' && <EmailSettings />}
          {activeTab === 'meetings' && <MeetingSettings />}
        </div>
      </div>
    </div>
  );
};

export default Settings;