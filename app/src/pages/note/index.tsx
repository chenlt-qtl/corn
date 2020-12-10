import React, { useState, useEffect, useRef } from 'react';
import { Layout, Spin } from 'antd';
import styles from './index.less';
import TopTabs from './components/TopTabs';
import NoteTree from './components/NoteTree';
import OpenNotes from './components/OpenNotes';
import NoteContent from './components/NoteContent';
import { connect, NoteModelState, ConnectProps } from 'umi';

const { Sider, Content } = Layout;

const NoteList: React.FC<{}> = (props) => {

  const [showOpenNotes, setShowOpenNotes] = useState<boolean>(true);
  const noteContent = useRef();

  const handleTabChange = (id) => {
    if (id) {
      setShowOpenNotes(false);
      props.dispatch({
        type: 'note/queryTabTree',
        payload: id,
      })
    } else {
      setShowOpenNotes(true);
    }
  };

  const handleAddNote = (note)=>{
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
              <Sider className={styles.openNotes} width={300} style={{ display: showOpenNotes ? 'inline-block' : 'none' }}>
                <OpenNotes />
              </Sider>
              <Sider className={styles.noteTree} width={300} style={{ display: showOpenNotes ? 'none' : 'inline-block' }}>
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
