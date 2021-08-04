import React, { useRef } from 'react';
import { Spin } from 'antd';
import { connect } from 'umi';
import LeftMenu from './LeftMenu'
import Content from './Content'




const NoteList: React.FC<{}> = (props) => {

  const content = useRef()

  /**
   * level 1:一级  2:二级  3 4:三级 
   */
  const refreshMenu = (level: number) => {
    let method = 'note/queryChildren';
    let id;

    if (level == 1) {
      id = props.noteMenu.activeTopId
    } else if (level == 2) {
      id = props.noteMenu.activeMenu1Id
    } else {
      level = 3;
      method = 'note/queryTabTree'
      id = props.noteMenu.activeMenu2Id
    }
    if (id) {
      props.dispatch({
        type: method,
        payload: id,
      }).then((res) => {
        if (res) {
          const { result } = res;
          props.dispatch({
            type: `noteMenu/refreshMenu${level}`,
            payload: result,
          })
        }
      });
    } else {
      props.dispatch({
        type: `noteMenu/refreshMenu${level}`,
        payload: [],
      })
    }
  }

  const handleAddNote = (pid: string) => {
    content.current.handleAddNote(pid)
  }

  const render = function () {
    const loading = props.loading.effects["note/queryNote"] || props.loading.effects["note/deleteNote"]
      || props.loading.effects["note/queryTabTree"] || props.loading.effects["note/queryChildren"] || false;
    return (
      <Spin spinning={loading}>
        <Content ref={content} refreshMenu={refreshMenu}>
          <LeftMenu refreshMenu={refreshMenu} onAddNote={handleAddNote}></LeftMenu>
        </Content>
      </Spin >
    );
  };
  return render();
};

export default connect(({ note, noteMenu, loading }: { note: NoteModelState, noteMenu, loading }) => ({ note, noteMenu, loading }))(NoteList);
