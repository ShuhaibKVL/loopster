import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface TinyEditorProps {
  initialValue: string;
  onEditorChange: (content: string) => void;
}

const TinyEditor = ({ initialValue, onEditorChange }: TinyEditorProps) => {
  const editorRef = useRef<any>(null);

  const handleEditorChange = (content: string) => {
    console.log('inside the Tain Editor :',content)
    if (editorRef.current) {
      onEditorChange(content);
    }
  };

  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TAINY_DOCS_API}  // Ensure your environment variable is set up correctly
      onEditorChange={handleEditorChange}             // Update content on change
      initialValue={initialValue}                     // Set the initial value
      init={{
        height: 300,                                  // Set height if needed
        menubar: false,
        plugins: [
          'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media',
          'searchreplace', 'table', 'visualblocks', 'wordcount', 'checklist', 'mediaembed', 'casechange',
          'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 
          'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments',
          'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown',
        ],
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media',
        tinycomments_mode: 'embedded',
        tinycomments_author: 'Author name',
        ai_request: (request, respondWith: any) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
      }}
    />
  );
};

export default TinyEditor;
