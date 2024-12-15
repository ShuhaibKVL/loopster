import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight, Code } from 'lucide-react';


const TipTap = ({ initialContent ='', onContentChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.contentEditable = true;
      editorRef.current.innerHTML = initialContent;
    }
  }, [initialContent]);

  const handleCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      onContentChange(newContent);
    }
  };

  const handleCodeBlock = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
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
    <div className="border border-gray-300 rounded-lg sm:p-1 p-4">
      <div className="flex flex-wrap justify-center items-center space-x-2 mb-2">
        <div className='flex items-center'>
          <button onClick={() => handleCommand('bold')} className="p-2 hover:bg-gray-200 rounded">
            <Bold className='size-3 sm:size-5 lg:size-5'  />
          </button>
          <button onClick={() => handleCommand('italic')} className="p-2 hover:bg-gray-200 rounded">
            <Italic className='size-3 sm:size-5 lg:size-5' />
          </button>
          <button onClick={() => handleCommand('underline')} className="p-2 hover:bg-gray-200 rounded">
            <Underline className='size-3 sm:size-5 lg:size-5' />
          </button>
          <button onClick={() => handleCommand('insertUnorderedList')} className="p-2 hover:bg-gray-200 rounded">
            <List className='size-3 sm:size-5 lg:size-5' />
          </button>
        </div>
        <div className='flex items-center'>
          <button onClick={() => handleCommand('justifyLeft')} className="p-2 hover:bg-gray-200 rounded">
            <AlignLeft className='size-3 sm:size-5 lg:size-5' />
          </button>
          <button onClick={() => handleCommand('justifyCenter')} className="p-2 hover:bg-gray-200 rounded">
            <AlignCenter className='size-3 sm:size-5 lg:size-5' />
          </button>
          <button onClick={() => handleCommand('justifyRight')} className="p-2 hover:bg-gray-200 rounded">
            <AlignRight className='size-3 sm:size-5 lg:size-5' />
          </button>
          <button onClick={handleCodeBlock} className="p-2 hover:bg-gray-200 rounded">
            <Code className='size-3 sm:size-5 lg:size-5' />
          </button>
        </div>
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