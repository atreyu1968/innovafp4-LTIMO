import React, { useState } from 'react';
import { useObservatoryStore } from '../stores/observatoryStore';
import { useNetworkStore } from '../stores/networkStore';
import { useUserStore } from '../stores/userStore';
import { ExternalLink, Search, Filter, Calendar, User, Tag, Lightbulb } from 'lucide-react';
import { ObservationType } from '../types/observatory';

const ObservatoryBlog = () => {
  const { entries } = useObservatoryStore();
  const { subnets } = useNetworkStore();
  const { users } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<ObservationType | ''>('');
  const [selectedSubnet, setSelectedSubnet] = useState('');

  // Obtener solo las entradas publicadas
  const publishedEntries = entries
    .filter(entry => {
      const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          entry.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !selectedType || entry.type === selectedType;
      const matchesSubnet = !selectedSubnet || entry.subnetId === selectedSubnet;
      return entry.status === 'published' && matchesSearch && matchesType && matchesSubnet;
    })
    .sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime());

  const typeColors = {
    methodology: { bg: 'bg-blue-100', text: 'text-blue-800', icon: 'bg-blue-500' },
    technology: { bg: 'bg-green-100', text: 'text-green-800', icon: 'bg-green-500' },
    pedagogy: { bg: 'bg-purple-100', text: 'text-purple-800', icon: 'bg-purple-500' },
    business: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: 'bg-yellow-500' },
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Observatorio de Innovación</h2>
        <p className="text-lg text-gray-600">
          Descubre las últimas innovaciones y mejores prácticas en Formación Profesional
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar innovaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as ObservationType | '')}
            className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Todos los tipos</option>
            <option value="methodology">Metodología</option>
            <option value="technology">Tecnología</option>
            <option value="pedagogy">Pedagogía</option>
            <option value="business">FP-Empresas</option>
          </select>

          <select
            value={selectedSubnet}
            onChange={(e) => setSelectedSubnet(e.target.value)}
            className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Todas las subredes</option>
            {subnets.map((subnet) => (
              <option key={subnet.id} value={subnet.id}>{subnet.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de entradas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {publishedEntries.map((entry) => {
          const subnet = subnets.find(s => s.id === entry.subnetId);
          const author = users.find(u => u.id === entry.createdBy);
          const colors = typeColors[entry.type];

          return (
            <article
              key={entry.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100"
            >
              {/* Cabecera con icono */}
              <div className={`h-2 ${colors.bg}`} />
              
              <div className="p-6">
                {/* Tipo y fecha */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}>
                    <Lightbulb className="h-4 w-4 mr-1" />
                    {entry.type === 'methodology' ? 'Metodología' :
                     entry.type === 'technology' ? 'Tecnología' :
                     entry.type === 'pedagogy' ? 'Pedagogía' :
                     'FP-Empresas'}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(entry.publishedAt!).toLocaleDateString()}
                  </div>
                </div>

                {/* Título y descripción */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                  {entry.title}
                </h3>

                {entry.aiSummary ? (
                  <p className="text-gray-600 mb-4 line-clamp-3">{entry.aiSummary}</p>
                ) : (
                  <p className="text-gray-600 mb-4 line-clamp-3">{entry.description}</p>
                )}

                {/* Autor y subred */}
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center text-sm">
                    <div className="flex items-center text-gray-600">
                      <User className="h-4 w-4 mr-1" />
                      <span>{author?.nombre}</span>
                    </div>
                    <span className="mx-2 text-gray-300">·</span>
                    <div className="text-gray-600">
                      {subnet?.name}
                    </div>
                  </div>
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-500"
                  >
                    Leer más
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </div>

                {/* Tags */}
                {entry.aiTags && entry.aiTags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {entry.aiTags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {publishedEntries.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            No hay entradas publicadas en el observatorio
          </p>
        </div>
      )}
    </div>
  );
};

export default ObservatoryBlog;