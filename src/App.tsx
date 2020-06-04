import React, { useState } from 'react';
import { EditorState } from 'draft-js';
import Editor from './Editor';

function App() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  return (
    <div style={{ maxWidth: '650px', margin: '60px auto', padding: '1rem' }}>
      <h1 style={{ marginBottom: 34 }}>Blocks JS</h1>
      <Editor editorState={editorState} onChange={setEditorState} />
    </div>
  );
}

export default App;
