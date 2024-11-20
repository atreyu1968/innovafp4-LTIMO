import React, { useState } from 'react';
import { Save, Sparkle, AlertTriangle } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { useNotifications } from '../notifications/NotificationProvider';

interface PromptEditorProps {
  onClose: () => void;
}

const PromptEditor: React.FC<PromptEditorProps> = ({ onClose }) => {
  const { settings, updateSettings } = useSettingsStore();
  const { showNotification } = useNotifications();
  const [prompt, setPrompt] = useState(settings.observatory?.promptTemplate || '');

  const handleSave = () => {
    try {
      updateSettings({
        observatory: {
          ...settings.observatory,
          promptTemplate: prompt
        }
      });
      showNotification('success', 'Plantilla de prompt guardada correctamente');
      onClose();
    } catch (error) {
      showNotification('error', 'Error al guardar la plantilla');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full mx-auto">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Sparkle className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-medium">Editor de Prompts</h3>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Variables disponibles
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li><code>{{title}}</code> - Título de la entrada</li>
                  <li><code>{{description}}</code> - Descripción</li>
                  <li><code>{{type}}</code> - Tipo de innovación</li>
                  <li><code>{{author}}</code> - Autor</li>
                  <li><code>{{date}}</code> - Fecha</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plantilla de Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={10}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
            placeholder="Analiza la siguiente innovación educativa:

Título: {{title}}
Descripción: {{description}}
Tipo: {{type}}

Genera:
1. Un resumen ejecutivo
2. Palabras clave relevantes
3. Posible impacto
4. Recomendaciones"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2 inline-block" />
            Guardar Plantilla
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptEditor;