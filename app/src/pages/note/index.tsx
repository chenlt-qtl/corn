import React, { useState, useEffect } from 'react';
import { Tree, Input, Card, Layout } from 'antd';
import { NoteItem } from './data'
import { queryTreeList,queryNote } from './service'
import styles from './index.less'
import { Editor } from '@tinymce/tinymce-react';

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

const note = ``;

const NoteList: React.FC<{}> = () => {

  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>('');
  const [noteData, setNoteData] = useState<object[]>([]);
  const [treeData, setTreeData] = useState<object[]>([]);
  const [openedNotes, setOpenedNotes] = useState<object[]>([]);
  const [showNote, setShowNote] = useState<object>({});


  const onExpand = (expandedKeys: string[]) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const loadNote = ([selectId]:string[])=>{
    const note = openedNotes.find(item=>{
      return item.id === selectId;
    });
    
    if(note){
      setShowNote(note);
    }else{
      queryNote(selectId).then(({ result }) => {
        setShowNote(result);
        setOpenedNotes([result,...openedNotes]);
      })
    }
  }

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

  useEffect(() => {
    queryTreeList({ parentId: '0' }).then(({ result }) => {
      setNoteData(result);
      setTreeData(loop(result));
    });
  }, [])

  const loop = function (data:object[]):object[] {
    return data.map(item => {
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span className="site-tree-search-value">{searchValue}</span>
            {afterStr}
          </span>
        ) : (
            <span>{item.title}</span>
          );
      if (item.children) {
        return { title, key: item.key, children: loop(item.children) };
      }

      return {
        title,
        key: item.key,
      };
    });
  }
  const render = function () {
    console.log(showNote);
    
    return (
      <Layout className={styles.layout}>
        <Sider>
          <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={onChange} />
          <Tree
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            treeData={treeData}
            onSelect={loadNote}
          />
        </Sider>
        <Content>
          <Card>
            <Input value={showNote.name}></Input>
            {/* <div className={styles.text} dangerouslySetInnerHTML={{ __html: note }} /> */}
            <div className={styles.text}>
              <Editor
                value={showNote.text}
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
          </Card>
        </Content>
      </Layout>
    );
  }
  return render();
};

export default NoteList;
