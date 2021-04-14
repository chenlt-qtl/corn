import React, { useState, useRef } from 'react';
import { Modal, Input, Spin } from 'antd';
import { ExclamationCircleTwoTone, CheckCircleTwoTone, LoadingOutlined } from '@ant-design/icons';
import styles from './index.less';
import { connect } from 'umi';
import Menu from './Menu'

const { TextArea } = Input;

let note = {};
let statusIcons = {
  '0': <CheckCircleTwoTone twoToneColor="#52c41a" />,
  '1': <ExclamationCircleTwoTone twoToneColor='#f1c40f' />, '2': <LoadingOutlined />
}

const NoteList: React.FC<{}> = (props) => {

  const content = useRef();
  const titleInput = useRef();
  const [code, setCode] = useState < string > ('');
  const [saveStatus, setSaveStatus] = useState < Number > (null);
  const [title, setTitle] = useState < string > ('');
  const [codeVisible, setCodeVisible] = useState < boolean > (false);



  const execCommand = (command: string, param1: string = '') => {
    document.execCommand(command, false, param1);
  }

  const showCode = () => {
    setCode(content.current.innerHTML);
    setCodeVisible(true);
  }

  const handleUpdateCode = () => {
    content.current.innerHTML = code;
    setCodeVisible(false);
  }

  const handleCodeChange = ({ target: { value } }) => {
    setCode(value)
  }

  const handleAddNote = (parentId: string) => {
    console.log(111111);
    setSaveStatus(1)
    note = {parentId};
    setTitle('新文档');
    content.current.innerHTML = '';
    titleInput.current.focus()
  }
  const handleShowNote = (id: string) => {
    if (!id || id == '') {
      note = {};
      setTitle('');
      content.current.innerHTML = '';
    } else if (id != "open" && id != "favorate") {
      props.dispatch({
        type: 'note/queryNote',
        payload: id,
      }).then((res) => {
        if (res) {
          note = res;
          setTitle(note.name);
          content.current.innerHTML = note.text;
          setSaveStatus(0)
        }
      });
    }

  }

  const handleChange = (e) => {
    setSaveStatus(1)
  }

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setSaveStatus(1)
  }

  const saveNote = () => {
    if (saveStatus == 0) {
      return;
    }
    setSaveStatus(2)
    note = { ...note, name: title, text: content.current.innerHTML }
    if (note.parentId) {
      if (note.id) {
        props.dispatch({
          type: 'note/modifyNote',
          payload: note
        }).then(() => {
          setSaveStatus(0)
        })
      } else {
        props.dispatch({
          type: 'note/addNote',
          payload: note
        }).then((res) => {
          if (res) {
            const { result: newNote } = res;
            note = { ...newNote }
            setSaveStatus(0)
          }
        })
      }
    }
  }

  const render = function () {
    const loading = props.loading.effects["note/queryNote"] || props.loading.effects["note/deleteNote"]
      || props.loading.effects["note/queryTabTree"] || props.loading.effects["note/queryChildren"];
    return (
      <Spin spinning={loading}>
        <div className={styles.toolbar}>
          <a onClick={showCode} href='#'>code</a>
          <a onClick={() => execCommand('bold')} href='#'><b>Bold</b></a>
          <a onClick={() => execCommand('italic')} href='#'><em>Italic</em></a>
          <a onClick={() => execCommand('underline')} href='#'><u><b>U</b></u></a>
          <a className={styles.yellow}
            onClick={() => {
              execCommand('backColor', '#FFEB9C')
              execCommand('foreColor', '#9C6500')
            }} href='#'>突出</a>
          <a className={styles.green}
            onClick={() => {
              execCommand('backColor', '#C6EFCE')
              execCommand('foreColor', '#006100')
            }} href='#'>优秀</a>
          <a className={styles.warning}
            onClick={() => {
              execCommand('backColor', '#FFC7CE')
              execCommand('foreColor', '#9C0006')
            }} href='#'>警告</a>
          <a onClick={() => execCommand('removeFormat')} href='#'><b>去除格式</b></a>
          <a onClick={() => execCommand('insertHorizontalRule')} href='#'><b>水平线</b></a>
          <a onClick={() => execCommand('insertHTML', '&nbsp;&nbsp;&nbsp;-&nbsp;')} href='#'><b>*</b></a>
          <a onClick={() => execCommand('insertText', '    ')} href='#'><b>Tab</b></a>
          <a onClick={() => execCommand('indent')} href='#'><b>{'>'}</b></a>
          <a onClick={() => execCommand('fontname', 'Microsoft YaHei')} href='#'><span style={{ fontFamily: 'Microsoft YaHei' }}>雅黑</span></a>
          <a onClick={() => execCommand('fontname', 'SimHei')} href='#'><span style={{ fontFamily: 'SimHei' }}>黑体</span></a>
          <a onClick={() => execCommand('fontname', 'SimSun')} href='#'><span style={{ fontFamily: 'SimSun' }}>宋体</span></a>
          <a onClick={() => execCommand('fontname', 'Courier New')} href='#'><div style={{ display: 'inline-block', fontFamily: 'Courier New' }}>Font</div></a>
          <a onClick={() => execCommand('fontname', 'Comic Sans MS')} href='#'><div style={{ display: 'inline-block', fontFamily: 'Comic Sans MS' }}>Font</div></a>



        </div>
        <div className={styles.main}>
          <Menu onShowNote={handleShowNote} onAddNote={handleAddNote}></Menu>
          <div className={styles.content}>
            <div className={styles.title}><Input ref={titleInput} value={title} onBlur={saveNote} onInput={handleTitleChange}></Input>{statusIcons[saveStatus]}</div>
            <div className={styles.text} ref={content} onInput={handleChange} onBlur={saveNote} suppressContentEditableWarning="true" contentEditable>
            </div>
          </div>
        </div>
        <Modal
          visible={codeVisible}
          onOk={handleUpdateCode}
          onCancel={() => setCodeVisible(false)}
        >
          <div style={{ marginBottom: '10px' }}>Source code</div>
          <TextArea value={code} rows={10} onChange={handleCodeChange} />

        </Modal>
      </Spin >
    );
  };
  return render();
};

export default connect(({ note, loading }: { note: NoteModelState, loading }) => ({ note, loading }))(NoteList);
