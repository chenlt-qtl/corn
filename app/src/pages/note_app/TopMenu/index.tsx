import React, { useState, useEffect } from 'react';
import { Dropdown, Menu, Modal, List } from 'antd';
import { DownOutlined, UpOutlined, SettingOutlined } from '@ant-design/icons';
import styles from './style.less';
import { connect } from 'umi';

const TopMenu: React.FC<{}> = (props) => {

    const [showMenu, setShowMenu] = useState < boolean > (false);

    const [activeMenuId, setActiveMenuId] = useState < string > ('');

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
                    handleMenuSelect({ key: result[0].id })
                }
                setMenuItem([...result]);
            }
        });
    }, []);

    const handleMenuSelect = ({ key }) => {
        setActiveMenuId(key)
        props.onMenuSelect(key)
        setShowMenu(false)
    }

    const handleManageTop = () => {
        setIsModalVisible(true)
        setShowMenu(false)
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }

    const handleEdit = (id,name)=>{

    }

    const render = function () {
        const activeMenu = menuItem.filter(item => item.id == activeMenuId);
        const activeName = activeMenu.length > 0 ? activeMenu[0].name : '';
        const menu = (
            <div style={{width:'300px'}}>
                <div className={styles.menuToolbar}>
                    <SettingOutlined onClick={(handleManageTop)} />
                </div>
                <Menu onClick={handleMenuSelect}>
                    {menuItem.map(item => <Menu.Item key={item.id}
                        className={item.id == activeMenuId ? styles.active : ''}>{item.name}</Menu.Item>)}
                </Menu>
            </div>);
        return (
            <>
                <Dropdown overlay={menu} visible={showMenu} arrow={false}
                    onVisibleChange={(visible: boolean) => setShowMenu(visible)}
                    overlayClassName={styles.menu}>
                    <div className={styles.label}>
                        <a onClick={e => e.preventDefault()}>
                            {activeName}  {showMenu ? <DownOutlined /> : <UpOutlined />}
                        </a>
                    </div>
                </Dropdown>
                <Modal title="管理笔记本" visible={isModalVisible} onCancel={handleCancel} footer={null}>
                    <div className={styles.modal}>
                        <List
                            dataSource={menuItem}
                            renderItem={item => (
                                <List.Item
                                    actions={[<a onClick={()=>{handleEdit(item.id,item.name)}}>edit</a>, <a key="list-loadmore-more">delete</a>]}>
                                    {item.name}
                                </List.Item>
                            )}
                        />
                    </div>
                </Modal>
            </>
        );
    };
    return render();
};

export default connect(({ note, loading }: { note: NoteModelState, loading }) => ({ note, loading }))(TopMenu);
