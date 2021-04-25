import React, { useState, useEffect } from 'react';
import { Dropdown, Menu, Modal, List } from 'antd';
import { HistoryOutlined, StarFilled, BookTwoTone, SettingOutlined } from '@ant-design/icons';
import styles from './styles.less';
import { connect } from 'umi';


const TopMenu: React.FC<{}> = (props) => {

    const [menuItem, setMenuItem] = useState < object[] > ([]);

    const [isModalVisible, setIsModalVisible] = useState(false);


    useEffect(() => {
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
    }, []);

    const handleMenuSelect = (id:string, name:string) => {
        props.dispatch({
            type: 'noteMenu/updateActiveTop',
            payload: {id,name},
        })
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }

    const handleShowModal = () => {
        setIsModalVisible(true)
    }

    const handleEdit = (id, name) => {

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
                
                <Modal title="管理笔记本" visible={isModalVisible} onCancel={handleCancel} footer={null} style={{ top: 20 }}>
                    <div className={styles.modal}>
                        <List
                            dataSource={menuItem}
                            renderItem={item => (
                                <List.Item
                                    actions={[<a onClick={() => { handleEdit(item.id, item.name) }}>edit</a>, <a key="list-loadmore-more">delete</a>]}>
                                    {item.name}
                                </List.Item>
                            )}
                        />
                    </div>
                </Modal>
            </div>
        );
    };
    return render();
};

export default connect(({ note, noteMenu, loading }: { note: NoteModelState, noteMenu: NoteState, loading }) => ({ note, noteMenu, loading }))(TopMenu);
