import React, { useState, useEffect, useRef } from 'react';
import { message, Input, Card, Layout, Spin } from 'antd';
import styles from './index.less';
import { Editor } from '@tinymce/tinymce-react';
import TopTabs from './TopTabs';
import NoteTree from './NoteTree';
import OpenNotes from './OpenNotes';
import { useModel } from 'umi';

const { Sider, Content } = Layout;

const NoteList: React.FC<{}> = () => {

  const nameInput = useRef();
  const editor = useRef();

  const { queryOpenedNotes, showOpenNotes, onTabChange, setTreeData, treeData, noteData,
    showNote, setShowNote, noteLoading, treeLoading, editNote, loadNote, setSearchValue, tabId } =
    useModel('note', ({ queryOpenedNotes, showOpenNotes, onTabChange, setTreeData, treeData, noteData,
      showNote, setShowNote, noteLoading, treeLoading, editNote, loadNote, setSearchValue, tabId }) =>
      ({
        queryOpenedNotes, showOpenNotes, onTabChange, setTreeData, treeData, noteData,
        showNote, setShowNote, noteLoading, treeLoading, editNote, loadNote, setSearchValue, tabId
      }));

  useEffect(() => {
    queryOpenedNotes();
  }, []);

  const handleNameChange = (e) => {
    setShowNote({ ...showNote, name: e.target.value });
  };

  const handleTextChange = (e) => {
    const text = window.tinymce.activeEditor.getContent();
    const newNote = {...showNote,text};
    newNote.id===showNote.id&&setShowNote(newNote);
    editNote(newNote);
  };

  const addRootNote = () => {
    const newNote = { parentId: tabId, name: '新文档', text: ' ' };
    nameInput.current.focus();
    setShowNote(newNote);
  };

  const addNote = () => {
    let newNote = {};
    if (showNote && showNote.id) {
      newNote = { parentId: showNote.id, name: '新文档', text: ' ' };
    } else {
      message.error('请先选择一个笔记本');
      return;
    }
    nameInput.current.focus();
    setShowNote(newNote);
  };

  const render = function () {
    return (
      <div className={styles.out}>
        <TopTabs
          onTabChange={(id) => {
            setSearchValue('');
            onTabChange(id);
          }}
        >
          <Layout className={styles.layout}>
            <Sider className={styles.openNotes} width={300} style={{ display: showOpenNotes ? 'inline-block' : 'none' }}>
              <OpenNotes />
            </Sider>
            <Sider className={styles.noteTree} width={300} style={{ display: showOpenNotes ? 'none' : 'inline-block' }}>
              <NoteTree addRootNote={addRootNote} addNote={addNote}></NoteTree>
            </Sider>
            <Content className={styles.content}>
                <Spin spinning={noteLoading}>
                  <Input
                    ref={nameInput}
                    value={showNote.name}
                    onChange={handleNameChange}
                    onBlur={editNote}
                  ></Input>
                  <div className={styles.text}>
                    <Editor
                      ref={editor}
                      value={showNote.text}
                      onBlur={handleTextChange}
                      init={{
                        height: '100vh',
                        plugins: 'table,code,lists,advlist',
                        toolbar: 'code | bold italic h2 h3 blockquote forecolor backcolor | bullist numlist | link image',
                        toolbar_sticky: true,
                        menubar: false,
                        branding: false,
                      }}
                    />
                  </div>
                </Spin>
            </Content>
          </Layout>
        </TopTabs>
      </div>
    );
  };
  return render();
};

export default NoteList;
