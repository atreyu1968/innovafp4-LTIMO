import React from 'react';
import { Shield, Save } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { useNotifications } from '../notifications/NotificationProvider';
import { UserRole } from '../../types/auth';

const FEATURES = [
  { id: 'forms', label: 'Formularios', description: 'Crear y gestionar formularios' },
  { id: 'reports', label: 'Informes', description: 'Generar y ver informes' },
  { id: 'reports_view', label: 'Ver Informes', description: 'Ver informes compartidos' },
  { id: 'reports_create', label: 'Crear Informes', description: 'Generar nuevos informes' },
  { id: 'dashboards', label: 'Dashboards', description: 'Crear y gestionar dashboards' },
  { id: 'dashboards_view', label: 'Ver Dashboards', description: 'Ver dashboards compartidos' },
  { id: 'dashboards_create', label: 'Crear Dashboards', description: 'Crear nuevos dashboards' },
  { id: 'meetings', label: 'Videoconferencias', description: 'Programar reuniones' },
  { id: 'messages', label: 'Mensajes', description: 'Enviar mensajes internos' },
  { id: 'observatory', label: 'Observatorio', description: 'Acceso al observatorio' },
  { id: 'network', label: 'Red', description: 'Gestionar subredes y centros' },
  { id: 'users', label: 'Usuarios', description: 'Gestionar usuarios' },
  { id: 'settings', label: 'Configuración', description: 'Acceder a la configuración' },
];

const ROLES: { id: UserRole; label: string }[] = [
  { id: 'gestor', label: 'Gestor' },
  { id: 'coordinador_subred', label: 'Coordinador de Subred' },
  { id: 'coordinador_general', label: 'Coordinador General' },
];

const RolePermissionsSettings = () => {
  const { settings, updateSettings } = useSettingsStore();
  const { showNotification } = useNotifications();

  // Ensure permissions exist with default values
  const permissions = settings.permissions || {
    roles: {
      gestor: [],
      coordinador_subred: [],
      coordinador_general: ['*'],
    }
  };

  const handlePermissionToggle = (role: UserRole, feature: string) => {
    const rolePermissions = permissions.roles[role] || [];
    const newPermissions = rolePermissions.includes(feature)
      ? rolePermissions.filter(p => p !== feature)
      : [...rolePermissions, feature];

    const updatedPermissions = {
      ...permissions,
      roles: {
        ...permissions.roles,
        [role]: newPermissions
      }
    };

    try {
      updateSettings({ permissions: updatedPermissions });
      showNotification('success', 'Permisos actualizados correctamente');
    } catch (error) {
      showNotification('error', 'Error al actualizar los permisos');
    }
  };

  const hasPermission = (role: UserRole, feature: string): boolean => {
    return permissions.roles[role]?.includes(feature) || permissions.roles[role]?.includes('*') || false;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-blue-500" />
          Permisos por Rol
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Configura los permisos de acceso para cada rol de usuario
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Funcionalidad
              </th>
              {ROLES.map(role => (
                <th key={role.id} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {role.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {FEATURES.map(feature => (
              <tr key={feature.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{feature.label}</div>
                  <div className="text-sm text-gray-500">{feature.description}</div>
                </td>
                {ROLES.map(role => (
                  <td key={role.id} className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={hasPermission(role.id, feature.id)}
                      onChange={() => handlePermissionToggle(role.id, feature.id)}
                      disabled={role.id === 'coordinador_general' && feature.id === 'settings'}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <Shield className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Información sobre permisos
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>El Coordinador General siempre tiene acceso a la configuración</li>
                <li>Los permisos son acumulativos (ver + crear)</li>
                <li>Los cambios se aplican inmediatamente</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolePermissionsSettings;