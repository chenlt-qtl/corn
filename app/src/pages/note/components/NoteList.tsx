import React from 'react';
import styles from '../index.less'
import { CloseOutlined } from '@ant-design/icons';
import { NoteItem } from '../data';
import { Empty, Skeleton } from 'antd';
import { connect } from 'umi';


interface NoteListProp {
    loading: boolean;
    listData: [NoteItem];
    dispatch?: Function;
    activeNoteId: string;
    remove?: Function;
}

const NoteList: React.FC<NoteListProp> = (props) => {

    const handleClick = (id: string) => {
        props.dispatch!({
            type: 'note/queryNote',
            payload: id
        })
    }

    const { remove, listData, activeNoteId, loading } = props;
    return (
        <Skeleton active={true} loading={loading}>
            {listData.length>0?listData.map(item => <div key={item.id} className={item.id === activeNoteId ? styles.active : ''}>
                {remove ? <span className={styles.close}><CloseOutlined onClick={() => { remove(item.id) }} /></span> : ''}
                <span onClick={() => { handleClick(item.id!) }}>{item.name}<span className={styles.parents}>{item.parents}</span></span>
            </div>):<Empty></Empty>}
        </Skeleton>
    );
}
export default connect()(NoteList);