import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight, Code } from 'lucide-react';

const TipTap = ({ onContentChange }) => {
  const [content, setContent] = useState('');
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.contentEditable = true;
    }
  }, []);

  const handleCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      onContentChange(newContent);
    }
  };

  const handleCodeBlock = () => {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const preElement = document.createElement('pre');
    const codeElement = document.createElement('code');
    
    codeElement.textContent = range.toString();
    preElement.appendChild(codeElement);
    range.deleteContents();
    range.insertNode(preElement);
    
    selection.removeAllRanges();
    selection.addRange(range);
    handleContentChange();
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <div className="flex space-x-2 mb-2">
        <button onClick={() => handleCommand('bold')} className="p-2 hover:bg-gray-200 rounded">
          <Bold size={20} />
        </button>
        <button onClick={() => handleCommand('italic')} className="p-2 hover:bg-gray-200 rounded">
          <Italic size={20} />
        </button>
        <button onClick={() => handleCommand('underline')} className="p-2 hover:bg-gray-200 rounded">
          <Underline size={20} />
        </button>
        <button onClick={() => handleCommand('insertUnorderedList')} className="p-2 hover:bg-gray-200 rounded">
          <List size={20} />
        </button>
        <button onClick={() => handleCommand('justifyLeft')} className="p-2 hover:bg-gray-200 rounded">
          <AlignLeft size={20} />
        </button>
        <button onClick={() => handleCommand('justifyCenter')} className="p-2 hover:bg-gray-200 rounded">
          <AlignCenter size={20} />
        </button>
        <button onClick={() => handleCommand('justifyRight')} className="p-2 hover:bg-gray-200 rounded">
          <AlignRight size={20} />
        </button>
        <button onClick={handleCodeBlock} className="p-2 hover:bg-gray-200 rounded">
          <Code size={20} />
        </button>
      </div>
      <div
        ref={editorRef}
        onInput={handleContentChange}
        className="min-h-[200px] p-2 border border-gray-200 rounded focus:outline-none focus:border-blue-500"
      />
    </div>
  );
};

export default TipTap;