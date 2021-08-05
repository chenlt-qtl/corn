import React, { useState, useEffect } from 'react';
import { Modal, List, Button, Input } from 'antd';
import { SettingOutlined, CloseOutlined, PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import styles from './styles.less';
import { connect } from 'umi';
import TopForm from './TopForm'
import { NoteItem } from '@/pages/note/data.d';
import { guid } from '@/utils/utils'
import SeachModal from './SearchModal';



const TopMenu: React.FC<{}> = (props) => {

    const [isModalVisible, setIsModalVisible] = useState(false);

    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const [editTopVisible, setEditTopVisible] = useState(false);

    const [topNote, setTopNote] = useState<NoteItem>({});

    useEffect(() => {
        getTops();
    }, []);

    const getTops = () => {
        props.dispatch({
            type: 'noteMenu/queryTopMenu',
            payload: '0'
        })
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
            payload: id ,
        })
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }

    const handleShowModal = () => {
        setIsModalVisible(true)
    }

    const handleShowSearch = () => {
        setIsSearchVisible(true);
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
        const { topMenuItem, activeTopId } = props.noteMenu;
        return (
            <div className={styles.main}>
                <div className={styles.icon}><SearchOutlined onClick={handleShowSearch} /></div>
                <ul>
                    {topMenuItem.map(item => {
                        const isActive = item.id == activeTopId;
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
                            dataSource={topMenuItem}
                            renderItem={item => (
                                <List.Item
                                    actions={[<a onClick={() => { handleEdit(item) }}>edit</a>, <a onClick={() => { handleDelete(item.id) }}>delete</a>]}>
                                    {item.name}
                                </List.Item>
                            )}
                        />
                    </div>
                </Modal>
                <SeachModal modalVisible={isSearchVisible} onCancel={() => { setIsSearchVisible(false) }} />
                <TopForm onCancel={onEditCancel} note={topNote} modalVisible={editTopVisible}></TopForm>
            </div>
        );
    };
    return render();
};

export default connect(({ note, noteMenu, loading }: { note: NoteModelState, noteMenu: NoteState, loading }) => ({ note, noteMenu, loading }))(TopMenu);
