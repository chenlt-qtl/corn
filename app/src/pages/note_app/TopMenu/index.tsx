import React, { useState, useEffect } from 'react';
import { Modal, List, Button, message } from 'antd';
import { SettingOutlined, CloseOutlined, PlusCircleOutlined } from '@ant-design/icons';
import styles from './styles.less';
import { connect } from 'umi';
import TopForm from './TopForm'
import { NoteItem } from '@/pages/note/data.d';
import { guid } from '@/utils/utils'




const TopMenu: React.FC<{}> = (props) => {

    const [menuItem, setMenuItem] = useState < object[] > ([]);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const [editTopVisible, setEditTopVisible] = useState(false);

    const [topNote, setTopNote] = useState < NoteItem > ({});

    useEffect(() => {
        getTops();
    }, []);

    const getTops = () => {
        props.dispatch({
            type: 'note/queryChildren',
            payload: '0',
        }).then((res) => {
            if (res) {
                const { result } = res;
                if (result.length > 0) {
                    handleMenuSelect(result[0].id, result[0].name)
                }
                setMenuItem([...result]);
            }
        });
    }

    const handleAdd = () => {
        // if (menuItem.length >= 10) {
        //     message.error('最多只能有10个笔记本')
        // } else {
            setEditTopVisible(true);
            setTopNote({ name: '', id: guid() });
        // }
    }

    const handleMenuSelect = (id: string, name: string) => {
        props.dispatch({
            type: 'noteMenu/updateActiveTop',
            payload: { id, name },
        })
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }

    const handleShowModal = () => {
        setIsModalVisible(true)
    }

    const handleEdit = (note: NoteItem) => {
        setEditTopVisible(true);
        setTopNote(note);
    }

    const handleDelete = (id: string) => {

    }

    const onEditCancel = (needRefresh: boolean) => {
        if (needRefresh) {
            getTops();
        }
        setEditTopVisible(false);
    }

    const render = function () {
        return (
            <div className={styles.main}>
                <ul>
                    {menuItem.map(item => {
                        const isActive = item.id === props.noteMenu.activeTopId;
                        return <li key={item.id}
                            onClick={() => handleMenuSelect(item.id, item.name)}
                            className={`${styles.item} ${isActive ? styles.active : ''}`}
                        >
                            <div className={styles.shortLogo}>
                                {item.name.substr(0, 1)}
                            </div>
                            <div className={styles.label}>{item.name}</div>
                        </li>
                    })}
                </ul>
                <div className={styles.icon}><SettingOutlined onClick={handleShowModal} /></div>

                <Modal visible={isModalVisible} closable={false} footer={null} style={{ top: 20 }}>
                    <div className={styles.modal}>
                        <div className={styles.title}>
                            <span>管理笔记本</span>
                            <div className={styles.buttons}>
                                <Button type="text" onClick={handleAdd}><PlusCircleOutlined /></Button>
                                <Button type="text" onClick={handleCancel}><CloseOutlined /></Button>
                            </div>
                        </div>
                        <List
                            dataSource={menuItem}
                            renderItem={item => (
                                <List.Item
                                    actions={[<a onClick={() => { handleEdit(item) }}>edit</a>, <a onClick={() => { handleDelete(item.id) }}>delete</a>]}>
                                    {item.name}
                                </List.Item>
                            )}
                        />
                    </div>
                </Modal>
                <TopForm onCancel={onEditCancel} note={topNote} modalVisible={editTopVisible}></TopForm>
            </div>
        );
    };
    return render();
};

export default connect(({ note, noteMenu, loading }: { note: NoteModelState, noteMenu: NoteState, loading }) => ({ note, noteMenu, loading }))(TopMenu);
