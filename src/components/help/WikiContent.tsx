import React from 'react';
import { UserRole } from '../../types/user';
import { 
  Book, FileText, Users, BarChart3, Settings, Network, BookOpen, Mail, 
  Layout, Video, Eye, Sparkle, Calendar, Shield, Lock, CheckCircle, 
  AlertTriangle, Info, Star, Zap, Target, Lightbulb, Rocket
} from 'lucide-react';

interface WikiContentProps {
  role?: UserRole;
  searchQuery: string;
}

const roleSpecificContent = {
  gestor: {
    title: 'Guía del Gestor',
    sections: [
      {
        id: 'inicio',
        title: 'Panel de Control',
        icon: Layout,
        content: `
### Panel de Control del Gestor

Como gestor, tienes acceso a las siguientes funcionalidades:

#### Formularios
- Ver y responder formularios asignados
- Guardar borradores de respuestas
- Modificar respuestas enviadas (si está permitido)
- Ver histórico de respuestas propias

#### Videoconferencias
- Participar en reuniones programadas
- Ver calendario de reuniones
- Programar reuniones (si tienes permiso)

#### Mensajes
- Enviar y recibir mensajes internos
- Gestionar conversaciones
- Recibir notificaciones

#### Observatorio de Innovación
- Consultar entradas publicadas
- Añadir nuevas observaciones
- Compartir recursos innovadores

#### Permisos y Restricciones
- Acceso limitado a tu centro educativo
- Sin acceso a configuración general
- Sin acceso a gestión de usuarios
`
      }
    ]
  },
  coordinador_subred: {
    title: 'Guía del Coordinador de Subred',
    sections: [
      {
        id: 'gestion-subred',
        title: 'Gestión de Subred',
        icon: Network,
        content: `
### Gestión de Subred

Como coordinador de subred, tienes acceso a:

#### Gestión de Red
- Supervisión de centros asignados
- Coordinación entre centros
- Gestión de participantes de la subred

#### Formularios y Datos
- Crear y gestionar formularios
- Revisar respuestas de la subred
- Generar informes de subred
- Exportar datos para análisis

#### Videoconferencias
- Programar reuniones de subred
- Gestionar participantes
- Coordinar sesiones formativas

#### Observatorio
- Moderar entradas de la subred
- Aprobar publicaciones
- Gestionar contenido innovador

#### Dashboards
- Ver estadísticas de la subred
- Crear visualizaciones personalizadas
- Compartir dashboards con la red

#### Permisos y Accesos
- Gestión completa de la subred
- Acceso a datos agregados
- Sin acceso a configuración general
`
      }
    ]
  },
  coordinador_general: {
    title: 'Guía del Coordinador General',
    sections: [
      {
        id: 'administracion',
        title: 'Administración del Sistema',
        icon: Shield,
        content: `
### Administración General

Como coordinador general, tienes acceso total al sistema:

#### Gestión de Cursos Académicos
- Crear nuevos cursos
- Activar/desactivar períodos
- Gestionar transiciones entre cursos
- Configurar modos de consulta

#### Configuración del Sistema
- Personalización de la plataforma
- Gestión de seguridad
- Configuración de correo
- Gestión de backups
- Actualizaciones del sistema

#### Gestión de Red
- Crear y gestionar subredes
- Asignar coordinadores
- Supervisar toda la red
- Gestionar centros educativos

#### Permisos y Roles
- Gestión completa de usuarios
- Asignación de roles
- Configuración de permisos
- Control de acceso

#### Formularios y Datos
- Gestión global de formularios
- Acceso a todas las respuestas
- Generación de informes globales
- Exportación de datos

#### Observatorio e IA
- Configuración del observatorio
- Gestión de contenidos
- Moderación global
- Configuración de IA

#### Videoconferencias
- Configuración del servicio
- Gestión de permisos
- Control de grabaciones
- Límites y restricciones

#### Mantenimiento
- Modo mantenimiento
- Copias de seguridad
- Actualizaciones
- Monitorización del sistema
`
      }
    ]
  }
};

