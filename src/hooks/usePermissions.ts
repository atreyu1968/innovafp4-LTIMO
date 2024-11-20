import { useAuthStore } from '../stores/authStore';
import { useSettingsStore } from '../stores/settingsStore';

export const usePermissions = () => {
  const { user } = useAuthStore();
  const { settings } = useSettingsStore();

  const hasPermission = (feature: string): boolean => {
    if (!user || !settings.permissions?.roles) return false;

    // El coordinador general siempre tiene acceso a la configuración
    if (user.role === 'coordinador_general' && feature === 'settings') {
      return true;
    }

    // Permisos específicos para informes y dashboards
    if (feature === 'reports') {
      return hasPermission('reports_create') || hasPermission('reports_view');
    }

    if (feature === 'dashboards') {
      return hasPermission('dashboards_create') || hasPermission('dashboards_view');
    }

    return settings.permissions.roles[user.role]?.includes(feature) || false;
  };

  const canCreateReport = (): boolean => {
    return hasPermission('reports_create');
  };

  const canViewReport = (reportId: string): boolean => {
    if (hasPermission('reports_create')) return true;
    if (!hasPermission('reports_view')) return false;
    
    // Aquí puedes añadir lógica adicional para verificar si el usuario
    // tiene acceso específico a este informe (por ejemplo, si está compartido con él)
    return true;
  };

  const canCreateDashboard = (): boolean => {
    return hasPermission('dashboards_create');
  };

  const canViewDashboard = (dashboardId: string): boolean => {
    if (hasPermission('dashboards_create')) return true;
    if (!hasPermission('dashboards_view')) return false;
    
    // Aquí puedes añadir lógica adicional para verificar si el usuario
    // tiene acceso específico a este dashboard
    return true;
  };

  return { 
    hasPermission,
    canCreateReport,
    canViewReport,
    canCreateDashboard,
    canViewDashboard
  };
};