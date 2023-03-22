import React, { useEffect } from 'react';
import { connect } from 'umi';
import style from './style.less';
import HocMedia from "@/components/HocMedia";
import Menu from "./Menu";
import Content from './Content'
import ListMenu from './Menu/components/ListMenu'

const NoteList: React.FC<{}> = (props) => {

  useEffect(() => {
    props.dispatch({
      type: 'note/getNoteTree',
    })
  }, [])

  useEffect(() => {
    getOpenData();
  }, [props.match.params])

  const getOpenData = () => {
    const { id } = props.match.params;
    if (id) {
      props.dispatch({
        type: 'note/openNote',
        payload: id,
      })
    } else {
      props.dispatch({
        type: 'note/refreshOpenedNote',
        payload: {},
      })
    }

  }


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
      <>
        {getComponent()}
      </>
    );
  };
  return render();
};

export default HocMedia(connect(({ loading }: { loading }) => ({ loading }))(NoteList));
