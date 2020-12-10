import React, { useEffect } from 'react';
import styles from '../index.less'
import { CloseOutlined } from '@ant-design/icons';
import { connect, NoteModelState, ConnectProps, NoteState } from 'umi';
import { Skeleton } from 'antd';


const OpenNotes: React.FC<{}> = (props) => {

    useEffect(() => {
        props.dispatch({
            type: 'openNotes/queryOpenNote',
        })
    }, []);

    const handleClick = (id: string) => {
        props.dispatch({
            type: 'note/queryNote',
            payload: id
        })
    }
    const removeOpenNote = (id: string) => {
        const { openedNotes } = props.openNotes;
        props.dispatch({
            type: 'openNotes/updateOpenNote',
            payload: openedNotes.filter(item => item.id != id)
        })
    }

    const loading = props.loading.effects["openNotes/queryOpenNote"];
    return (
        <Skeleton active={true} loading={loading}>
            {props.openNotes.openedNotes.map(item => <div key={item.id} className={item.id === props.note.showNote.id ? styles.active : ''}>
                <CloseOutlined onClick={() => { removeOpenNote(item.id) }} />
                <span onClick={() => { handleClick(item.id) }}>{item.name}<span className={styles.parents}>{item.parents}</span></span>
            </div>)}
        </Skeleton>
    );
}
export default connect(({ openNotes, note, loading }: { openNotes: OpenNoteState, note: NoteState, loading }) => (
    { openNotes, note, loading })
)(OpenNotes);