const commonSections = [
  {
    id: 'formularios',
    title: 'Gestión de Formularios',
    icon: FileText,
    content: `
### Gestión de Formularios

#### Permisos por Rol

**Gestor**
- Ver formularios asignados
- Responder formularios
- Guardar borradores
- Ver respuestas propias

**Coordinador de Subred**
- Crear formularios para su subred
- Ver todas las respuestas de su subred
- Exportar datos
- Generar informes

**Coordinador General**
- Gestión completa de formularios
- Acceso a todas las respuestas
- Plantillas y configuración
- Informes globales

#### Funcionalidades Principales

1. **Creación de Formularios**
   - Editor visual intuitivo
   - Múltiples tipos de campos
   - Lógica condicional
   - Validaciones personalizadas

2. **Gestión de Respuestas**
   - Guardado automático
   - Modificación posterior
   - Exportación de datos
   - Análisis estadístico

3. **Informes y Análisis**
   - Generación automática
   - Plantillas personalizables
   - Gráficos y visualizaciones
   - Exportación en múltiples formatos
`
  },
  {
    id: 'dashboards',
    title: 'Dashboards y Visualizaciones',
    icon: BarChart3,
    content: `
### Dashboards y Visualizaciones

#### Permisos por Rol

**Gestor**
- Ver dashboards compartidos
- Filtrar datos propios
- Exportar visualizaciones

**Coordinador de Subred**
- Crear dashboards de subred
- Compartir con centros
- Análisis de tendencias
- Exportación de datos

**Coordinador General**
- Gestión completa de dashboards
- Análisis global de datos
- Configuración de permisos
- Plantillas y temas

#### Tipos de Widgets

1. **Tablas**
   - Ordenación y filtrado
   - Exportación a Excel
   - Paginación dinámica

2. **Gráficos**
   - Barras y columnas
   - Líneas y áreas
   - Circulares y radar
   - Personalización completa

3. **KPIs**
   - Indicadores clave
   - Comparativas
   - Tendencias
   - Alertas

4. **Filtros**
   - Filtros globales
   - Filtros por widget
   - Filtros enlazados
   - Guardado de preferencias
`
  },
  {
    id: 'observatorio',
    title: 'Observatorio e IA',
    icon: Eye,
    content: `
### Observatorio e Innovación

#### Permisos por Rol

**Gestor**
- Añadir observaciones
- Ver contenido publicado
- Compartir recursos
- Recibir notificaciones

**Coordinador de Subred**
- Moderar contenido de subred
- Aprobar publicaciones
- Gestionar categorías
- Análisis de tendencias

**Coordinador General**
- Configuración global
- Gestión de categorías
- Moderación general
- Análisis de impacto

#### Funcionalidades

1. **Gestión de Contenido**
   - Publicación de innovaciones
   - Categorización automática
   - Etiquetado inteligente
   - Control de calidad

2. **Análisis y Tendencias**
   - Detección de patrones
   - Análisis de impacto
   - Recomendaciones
   - Informes automáticos

3. **Colaboración**
   - Comentarios y discusiones
   - Compartir recursos
   - Networking
   - Mejores prácticas
`
  },
  {
    id: 'reuniones',
    title: 'Videoconferencias',
    icon: Video,
    content: `
### Sistema de Videoconferencias

#### Permisos por Rol

**Gestor**
- Participar en reuniones
- Ver calendario
- Confirmar asistencia
- Acceder a grabaciones

**Coordinador de Subred**
- Programar reuniones
- Gestionar participantes
- Moderar sesiones
- Grabar reuniones

**Coordinador General**
- Configuración del servicio
- Gestión de permisos
- Control de grabaciones
- Estadísticas de uso

#### Funcionalidades

1. **Programación**
   - Calendario integrado
   - Invitaciones automáticas
   - Recordatorios
   - Gestión de asistencia

2. **Durante la Reunión**
   - Compartir pantalla
   - Chat integrado
   - Control de participantes
   - Grabación opcional

3. **Después de la Reunión**
   - Acceso a grabaciones
   - Transcripciones
   - Seguimiento de acuerdos
   - Estadísticas
`
  }
];

const WikiContent: React.FC<WikiContentProps> = ({ role, searchQuery }) => {
  const content = role ? roleSpecificContent[role] : null;
  if (!content) return null;

  const allSections = [...content.sections, ...commonSections];
  const filteredSections = allSections.filter(
    (section) =>
      !searchQuery ||
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="flex items-center">
          <Book className="h-8 w-8 text-white mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-white">
              {content.title}
            </h2>
            <p className="mt-1 text-sm text-blue-100">
              Guía completa de uso y configuración
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4">
        {filteredSections.map((section) => (
          <div 
            key={section.id} 
            id={section.id} 
            className="mb-12 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            {/* Section Header */}
            <div className="bg-gradient-to-r from-gray-50 to-white p-4 border-b border-gray-100">
              <div className="flex items-center">
                {section.icon && (
                  <div className="p-2 bg-blue-50 rounded-lg mr-3">
                    <section.icon className="h-6 w-6 text-blue-600" />
                  </div>
                )}
                <h3 className="text-xl font-semibold text-gray-900">
                  {section.title}
                </h3>
              </div>
            </div>

            {/* Section Content */}
            <div className="p-6">
              <div className="prose max-w-none">
                {section.content.split('\n').map((line, index) => {
                  if (line.startsWith('### ')) {
                    return (
                      <h3 key={index} className="text-2xl font-bold text-gray-900 mb-6">
                        {line.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (line.startsWith('#### ')) {
                    return (
                      <h4 key={index} className="text-xl font-semibold text-gray-800 mt-8 mb-4">
                        {line.replace('#### ', '')}
                      </h4>
                    );
                  }
                  if (line.startsWith('- ')) {
                    return (
                      <li key={index} className="text-gray-700 ml-4">
                        {line.replace('- ', '')}
                      </li>
                    );
                  }
                  if (line.match(/^\d+\./)) {
                    return (
                      <div key={index} className="ml-4 mb-2 text-gray-700">
                        {line}
                      </div>
                    );
                  }
                  return line ? (
                    <p key={index} className="text-gray-700 mb-4">
                      {line}
                    </p>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Navigation */}
      <div className="fixed bottom-8 right-8">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <Rocket className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default WikiContent;