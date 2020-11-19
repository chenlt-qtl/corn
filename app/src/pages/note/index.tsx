import React, { useState, useEffect } from 'react';
import { Tree, Input, Card, Layout, Spin } from 'antd';
import styles from './index.less';
import { Editor } from '@tinymce/tinymce-react';
import TopTabs from './TopTabs';
import OpenNotes from './OpenNotes';
import { useModel } from 'umi';
import { keys } from 'lodash';

const { Search } = Input;
const { Sider, Content } = Layout;

const NoteList: React.FC<{}> = () => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>('');

  const {
    queryOpenedNotes, showOpenNotes, onTabChange, setTreeData, treeData, noteData,
    showNote, setShowNote, noteLoading, treeLoading, handleModifyNote, loadNote,
  } = useModel('note');

  useEffect(() => {
    queryOpenedNotes();
  }, []);

  const handleNameChange = (e) => {
    setShowNote({ ...showNote, name: e.target.value });
  };

  const onExpand = (expandedKeys: string[]) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const onSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const onSearch = (value) => {
    setAutoExpandParent(true);
    const { keys, treeData } = getSearchResult(noteData, value);
    setExpandedKeys(Array.from(new Set(keys)));
    setTreeData(treeData);
  };

  const handleTextChange = (e) => {
    console.log(e);
  };

  //设置搜索结果
  const getSearchResult = (data, searchValue) => {
    const keys = [];
    if (!searchValue || searchValue.trim() === '') {
      return { treeData: data, keys };
    }
    const treeData = data.reduce((total, item) => {
      let children = [];
      if (item.children) {
        const childrenData = getSearchResult(item.children, searchValue);
        children = childrenData.treeData;
        keys.push(...childrenData.keys);
      }
      const index = item.name.toLowerCase().indexOf(searchValue.trim().toLowerCase());
      if (index > -1 || children.length > 0) {
        let title;
        keys.push(...item.parentIds.split('/'));
        if (index > -1) {
          const beforeStr = item.name.substr(0, index);
          const afterStr = item.name.substr(index + searchValue.length);
          title = (<span>
            {beforeStr}
            <span className={styles.found}>{searchValue}</span>
            {afterStr}
          </span>);
        } else {
          title = <span>{item.name}</span>;
        }
        if (children.length > 0) {
          total.push({ ...item, title, children });
        } else {
          total.push({ ...item, title });
        }
      }
      return total;
    }, []);
    return { treeData, keys };
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
              <OpenNotes loadNote={loadNote} />
            </Sider>
            <Sider className={styles.noteTree} style={{ display: showOpenNotes ? 'none' : 'inline-block' }}>
              <Search
                style={{ marginBottom: 8 }}
                value={searchValue}
                placeholder="Search"
                onChange={onSearchChange}
                onSearch={onSearch}
              />
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
                  <Input
                    value={showNote.name}
                    onChange={handleNameChange}
                    onBlur={handleModifyNote}
                  ></Input>
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
  };
  return render();
};

export default NoteList;
