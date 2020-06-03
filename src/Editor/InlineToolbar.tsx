import React, { useRef, useMemo, useCallback } from 'react';
import { EditorState, getVisibleSelectionRect } from 'draft-js';
import BoldIcon from './Icons/Bold';
import UnderlineIcon from './Icons/Underline';
import ItalicIcon from './Icons/Italic';
import { motion } from 'framer-motion';
import styles from './styles/InlineToolbar.module.css';

interface InlineButtonProps {
  inlineStyle: string;
  onClick: (inlineStyle: string) => void;
  isActive: boolean;
}

const InlineButton: React.FunctionComponent<InlineButtonProps> = ({
  inlineStyle,
  onClick,
  children,
  isActive,
}) => {
  const handleOnClick = useCallback(
    (event) => {
      event.preventDefault();
      onClick(inlineStyle);
    },
    [onClick, inlineStyle],
  );
  return (
    <div className={styles.inlineToolbarButton} onMouseDown={(event) => event.preventDefault()}>
      <button
        className={isActive ? styles.inlineToolbarButtonActive : ''}
        type="button"
        onClick={handleOnClick}
      >
        {children}
      </button>
    </div>
  );
};

interface InlineToolbarProps {
  editorState: EditorState;
  onInlineActionClick: (editorState: EditorState, inlineStyle: string) => void;
}

const InlineToolbar = ({ editorState, onInlineActionClick }: InlineToolbarProps) => {
  const toolbarRef = useRef<HTMLDivElement | null>();
  const toolbarPosition: { left?: number; top?: number } | null = useMemo(() => {
    const selection = editorState.getSelection();
    const anchorKey = selection.getAnchorKey();
    const focusKey = selection.getFocusKey();
    const start = selection.getStartOffset();
    const end = selection.getEndOffset();
    const hasSelection = anchorKey !== focusKey ? true : start !== end;
    if (hasSelection) {
      const selectionRect = getVisibleSelectionRect(window);
      if (selectionRect) {
        return {
          top: selectionRect.bottom + 5,
          left: selectionRect.left + selectionRect.width / 2,
        };
      }
    }
    return null;
  }, [editorState]);
  return (
    <motion.div
      onClick={(event) => event.preventDefault()}
      ref={(current) => (toolbarRef.current = current)}
      className={styles.inlineToolbar}
      initial={{ display: 'none' }}
      animate={{
        display: toolbarPosition ? 'flex' : 'none',
        left: toolbarPosition ? toolbarPosition.left : 'auto',
        top: toolbarPosition ? toolbarPosition.top : 'auto',
        opacity: toolbarPosition ? 1 : 0,
      }}
      transition={{ bounceDamping: 0 }}
    >
      <InlineButton
        inlineStyle="BOLD"
        isActive={editorState.getCurrentInlineStyle().has('BOLD')}
        onClick={(inlineStyle) => onInlineActionClick(editorState, inlineStyle)}
      >
        <BoldIcon size={14} />
      </InlineButton>
      <InlineButton
        inlineStyle="ITALIC"
        isActive={editorState.getCurrentInlineStyle().has('ITALIC')}
        onClick={(inlineStyle) => onInlineActionClick(editorState, inlineStyle)}
      >
        <ItalicIcon size={20} />
      </InlineButton>
      <InlineButton
        inlineStyle="UNDERLINE"
        isActive={editorState.getCurrentInlineStyle().has('UNDERLINE')}
        onClick={(inlineStyle) => onInlineActionClick(editorState, inlineStyle)}
      >
        <UnderlineIcon size={20} />
      </InlineButton>
    </motion.div>
  );
};

export default InlineToolbar;
