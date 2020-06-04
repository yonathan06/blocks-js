import React, { useRef, useEffect, useState } from 'react';
import { EditorState, Editor } from 'draft-js';
import { motion, AnimatePresence } from 'framer-motion';
import AddIcon from './Icons/Add';
import styles from './styles/BlocksToolbar.module.css';
import HeadingIcon from './Icons/Heading';
import ListIcon from './Icons/List';
import CodeSlashIcon from './Icons/CodeSlash';
import ImageIcon from './Icons/Image';

export enum BlockType {
  HeaderOne = 'header-one',
  UnorderedList = 'unordered-list-item',
  CodeBlock = 'code-block',
  Image = 'image',
}

interface BlockButtonProps {
  index: number;
  blockType: BlockType;
  onClick: (blockType: BlockType) => void;
}

const BlockButtonIcon = ({ blockType }: { blockType: BlockType }) => {
  switch (blockType) {
    case BlockType.HeaderOne:
      return <HeadingIcon />;
    case BlockType.UnorderedList:
      return <ListIcon />;
    case BlockType.CodeBlock:
      return <CodeSlashIcon />;
    case BlockType.Image:
      return <ImageIcon />;
    default:
      return <span></span>;
  }
};

const BlockButton: React.FunctionComponent<BlockButtonProps> = ({
  index,
  blockType,
  onClick,
  children,
}) => {
  return (
    <motion.button
      onClick={() => onClick(blockType)}
      role="button"
      initial={{ x: 10, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 10, opacity: 0 }}
      transition={{ delay: index * 0.05, bounceDamping: 0 }}
    >
      {children}
    </motion.button>
  );
};

interface BlocksToolbarProps {
  editorRef: Editor;
  editorState: EditorState;
  onBlockActionClick: (editorState: EditorState, blockType: BlockType) => void;
}

const BlocksToolbar = ({
  editorRef,
  editorState,
  onBlockActionClick,
}: BlocksToolbarProps): JSX.Element => {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
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
        setTop(anchorDiv.getBoundingClientRect().top + anchorDiv.offsetHeight / 2);
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
      <motion.button
        variants={{ closed: { rotate: 0 }, open: { rotate: 45 } }}
        animate={isOpen ? 'open' : 'closed'}
        className="plus-button"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setIsOpen(false)}
      >
        <AddIcon size={34} />
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <div className={styles.blockButtons}>
            {Object.entries(BlockType).map(([key, value], index) => (
              <BlockButton
                key={key}
                blockType={value}
                index={index}
                onClick={(blockType) => onBlockActionClick(editorState, blockType)}
              >
                <BlockButtonIcon blockType={value} />
              </BlockButton>
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BlocksToolbar;
