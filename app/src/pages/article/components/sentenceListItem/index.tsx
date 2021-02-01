import React, { useState, useRef } from 'react';
import { List, Popconfirm } from 'antd';
import styles from './styles.less';
import { EditOutlined, PlayCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { SentenceItem } from '../../data';
import 'font-awesome/css/font-awesome.min.css';



export interface SentenceListItemProps {
    sentence: SentenceItem;
    openEditModel: (sentence: SentenceItem, single: boolean) => {}
    handleDel: (id: string) => {};
    editable: boolean;
    play:(mp3:string)=>{}
}


const SentenceListItem: React.FC<SentenceListItemProps> = (props) => {
    const { sentence, openEditModel, handleDel, editable,play } = props;

    const getActions = (item: SentenceItem): React.ReactNode[] => {
        const actions = [];
        if (editable) {
            actions.push(<EditOutlined onClick={() => { openEditModel(item, true) }} />);
            actions.push(
                <Popconfirm
                    title="确认要删除这个句子?"
                    onConfirm={() => { handleDel(item.id!) }}
                    okText="是"
                    cancelText="否"
                >
                    <DeleteOutlined />
                </Popconfirm>
            );
        }
        return actions;
    }

    return (
        <>
            <List.Item
                actions={getActions(sentence)}
                extra={sentence.picture ? <img width={100} src={sentence.picture} /> : ''}
            >
                <pre>{sentence.content}
                    {sentence.mp3 ? <i className={`fa fa-volume-up ${styles.trumpet}`} onClick={()=>play(sentence.mp3)}></i> : ''}</pre>
            </List.Item>
        </>
    );
};

export default SentenceListItem;