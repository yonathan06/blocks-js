import React, { useRef, useEffect, useState } from 'react';
import { EditorState, Editor } from 'draft-js';
import { motion } from 'framer-motion';
import AddIcon from './Icons/Add';
import styles from './styles/BlocksToolbar.module.css';

interface BlocksToolbarProps {
  editorRef: Editor;
  editorState: EditorState;
  onBlockActionClick: (editorState: EditorState, inlineStyle: string) => void;
}

const BlocksToolbar = ({ editorRef, editorState, onBlockActionClick }: BlocksToolbarProps) => {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  useEffect(() => {
    const selection = editorState.getSelection();
    const anchorKey = selection.getAnchorKey();
    setTimeout(() => {
      const anchorDiv = document.querySelector(
        `[data-offset-key="${anchorKey}-0-0"]`,
      ) as HTMLDivElement;
      if (anchorDiv && toolbarRef.current) {
        setTop(anchorDiv.getBoundingClientRect().top - toolbarRef.current.offsetHeight / 4);
      }
    }, 100);
    if (toolbarRef.current) {
      const editorContainer = (editorRef as any)['editor'] as HTMLDivElement;
      setLeft(editorContainer.getBoundingClientRect().left - toolbarRef.current.offsetWidth - 10);
    }
  }, [editorRef, editorState]);
  return (
    <motion.div
      ref={toolbarRef}
      className={styles.blocksToolbar}
      onClick={(event) => event.preventDefault()}
      animate={{
        left: left,
        top: top,
      }}
      transition={{ bounceDamping: 0 }}
    >
      <button className="plus-button">
        <AddIcon size={34} />
      </button>
    </motion.div>
  );
};

export default BlocksToolbar;
