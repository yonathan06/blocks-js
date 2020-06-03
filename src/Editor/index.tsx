import React, { useRef, useCallback } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import InlineToolbar from './InlineToolbar';
import BlocksToolbar from './BlocksToolbar';
import 'draft-js/dist/Draft.css';
import './styles/main.css';

interface BlockJSProps {
  editorState: EditorState;
  onChange: (editorState: EditorState) => void;
}

const BlockJS = ({ editorState, onChange }: BlockJSProps) => {
  const editorRef = useRef<Editor | null>();
  const handleKeyCommand = (command: string, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };
  const handleInlineStyleAction = (editorState: EditorState, inlineStyle: string) => {
    onChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };
  const handleOnChange = useCallback(
    (editorState: EditorState) => {
      onChange(editorState);
    },
    [onChange],
  );
  return (
    <div className="editorWrapper">
      <Editor
        ref={(current) => (editorRef.current = current)}
        editorState={editorState}
        onChange={handleOnChange}
        handleKeyCommand={handleKeyCommand}
        placeholder="Start typing..."
      />
      <InlineToolbar editorState={editorState} onInlineActionClick={handleInlineStyleAction} />
      {editorRef.current && (
        <BlocksToolbar
          editorRef={editorRef.current}
          editorState={editorState}
          onBlockActionClick={() => { }}
        />
      )}
    </div>
  );
};

export default BlockJS;
