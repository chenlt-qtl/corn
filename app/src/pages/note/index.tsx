import React, { useState } from 'react';
import { connect } from 'umi';
import style from './style.less';
import HocMedia from "@/components/HocMedia";
import LeftMenu from "./LeftMenu";
import Content from './Content'
import ListMenu from './ListMenu'

const NoteList: React.FC<{}> = (props) => {

  const [menuStyle, setMenuStyle] = useState<string>("three");

  const render = function () {
    const { isMobile } = props;
    return (

      <div className={`${style.nt_main} ${isMobile ? style.nt_isMobile : ""}`}>
        {isMobile ?
          (props.note.showMenu ?
            <ListMenu></ListMenu> :
            <Content setMenuStyle={setMenuStyle} menuStyle={menuStyle}></Content>) :
          <div className={style.nt_container}>
            <LeftMenu setMenuStyle={setMenuStyle} menuStyle={menuStyle}></LeftMenu>
            <div className={style.nt_content}><Content setMenuStyle={setMenuStyle} menuStyle={menuStyle}></Content></div>
          </div>}
      </div>
    );
  };
  return render();
};

export default HocMedia(connect(({ note, loading }: { note: NoteModelState, loading }) => ({ note, loading }))(NoteList));
