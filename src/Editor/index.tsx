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
  Modifier,
} from 'draft-js';
import InlineToolbar from './InlineToolbar';
import BlocksToolbar from './BlocksToolbar';
import 'draft-js/dist/Draft.css';
import '../prism-theme.css';
import './styles/main.css';
import CodeBlock from './CodeBlock';

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
  const editorRef = useRef<Editor>(null);
  const handleOnChange = useCallback(
    (editorState: EditorState) => {
      onChange(editorState);
    },
    [onChange],
  );
  const handleKeyCommand = (command: string, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      handleOnChange(newState);
      return 'handled';
    }

    return 'not-handled';
  };
  const handleOnTab = useCallback(() => {
    const newContentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      '    ',
    );
    handleOnChange(EditorState.push(editorState, newContentState, 'insert-characters'));
    setTimeout(() => {
      editorRef.current?.focus();
    }, 0);
  }, [handleOnChange, editorState]);
  const handleInlineStyleAction = (editorState: EditorState, inlineStyle: string) => {
    handleOnChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };
  const handleBlockAction = (editorState: EditorState, blockType: DraftBlockType) => {
    const contentState = editorState.getCurrentContent();
    const blockCurrentText = contentState.getPlainText();
    if (blockCurrentText.length > 0) {
      handleOnChange(addEmptyBlock(editorState, blockType));
    } else {
      handleOnChange(RichUtils.toggleBlockType(editorState, blockType));
      setTimeout(() => {
        editorRef.current?.focus();
      }, 0);
    }
  };
  return (
    <div className="editorWrapper">
      <Editor
        ref={editorRef}
        editorState={editorState}
        onChange={handleOnChange}
        handleKeyCommand={handleKeyCommand}
        onTab={handleOnTab}
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
