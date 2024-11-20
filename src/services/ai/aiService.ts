import { useSettingsStore } from '../../stores/settingsStore';

export interface AIAnalysisResult {
  summary: string;
  tags: string[];
  content: string;
}

// Función simple para extraer palabras clave del texto
const extractKeywords = (text: string): string[] => {
  const commonWords = new Set(['de', 'la', 'el', 'en', 'y', 'a', 'los', 'las', 'un', 'una']);
  const words = text.toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word));
  
  return Array.from(new Set(words)).slice(0, 5);
};

// Función para generar un resumen del texto
const generateSummary = (text: string, maxLength: number = 200): string => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  let summary = '';
  let currentLength = 0;

  for (const sentence of sentences) {
    if (currentLength + sentence.length > maxLength) break;
    summary += sentence.trim() + '. ';
    currentLength += sentence.length;
  }

  return summary.trim();
};

// Función para analizar el contenido
export const analyzeContent = async (
  title: string,
  description: string,
  type: string
): Promise<AIAnalysisResult> => {
  const { settings } = useSettingsStore.getState();

  if (!settings.observatory?.aiEnabled) {
    throw new Error('El servicio de IA no está habilitado');
  }

  try {
    // Extraer palabras clave del título y descripción
    const titleKeywords = extractKeywords(title);
    const descriptionKeywords = extractKeywords(description);
    const allKeywords = [...new Set([...titleKeywords, ...descriptionKeywords])];

    // Generar tags basados en el tipo y palabras clave
    const tags = [
      type,
      'Innovación',
      'FP',
      ...allKeywords.slice(0, 2)
    ];

    // Generar resumen
    const summary = generateSummary(description);

    // Generar contenido enriquecido
    const content = `
# ${title}

## Resumen
${summary}

## Análisis
Este contenido está relacionado con ${type} en FP.
Las principales palabras clave identificadas son: ${allKeywords.join(', ')}.

## Impacto Potencial
Esta innovación podría tener impacto en las siguientes áreas:
${allKeywords.map(kw => `- ${kw.charAt(0).toUpperCase() + kw.slice(1)}`).join('\n')}

## Recomendaciones
- Compartir esta experiencia con otros centros
- Documentar resultados y métricas
- Considerar su aplicación en otros contextos
`;

    return {
      summary,
      tags,
      content: content.trim()
    };
  } catch (error) {
    console.error('Error en análisis de IA:', error);
    // Fallback a análisis simple si falla
    return {
      summary: description.substring(0, 200) + '...',
      tags: ['Innovación', 'FP', type],
      content: `Análisis automático de: ${title}\n${description}`
    };
  }
};