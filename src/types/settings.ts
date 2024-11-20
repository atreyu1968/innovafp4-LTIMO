import { UserRole } from './auth';

export interface AppSettings {
  // ... resto de la interfaz ...

  permissions: {
    roles: {
      [key in UserRole]: string[];
    };
    reports?: {
      [reportId: string]: {
        users: string[];
        roles: UserRole[];
        subnets: string[];
      };
    };
    dashboards?: {
      [dashboardId: string]: {
        users: string[];
        roles: UserRole[];
        subnets: string[];
      };
    };
  };

  // ... resto de la interfaz ...
}