import React, { useEffect } from 'react';
import { connect } from 'umi';
import style from './style.less';
import HocMedia from "@/components/HocMedia";
import Menu from "./Menu";
import Content from './Content'
import ListMenu from './Menu/components/ListMenu'
import { Spin } from "antd"


const Note: React.FC<{}> = (props) => {

  useEffect(() => {
    props.dispatch({ type: 'note/getNoteTree' })
  }, [])

  const getComponent = () => {
    const { isMobile } = props;
    const { openedNote } = props.note;

    if (isMobile) {
      if (openedNote) {
        return <Content {...props}></Content>;
      } else {
        return <ListMenu {...props}></ListMenu>;
      }
    } else {
      return (
        <div className={style.container}>
          <Menu {...props}></Menu>
          <Content {...props}></Content>
        </div>)
    }

  }

  const render = function () {
    return (
      <div className={style.body}>
        {props.loading ? <Spin spinning={true} wrapperClassName={style.spin}>
          <div></div>
        </Spin> : ""}
        {getComponent()}
      </div>
    );
  };
  return render();
};

export default HocMedia(connect(({ loading, note }: { loading, note }) => ({ loading: loading.models.note, note }))(Note));
