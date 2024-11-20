import React, { useState } from 'react';
import { Wand2, Save, Sparkle } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { useNotifications } from '../notifications/NotificationProvider';

interface AIPromptBuilderProps {
  selectedData: any;
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onGenerate: (content: any) => void;
}

const PROMPT_TEMPLATES = {
  report: [
    {
      name: 'Análisis General',
      template: 'Analiza los datos proporcionados y genera un informe detallado que incluya:\n\n1. Resumen ejecutivo\n2. Principales hallazgos\n3. Tendencias identificadas\n4. Conclusiones y recomendaciones'
    },
    {
      name: 'Comparativa',
      template: 'Realiza un análisis comparativo de los datos, destacando:\n\n1. Similitudes y diferencias\n2. Patrones relevantes\n3. Áreas de mejora\n4. Mejores prácticas identificadas'
    }
  ],
  dashboard: [
    {
      name: 'KPIs',
      template: 'Analiza los datos y sugiere un dashboard con los siguientes elementos:\n\n1. KPIs principales\n2. Gráficos relevantes\n3. Tablas de datos importantes\n4. Filtros recomendados'
    },
    {
      name: 'Tendencias',
      template: 'Diseña un dashboard enfocado en tendencias que incluya:\n\n1. Gráficos de evolución temporal\n2. Indicadores de cambio\n3. Predicciones\n4. Análisis comparativo'
    }
  ]
};

const AIPromptBuilder: React.FC<AIPromptBuilderProps> = ({
  selectedData,
  prompt,
  onPromptChange,
  onGenerate
}) => {
  const { settings } = useSettingsStore();
  const { showNotification } = useNotifications();
  const [generating, setGenerating] = useState(false);
  const [outputType, setOutputType] = useState<'report' | 'dashboard'>('report');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    onPromptChange(template);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showNotification('error', 'Por favor, escribe o selecciona un prompt');
      return;
    }

    setGenerating(true);
    try {
      // Generar contenido basado en el prompt y los datos
      const formattedData = selectedData.formData.map((item: any) => ({
        formulario: item.form.title,
        campos: item.form.fields.map((f: any) => f.label),
        respuestas: item.responses.length
      }));

      const additionalData = selectedData.additionalFiles.map((file: any) => ({
        archivo: file.name,
        registros: file.data.length,
        campos: Object.keys(file.data[0] || {})
      }));

      // Generar contenido simple basado en el análisis de datos
      const content = {
        type: outputType,
        content: outputType === 'report' 
          ? generateReportContent(formattedData, additionalData, prompt)
          : generateDashboardContent(formattedData, additionalData, prompt),
        data: selectedData,
        timestamp: new Date().toISOString()
      };

      onGenerate(content);
      showNotification('success', 'Contenido generado correctamente');
    } catch (error) {
      showNotification('error', 'Error al generar el contenido');
    } finally {
      setGenerating(false);
    }
  };

  // Función simple para generar contenido de informe
  const generateReportContent = (formData: any[], additionalData: any[], prompt: string) => {
    return `# Análisis de Datos

## Resumen Ejecutivo
Análisis basado en ${formData.length} formularios y ${additionalData.length} fuentes adicionales.

## Datos Analizados
${formData.map(form => `- ${form.formulario}: ${form.respuestas} respuestas`).join('\n')}

## Fuentes Adicionales
${additionalData.map(file => `- ${file.archivo}: ${file.registros} registros`).join('\n')}

## Análisis
${prompt}

## Conclusiones
- Se requiere un análisis más detallado
- Se recomienda revisar los datos manualmente
- Considerar la recopilación de más información`;
  };

  // Función simple para generar especificación de dashboard
  const generateDashboardContent = (formData: any[], additionalData: any[], prompt: string) => {
    return {
      layout: {
        title: "Dashboard Generado",
        description: prompt,
        widgets: [
          {
            type: "chart",
            title: "Respuestas por Formulario",
            chartType: "bar",
            data: formData
          },
          {
            type: "table",
            title: "Datos Adicionales",
            data: additionalData
          }
        ]
      }
    };
  };

  return (
    <div className="space-y-6">
      {/* ... resto del componente sin cambios ... */}
    </div>
  );
};

export default AIPromptBuilder;