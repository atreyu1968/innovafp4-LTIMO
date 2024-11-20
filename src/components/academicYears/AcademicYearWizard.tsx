import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Save, Check, X, Layout } from 'lucide-react';
import { useAcademicYearStore } from '../../stores/academicYearStore';
import { useNetworkStore } from '../../stores/networkStore';
import { useUserStore } from '../../stores/userStore';
import { useFormStore } from '../../stores/formStore';
import { useReportStore } from '../../stores/reportStore';
import { useDashboardStore } from '../../stores/dashboardStore';
import { useNotifications } from '../notifications/NotificationProvider';
import AcademicYearForm from './AcademicYearForm';
import ImportModal from '../networks/ImportModal';
import ImportFormModal from '../forms/ImportFormModal';
import ImportDashboardModal from '../dashboards/ImportDashboardModal';

const AcademicYearWizard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [yearData, setYearData] = useState<any>(null);
  const [showImportNetwork, setShowImportNetwork] = useState(false);
  const [showImportUsers, setShowImportUsers] = useState(false);
  const [showImportForms, setShowImportForms] = useState(false);
  const [showImportDashboards, setShowImportDashboards] = useState(false);
  const { showNotification } = useNotifications();
  const { addYear } = useAcademicYearStore();

  const steps = [
    {
      id: 'year',
      title: 'Crear Curso Académico',
      description: 'Define el período y las fechas del nuevo curso',
    },
    {
      id: 'network',
      title: 'Configurar Red',
      description: 'Importa o crea subredes, centros y familias profesionales',
    },
    {
      id: 'users',
      title: 'Gestionar Usuarios',
      description: 'Importa o crea la base de datos de usuarios',
    },
    {
      id: 'forms',
      title: 'Configurar Formularios',
      description: 'Importa o crea los formularios necesarios',
    },
    {
      id: 'dashboards',
      title: 'Configurar Dashboards',
      description: 'Importa o crea los dashboards del curso',
    },
    {
      id: 'reports',
      title: 'Configurar Informes',
      description: 'Importa o crea las plantillas de informes',
    },
    {
      id: 'activate',
      title: 'Activar Curso',
      description: 'Revisa y activa el nuevo curso académico',
    },
  ];

  const handleYearSubmit = (data: any) => {
    setYearData({
      ...data,
      id: crypto.randomUUID(),
      status: 'pending',
    });
    setCurrentStep(1);
  };

  const handleActivate = () => {
    if (yearData) {
      addYear({
        ...yearData,
        status: 'active',
      });
      showNotification('success', 'Curso académico activado correctamente');
      onClose();
    }
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'year':
        return (
          <div className="space-y-4">
            <AcademicYearForm
              onSubmit={handleYearSubmit}
              onCancel={onClose}
              initialData={yearData}
            />
          </div>
        );

      case 'network':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-500 cursor-pointer transition-colors"
                onClick={() => setShowImportNetwork(true)}
              >
                <h4 className="text-lg font-medium mb-2">Importar desde curso anterior</h4>
                <p className="text-sm text-gray-500">
                  Importa subredes, centros y familias profesionales desde un curso anterior
                </p>
              </div>

              <div 
                className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-500 cursor-pointer transition-colors"
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                <h4 className="text-lg font-medium mb-2">Crear nueva estructura</h4>
                <p className="text-sm text-gray-500">
                  Configura manualmente la estructura de la red
                </p>
              </div>
            </div>
          </div>
        );

      // ... (resto de los casos del switch)

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-50 rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white rounded-t-lg">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{steps[currentStep].title}</h3>
            <p className="mt-1 text-sm text-gray-500">{steps[currentStep].description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100"
            title="Cerrar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-6 py-3 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex-1">
              <div className="flex mb-2 items-center justify-between">
                <span>{`Paso ${currentStep + 1} de ${steps.length}`}</span>
                <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
              </div>
              <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
                <div
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-gray-200 rounded-b-lg">
          <div className="flex justify-between">
            <button
              type="button"
              onClick={currentStep === 0 ? onClose : () => setCurrentStep(currentStep - 1)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              {currentStep === 0 ? 'Cancelar' : 'Anterior'}
            </button>

            {currentStep < steps.length - 1 && steps[currentStep].id !== 'year' && (
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <X className="h-5 w-5 mr-2" />
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Siguiente
                  <ChevronRight className="h-5 w-5 ml-2" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showImportNetwork && (
        <ImportModal type="subnet" onClose={() => setShowImportNetwork(false)} />
      )}

      {showImportUsers && (
        <ImportModal type="family" onClose={() => setShowImportUsers(false)} />
      )}

      {showImportForms && (
        <ImportFormModal onClose={() => setShowImportForms(false)} />
      )}

      {showImportDashboards && (
        <ImportDashboardModal onClose={() => setShowImportDashboards(false)} />
      )}
    </div>
  );
};

export default AcademicYearWizard;