import React from 'react';
import { Spin } from 'antd';
import { connect } from 'umi';
import style from './style.less';

import TreeMenu from './TreeMenu'
import ListMenu from './ListMenu'
import Content from './Content'
import { NoteItem } from './data';


let dragNote;

const NoteList: React.FC<{}> = (props) => {

  const handleNoteClick = (note: NoteItem) => {
    if (note.isLeaf) {
      const { openedNote } = props.note;
      if (openedNote.id != note.id) {
        props.dispatch({
          type: 'note/openNote',
          payload: note.id,
        })
      }
    } else {
      const { listParentNote } = props.noteMenu;
      if (listParentNote.id != note.id) {
        props.dispatch({
          type: 'noteMenu/refreshListParentNote',
          payload: note
        })
      }
    }
  }

  const render = function () {
    const loading = props.loading.effects["note/queryNote"] || props.loading.effects["note/deleteNote"] || props.loading.effects["note/updateNoteTitle"]
      || props.loading.effects["note/queryTabTree"] || props.loading.effects["note/queryChildren"] || false;
    return (
      <Spin spinning={loading}>
        <div className={style.main}>
          <TreeMenu onNoteClick={handleNoteClick} getDragNote={()=>dragNote}></TreeMenu>
          <div className={style.body}>
            <div className={style.listMenu}><ListMenu onNoteClick={handleNoteClick} setDragNote={(note: NoteItem) => dragNote = note}></ListMenu> </div>
            <div className={style.divider}></div>
            <div className={style.content}><Content></Content></div>

          </div>
        </div>

      </Spin >
    );
  };
  return render();
};

export default connect(({ note, noteMenu, loading }: { note: NoteModelState, noteMenu, loading }) => ({ note, noteMenu, loading }))(NoteList);
