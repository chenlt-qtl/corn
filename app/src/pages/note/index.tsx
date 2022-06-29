import React, { useState } from 'react';
import { Spin } from 'antd';
import { connect } from 'umi';
import style from './style.less';


import ListMenu from './ListMenu'
import Content from './Content'
import { NoteItem } from './data';
import HocMedia from "@/components/HocMedia";
import LeftMenu from "./LeftMenu";


let dragNote;

const NoteList: React.FC<{}> = (props) => {

  const [menuStyle, setMenuStyle] = useState<string>("three");

  const handleNoteClick = (note: NoteItem) => {
    const { isMobile } = props;
    if (note.isLeaf) {
      const { openedNote } = props.note;
      if (openedNote.id != note.id) {
        props.dispatch({
          type: 'note/openNote',
          payload: note.id,
        })
      }

      if (isMobile) {
        props.dispatch({
          type: 'note/refreshShowMenu',
          payload: false,
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
    const { isMobile } = props;

    const loading = props.loading.effects["note/queryNote"] || props.loading.effects["note/deleteNote"] || props.loading.effects["note/updateNoteTitle"]
      || props.loading.effects["note/queryTabTree"] || props.loading.effects["note/queryChildren"] || false;
    return (

      <div className={`${style.main} ${isMobile ? style.isMobile : ""}`}>
        {isMobile ?
          (props.note.showMenu ?
            <ListMenu onNoteClick={handleNoteClick} setDragNote={(note: NoteItem) => dragNote = note}></ListMenu> :
            <Content setMenuStyle={setMenuStyle} menuStyle={menuStyle}></Content>) :
          <div className={style.container}>
            <LeftMenu setMenuStyle={setMenuStyle} menuStyle={menuStyle}></LeftMenu>
            <div className={style.content}><Content setMenuStyle={setMenuStyle} menuStyle={menuStyle}></Content></div>
          </div>}
      </div>
    );
  };
  return render();
};

export default HocMedia(connect(({ note, noteMenu, loading }: { note: NoteModelState, noteMenu, loading }) => ({ note, noteMenu, loading }))(NoteList));
