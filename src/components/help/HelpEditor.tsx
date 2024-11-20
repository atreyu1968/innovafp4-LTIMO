import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import CodeBlock from '@tiptap/extension-code-block';
import Heading from '@tiptap/extension-heading';
import { 
  Bold, Italic, Link as LinkIcon, Image as ImageIcon, List, 
  ListOrdered, Code, Heading1, Heading2, Heading3, Video,
  X, Check, ExternalLink
} from 'lucide-react';

interface MediaDialogProps {
  type: 'image' | 'video' | 'link';
  onClose: () => void;
  onConfirm: (url: string, title?: string) => void;
}

const MediaDialog: React.FC<MediaDialogProps> = ({ type, onClose, onConfirm }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-medium">
            {type === 'image' ? 'Insertar imagen' : 
             type === 'video' ? 'Insertar video' : 
             'Insertar enlace'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">URL</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                {type === 'image' && <ImageIcon className="h-4 w-4" />}
                {type === 'video' && <Video className="h-4 w-4" />}
                {type === 'link' && <ExternalLink className="h-4 w-4" />}
              </span>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={
                  type === 'image' ? 'https://ejemplo.com/imagen.jpg' :
                  type === 'video' ? 'https://youtube.com/watch?v=...' :
                  'https://ejemplo.com'
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {type === 'link' ? 'Texto del enlace' : 'Título'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder={
                type === 'link' ? 'Texto a mostrar' :
                'Descripción de la imagen'
              }
            />
          </div>

          {type === 'image' && url && (
            <div className="mt-2 border rounded-lg p-2">
              <img
                src={url}
                alt="Preview"
                className="max-h-40 mx-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error+de+carga';
                }}
              />
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(url, title)}
            disabled={!url.trim()}
            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <Check className="h-4 w-4 mr-2 inline-block" />
            Insertar
          </button>
        </div>
      </div>
    </div>
  );
};

interface HelpEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const HelpEditor: React.FC<HelpEditorProps> = ({ content, onChange }) => {
  const [showDialog, setShowDialog] = useState<'image' | 'video' | 'link' | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full',
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'bg-gray-800 text-white p-4 rounded-lg font-mono text-sm',
        },
      }),
      Heading.configure({
        levels: [1, 2, 3],
        HTMLAttributes: {
          class: 'font-bold',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const MenuButton = ({ onClick, active, children, title }: any) => (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg ${
        active ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
      }`}
      title={title}
    >
      {children}
    </button>
  );

  const handleMediaConfirm = (url: string, title?: string) => {
    if (showDialog === 'image') {
      editor.chain().focus().setImage({ src: url, alt: title }).run();
    } else if (showDialog === 'video') {
      // Insertar iframe de video
      editor.chain().focus().insertContent(`
        <div class="video-wrapper">
          <iframe 
            src="${url}" 
            title="${title || 'Video'}"
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
            class="w-full aspect-video rounded-lg"
          ></iframe>
        </div>
      `).run();
    } else if (showDialog === 'link') {
      editor.chain().focus().setLink({ href: url, target: '_blank' }).run();
    }
    setShowDialog(null);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-white border-b p-2 flex flex-wrap items-center gap-1">
        <div className="flex items-center space-x-1">
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            active={editor.isActive('heading', { level: 1 })}
            title="Título 1"
          >
            <Heading1 className="h-5 w-5" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive('heading', { level: 2 })}
            title="Título 2"
          >
            <Heading2 className="h-5 w-5" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive('heading', { level: 3 })}
            title="Título 3"
          >
            <Heading3 className="h-5 w-5" />
          </MenuButton>
        </div>

        <div className="w-px h-6 bg-gray-200 mx-2" />

        <div className="flex items-center space-x-1">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            title="Negrita"
          >
            <Bold className="h-5 w-5" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            title="Cursiva"
          >
            <Italic className="h-5 w-5" />
          </MenuButton>
        </div>

        <div className="w-px h-6 bg-gray-200 mx-2" />

        <div className="flex items-center space-x-1">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
            title="Lista"
          >
            <List className="h-5 w-5" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
            title="Lista numerada"
          >
            <ListOrdered className="h-5 w-5" />
          </MenuButton>
        </div>

        <div className="w-px h-6 bg-gray-200 mx-2" />

        <div className="flex items-center space-x-1">
          <MenuButton
            onClick={() => setShowDialog('link')}
            active={editor.isActive('link')}
            title="Insertar enlace"
          >
            <LinkIcon className="h-5 w-5" />
          </MenuButton>
          <MenuButton
            onClick={() => setShowDialog('image')}
            title="Insertar imagen"
          >
            <ImageIcon className="h-5 w-5" />
          </MenuButton>
          <MenuButton
            onClick={() => setShowDialog('video')}
            title="Insertar video"
          >
            <Video className="h-5 w-5" />
          </MenuButton>
        </div>

        <div className="w-px h-6 bg-gray-200 mx-2" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
          title="Bloque de código"
        >
          <Code className="h-5 w-5" />
        </MenuButton>
      </div>

      <EditorContent 
        editor={editor} 
        className="prose max-w-none p-4 min-h-[400px] focus:outline-none"
      />

      {showDialog && (
        <MediaDialog
          type={showDialog}
          onClose={() => setShowDialog(null)}
          onConfirm={handleMediaConfirm}
        />
      )}
    </div>
  );
};

export default HelpEditor;