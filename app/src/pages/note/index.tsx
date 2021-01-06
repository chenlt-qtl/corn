import React, { useState, useEffect, useRef } from 'react';
import { Layout, Spin } from 'antd';
import styles from './index.less';
import TopTabs from './components/TopTabs';
import NoteTree from './components/NoteTree';
import OpenNotes from './components/OpenNotes';
import NoteFavorate from './components/NoteFavorate';
import NoteContent from './components/NoteContent';
import { connect } from 'umi';

const { Sider, Content } = Layout;

const NoteList: React.FC<{}> = (props) => {

  const [openTabId, setOpenTabId] = useState<string>('open');
  const noteContent = useRef();

  const handleTabChange = (id) => {
    setOpenTabId(id);
    if (id != "open" || id != "favorate") {
      props.dispatch({
        type: 'note/queryTabTree',
        payload: id,
      })
    }
  };

  const handleAddNote = (note) => {
    noteContent.current.focusName();
    props.dispatch({
      type: 'note/refreshShowNote',
      payload: note,
    })
  }

  const render = function () {
    const noteLoading = props.loading.effects["note/queryNote"];
    return (
      <div className={styles.out}>
        <Spin spinning={noteLoading ? true : false}>
          <TopTabs onTabChange={handleTabChange}        >
            <Layout className={styles.layout}>
              <Sider className={styles.openNotes} width={300} style={{ display: openTabId === 'open' ? 'inline-block' : 'none' }}>
                <OpenNotes />
              </Sider>
              <Sider className={styles.openNotes} width={300} style={{ display: openTabId === 'favorate' ? 'inline-block' : 'none' }}>
                <NoteFavorate />
              </Sider>
              <Sider className={styles.noteTree} width={300} style={{ display: (openTabId != 'open' && openTabId != 'favorate') ? 'inline-block' : 'none' }}>
                <NoteTree onAddNote={handleAddNote}></NoteTree>
              </Sider>
              <Content className={styles.content}>
                <NoteContent ref={noteContent} />
              </Content>
            </Layout>
          </TopTabs>
        </Spin>
      </div>
    );
  };
  return render();
};

export default connect(({ note, loading }: { note: NoteModelState, loading }) => ({ note, loading }))(NoteList);
