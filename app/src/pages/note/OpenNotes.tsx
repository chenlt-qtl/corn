import React from 'react';
import styles from './index.less'
import { CloseOutlined } from '@ant-design/icons';
import { useModel } from 'umi';


const OpenNotes: React.FC<{}> = (props) => {

    const { openedNotes, removeOpenNote, showNote, loadNote } = useModel('note');

    return (
        <>
            {openedNotes.map(item => <div key={item.id} className={item.id === showNote.id ? styles.active : ''}>
                <CloseOutlined onClick={() => { removeOpenNote(item.id) }} />
                <span onClick={() => { loadNote([item.id]) }}>{item.name}<span className={styles.parents}>{item.parents}</span></span>
            </div>)}
        </>
    );
}
export default OpenNotes;