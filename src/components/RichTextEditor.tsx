import React, { useEffect, useState, useRef } from 'react';
import { AlignCenter, AlignLeft, AlignRight, Bold, Code, Highlighter, Italic, Link, List, ListOrdered, Minus, Plus, Quote, Strikethrough, Underline } from 'lucide-react';

interface RichTextEditorProps {
  initialValue?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  initialValue = '',
  onChange,
  placeholder = 'Write your notes here...',
  className = '',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState(initialValue);
  const [fontSize, setFontSize] = useState(16);
  const [isEditorFocused, setIsEditorFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialValue;
    }
  }, []);

  const handleContentChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      if (onChange) {
        onChange(newContent);
      }
    }
  };

  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    handleContentChange();
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleFormat = (format: string) => {
    execCommand(format);
  };

  const handleLink = () => {
    const url = prompt('Enter the URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const handleHighlight = () => {
    execCommand('hiliteColor', 'yellow');
  };

  const handleFontSizeChange = (change: number) => {
    const newSize = Math.max(12, Math.min(24, fontSize + change));
    setFontSize(newSize);
    document.execCommand('fontSize', false, '7');
    const fontElements = document.getElementsByTagName('font');
    for (let i = 0; i < fontElements.length; i++) {
      if (fontElements[i].size === '7') {
        fontElements[i].removeAttribute('size');
        fontElements[i].style.fontSize = `${newSize}px`;
      }
    }
    handleContentChange();
  };

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      <div className="flex items-center gap-1 border-b p-2 bg-gray-50 flex-wrap">
        <div className="flex border-r pr-1 mr-1">
          <button
            type="button"
            onClick={() => handleFormat('bold')}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-700"
            title="Bold"
          >
            <Bold size={18} />
          </button>
          <button
            type="button"
            onClick={() => handleFormat('italic')}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-700"
            title="Italic"
          >
            <Italic size={18} />
          </button>
          <button
            type="button"
            onClick={() => handleFormat('underline')}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-700"
            title="Underline"
          >
            <Underline size={18} />
          </button>
          <button
            type="button"
            onClick={() => handleFormat('strikethrough')}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-700"
            title="Strikethrough"
          >
            <Strikethrough size={18} />
          </button>
          <button
            type="button"
            onClick={handleHighlight}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-700"
            title="Highlight Text"
          >
            <Highlighter size={18} />
          </button>
        </div>

        <div className="flex border-r pr-1 mr-1">
          <button
            type="button"
            onClick={() => handleFormat('insertUnorderedList')}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-700"
            title="Bullet List"
          >
            <List size={18} />
          </button>
          <button
            type="button"
            onClick={() => handleFormat('insertOrderedList')}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-700"
            title="Numbered List"
          >
            <ListOrdered size={18} />
          </button>
        </div>

        <div className="flex border-r pr-1 mr-1">
          <button
            type="button"
            onClick={() => handleFontSizeChange(-1)}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-700"
            title="Decrease Font Size"
          >
            <Minus size={18} />
          </button>
          <span className="flex items-center justify-center min-w-[2rem] text-sm text-gray-700">
            {fontSize}
          </span>
          <button
            type="button"
            onClick={() => handleFontSizeChange(1)}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-700"
            title="Increase Font Size"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="flex border-r pr-1 mr-1">
          <button
            type="button"
            onClick={handleLink}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-700"
            title="Insert Link"
          >
            <Link size={18} />
          </button>
        </div>

        <div className="flex border-r pr-1 mr-1">
          <button
            type="button"
            onClick={() => handleFormat('formatBlock', '<pre>')}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-700"
            title="Code Block"
          >
            <Code size={18} />
          </button>
          <button
            type="button"
            onClick={() => handleFormat('formatBlock', '<blockquote>')}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-700"
            title="Quote"
          >
            <Quote size={18} />
          </button>
        </div>

        <div className="flex">
          <button
            type="button"
            onClick={() => handleFormat('justifyLeft')}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-700"
            title="Align Left"
          >
            <AlignLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => handleFormat('justifyCenter')}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-700"
            title="Align Center"
          >
            <AlignCenter size={18} />
          </button>
          <button
            type="button"
            onClick={() => handleFormat('justifyRight')}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-700"
            title="Align Right"
          >
            <AlignRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={editorRef}
        contentEditable
        className="p-4 min-h-[300px] focus:outline-none"
        onInput={handleContentChange}
        onBlur={() => {
          handleContentChange();
          setIsEditorFocused(false);
        }}
        onFocus={() => setIsEditorFocused(true)}
        data-placeholder={placeholder}
        style={{ fontSize: `${fontSize}px` }}
      />
    </div>
  );
};

export default RichTextEditor;
