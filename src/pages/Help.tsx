import React, { useState } from 'react';
import { Book, Search, Edit2, Save, Plus, Trash2 } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useHelpStore } from '../stores/helpStore';
import HelpEditor from '../components/help/HelpEditor';
import { useNotifications } from '../components/notifications/NotificationProvider';

const Help = () => {
  const { user } = useAuthStore();
  const { menus, sections, isEditing, setEditing, addMenu, updateMenu, deleteMenu, addSection, updateSection, deleteSection } = useHelpStore();
  const { showNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [newMenuTitle, setNewMenuTitle] = useState('');
  const [newSectionTitle, setNewSectionTitle] = useState('');

  const filteredMenus = menus.filter(menu => 
    !searchTerm || menu.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSections = sections.filter(section =>
    !searchTerm || section.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMenu = () => {
    if (!newMenuTitle.trim()) {
      showNotification('error', 'El título del menú es obligatorio');
      return;
    }

    addMenu({
      title: newMenuTitle,
      order: menus.length,
      sections: [],
      role: user?.role || null
    });

    setNewMenuTitle('');
    showNotification('success', 'Menú creado correctamente');
  };

  const handleDeleteMenu = (menuId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este menú?')) {
      deleteMenu(menuId);
      if (selectedMenu === menuId) {
        setSelectedMenu(null);
        setSelectedSection(null);
      }
      showNotification('success', 'Menú eliminado correctamente');
    }
  };

  const handleAddSection = () => {
    if (!selectedMenu) {
      showNotification('error', 'Debes seleccionar un menú');
      return;
    }

    if (!newSectionTitle.trim()) {
      showNotification('error', 'El título de la sección es obligatorio');
      return;
    }

    addSection({
      title: newSectionTitle,
      content: '',
      order: sections.filter(s => s.parentId === selectedMenu).length,
      parentId: selectedMenu,
      role: user?.role || null
    });

    setNewSectionTitle('');
    showNotification('success', 'Sección creada correctamente');
  };

  const handleDeleteSection = (sectionId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta sección?')) {
      deleteSection(sectionId);
      if (selectedSection === sectionId) {
        setSelectedSection(null);
      }
      showNotification('success', 'Sección eliminada correctamente');
    }
  };

  const handleUpdateSection = (sectionId: string, content: string) => {
    updateSection(sectionId, { content });
  };

  return (
    <div className="flex h-[calc(100vh-10rem)]">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <Book className="h-5 w-5 text-blue-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Ayuda</h2>
          </div>
          {user?.role === 'coordinador_general' && (
            <button
              onClick={() => setEditing(!isEditing)}
              className={`p-2 rounded-lg ${
                isEditing ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
              title={isEditing ? 'Guardar cambios' : 'Editar contenido'}
            >
              {isEditing ? <Save className="h-5 w-5" /> : <Edit2 className="h-5 w-5" />}
            </button>
          )}
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isEditing && (
            <div className="mb-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMenuTitle}
                  onChange={(e) => setNewMenuTitle(e.target.value)}
                  placeholder="Nuevo menú..."
                  className="flex-1 px-3 py-1 border rounded"
                />
                <button
                  onClick={handleAddMenu}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {filteredMenus.map((menu) => (
            <div key={menu.id} className="mb-4">
              <div 
                className="flex items-center justify-between mb-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                onClick={() => setSelectedMenu(menu.id)}
              >
                <h3 className="font-medium text-gray-900">{menu.title}</h3>
                {isEditing && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMenu(menu.id);
                    }}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              {filteredSections
                .filter((section) => section.parentId === menu.id)
                .map((section) => (
                  <div
                    key={section.id}
                    onClick={() => setSelectedSection(section.id)}
                    className={`group flex items-center justify-between w-full text-left px-4 py-2 rounded-lg text-sm ${
                      selectedSection === section.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span>{section.title}</span>
                    {isEditing && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSection(section.id);
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}

              {isEditing && selectedMenu === menu.id && (
                <div className="mt-2 pl-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newSectionTitle}
                      onChange={(e) => setNewSectionTitle(e.target.value)}
                      placeholder="Nueva sección..."
                      className="flex-1 px-3 py-1 border rounded text-sm"
                    />
                    <button
                      onClick={handleAddSection}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {selectedSection ? (
          <div className="max-w-3xl mx-auto">
            {isEditing ? (
              <HelpEditor
                content={sections.find(s => s.id === selectedSection)?.content || ''}
                onChange={(content) => handleUpdateSection(selectedSection, content)}
              />
            ) : (
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: sections.find(s => s.id === selectedSection)?.content || ''
                }}
              />
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-10">
            <Book className="h-12 w-12 mx-auto mb-4" />
            <p>Selecciona una sección para ver su contenido</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Help;