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
    const { type } = props.match.params;
    if (type == "folder") {
      if (props.note.noteTreeData.length == 0) {
        props.dispatch({
          type: 'note/getNoteTree',
        })
      }
    }
  }, [props.match.params.type])

  useEffect(() => {
    const { id } = props.match.params;
    if (id) {
      props.dispatch({
        type: 'note/openNote',
        payload: id,
      })
    }
  }, [props.match.params.id])


  const getComponent = () => {
    const { isMobile } = props;
    const { id } = props.match.params;

    if (isMobile) {
      if (id) {
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
