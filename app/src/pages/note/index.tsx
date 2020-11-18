import React, { useState, useEffect } from 'react';
import { Tree, Input, Card, Layout, Spin } from 'antd';
import { NoteItem } from './data'
import styles from './index.less'
import { Editor } from '@tinymce/tinymce-react';
import TopTabs from './TopTabs';
import OpenNotes from './OpenNotes';
import { useModel } from 'umi';

const { Search } = Input;
const { Sider, Content } = Layout;

const gData = [];

const dataList: object[] = [];

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

const NoteList: React.FC<{}> = () => {

  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>('');

  
  const { queryOpenedNotes, openedNotes, showOpenNotes, onTabChange, 
    treeData, showNote, setShowNote, noteLoading, treeLoading, handleModifyNote, loadNote } = useModel('note');

  useEffect(() => {
    queryOpenedNotes();
  }, []);

  const handleNameChange = (e) => {
    setShowNote({ ...showNote, name: e.target.value })
  }

  const onExpand = (expandedKeys: string[]) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const onChange = e => {
    const { value } = e.target;
    const expandedKeys = dataList
      .map(item => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, gData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(true);
    setSearchValue(value);
  };


  const handleTextChange = (e) => {
    console.log(e);

  }

  const render = function () {

    return (
      <>
        <TopTabs onTabChange={onTabChange}>
          <Layout className={styles.layout}>
            <Sider style={{ display: showOpenNotes ? "inline-block" : "none" }}>
              <OpenNotes loadNote={loadNote} />
            </Sider>
            <Sider style={{ display: showOpenNotes ? "none" : "inline-block" }}>
              <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={onChange} />
              <Spin spinning={treeLoading}>
                <Tree
                  onExpand={onExpand}
                  expandedKeys={expandedKeys}
                  autoExpandParent={autoExpandParent}
                  treeData={treeData}
                  onSelect={loadNote}
                />
              </Spin>
            </Sider>
            <Content>
              <Card>
                <Spin spinning={noteLoading}>
                  <Input value={showNote.name} onChange={handleNameChange} onBlur={handleModifyNote}></Input>
                  {/* <div className={styles.text} dangerouslySetInnerHTML={{ __html: note }} /> */}
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
  }
  return render();
};

export default NoteList;
