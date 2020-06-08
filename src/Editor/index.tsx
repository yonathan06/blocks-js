import React, { useRef, useCallback } from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  DraftBlockType,
  ContentBlock,
  genKey,
  ContentState,
  SelectionState,
} from 'draft-js';
import InlineToolbar from './InlineToolbar';
import BlocksToolbar from './BlocksToolbar';
import 'draft-js/dist/Draft.css';
import './styles/main.css';

interface BlockJSProps {
  editorState: EditorState;
  onChange: (editorState: EditorState) => void;
}

const addEmptyBlock = (editorState: EditorState, type: string) => {
  const newBlock = new ContentBlock({
    key: genKey(),
    type,
    text: '',
  });

  const contentState = editorState.getCurrentContent();
  const newBlockMap = contentState.getBlockMap().set(newBlock.getKey(), newBlock);
  const newContentState = ContentState.createFromBlockArray(newBlockMap.toArray());
  const newSelectionState = new SelectionState({
    anchorKey: newBlock.getKey(),
    focusKey: newBlock.getKey(),
  });
  return EditorState.forceSelection(
    EditorState.push(editorState, newContentState, 'insert-fragment'),
    newSelectionState,
  );
};

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
  const handleBlockAction = (editorState: EditorState, blockType: DraftBlockType) => {
    const contentState = editorState.getCurrentContent();
    const blockCurrentText = contentState.getPlainText();
    if (blockCurrentText.length > 0) {
      onChange(addEmptyBlock(editorState, blockType));
    } else {
      onChange(RichUtils.toggleBlockType(editorState, blockType));
      setTimeout(() => {
        editorRef.current?.focus();
      }, 0);
    }
  };
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
          onBlockActionClick={handleBlockAction}
        />
      )}
    </div>
  );
};

export default BlockJS;
