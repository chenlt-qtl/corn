import React, { useState, useEffect, useRef } from 'react';
import { Tree, Input, Card, Layout, Spin } from 'antd';
import styles from './index.less';
import { Editor } from '@tinymce/tinymce-react';
import TopTabs from './TopTabs';
import NoteTree from './NoteTree';
import OpenNotes from './OpenNotes';
import { useModel } from 'umi';
import { keys } from 'lodash';

const { Sider, Content } = Layout;

const NoteList: React.FC<{}> = () => {

  const nameInput = useRef();

  const { queryOpenedNotes, showOpenNotes, onTabChange, setTreeData, treeData, noteData,
    showNote, setShowNote, noteLoading, treeLoading, handleEditNote, loadNote, setSearchValue, parentId } =
    useModel('note', ({ queryOpenedNotes, showOpenNotes, onTabChange, setTreeData, treeData, noteData,
      showNote, setShowNote, noteLoading, treeLoading, handleEditNote, loadNote, setSearchValue, parentId }) =>
      ({
        queryOpenedNotes, showOpenNotes, onTabChange, setTreeData, treeData, noteData,
        showNote, setShowNote, noteLoading, treeLoading, handleEditNote, loadNote, setSearchValue, parentId
      }));

  useEffect(() => {
    queryOpenedNotes();
  }, []);

  const handleNameChange = (e) => {
    setShowNote({ ...showNote, name: e.target.value });
  };

  const handleTextChange = (e) => {
    console.log(e);
  };

  const addRootNote = () => {
    const newNote = { parentId, name: '新文档', text: ' ' };
    nameInput.current.focus();
    setShowNote(newNote);
  };

  const addNote = () => {
    let newNote = {};
    if (showNote) {

      newNote = { parentId: showNote.id, name: '新文档', text: ' ' };
    } else {
      newNote = { parentId, name: '新文档', text: ' ' };
    }
    nameInput.current.focus();
    setShowNote(newNote);
  };

  const render = function () {
    return (
      <>
        <TopTabs
          onTabChange={(id) => {
            setSearchValue('');
            onTabChange(id);
          }}
        >
          <Layout className={styles.layout}>
            <Sider className={styles.openNotes} style={{ display: showOpenNotes ? 'inline-block' : 'none' }}>
              <OpenNotes />
            </Sider>
            <Sider className={styles.noteTree} style={{ display: showOpenNotes ? 'none' : 'inline-block' }}>
              <NoteTree addRootNote={addRootNote} addNote={addNote}></NoteTree>
            </Sider>
            <Content>
              <Card>
                <Spin spinning={noteLoading}>
                  <Input
                    ref={nameInput}
                    value={showNote.name}
                    onChange={handleNameChange}
                    onBlur={handleEditNote}
                  ></Input>
                  <div className={styles.text}>
                    <Editor
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
              </Card>
            </Content>
          </Layout>
        </TopTabs>
      </>
    );
  };
  return render();
};

export default NoteList;
