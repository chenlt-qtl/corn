import React, { useState, useEffect } from 'react';
import { getSentenceByArticle } from '../../service';
import { List, Popconfirm } from 'antd';
import styles from './styles.less';
import { PlusCircleOutlined, EditOutlined, PlayCircleOutlined, DeleteOutlined, FileAddOutlined } from '@ant-design/icons';
import { SentenceItem } from '../../data.d';
import EditModal from './EditModal';


export interface SentenceListProps {
    articleId: string
    play: (mp3: string) => void
    edit: boolean
}


const SentenceList: React.FC<SentenceListProps> = (props) => {
    const { articleId, play, edit=false } = props;
    const [sentences, setSentences] = useState<SentenceItem[]>([]);
    const [sentence, setSentence] = useState<SentenceItem>({});
    const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
    const [single, setSingle] = useState<boolean>(true);

    useEffect(() => {
        getSentence();
    }, [])

    const getSentence = () => {
        getSentenceByArticle(articleId).then(res => {
            if (res) {
                if (res.success && res.result) {
                    setSentences(res.result);
                }
            }
        })
    }

    const openEditModel = (item: SentenceItem, single: boolean) => {
        setSentence(item);
        setEditModalVisible(true);
        setSingle(single);
    }

    const handleDel = (id: string) => {

    }

    const getActions = (item: SentenceItem): React.ReactNode[] => {
        const actions = [
            <EditOutlined onClick={() => { openEditModel(item, true) }} />,];
        if (item.mp3) {
            actions.push(<PlayCircleOutlined />);
        }
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
        return actions;
    }


    return (
        <>
            {edit ? <div className={styles.module}>
                <div className={styles.moduleTitle}>句子列表</div>
                <div className={styles.toolbar}>
                    <PlusCircleOutlined title='增加句子' onClick={() => { openEditModel({}, true) }} />
                    <FileAddOutlined title='批量增加句子' onClick={() => { openEditModel({}, false) }} />
                </div>
            </div> : ''}
            <List
                itemLayout="vertical"
                size="large"
                pagination={false}
                dataSource={sentences}
                renderItem={(item: SentenceItem) => (
                        <List.Item
                        key={item.id}
                        actions={getActions(item)}
                        extra={item.picture ? <img width={100} src={item.picture} /> : ''}
                    >
                        <pre>{item.content}
                            {item.mp3 ? <i className={`fa fa-volume-up ${styles.trumpet}`} onClick={()=>play(item.mp3)}></i> : ''}</pre>
                    </List.Item>
                )}
            />
            {edit ? <EditModal articleId={articleId} sentence={sentence} single={single}
                onCancel={(reload) => {
                    reload && getSentence();
                    setEditModalVisible(false);
                }}
                modalVisible={editModalVisible}></EditModal> : ''}
        </>
    );
};

export default SentenceList;
