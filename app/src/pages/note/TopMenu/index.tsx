import React, { useState, useEffect } from 'react';
import { Tree } from 'antd';
import { BookOutlined, CaretDownOutlined, CaretLeftOutlined, StarFilled, HistoryOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './styles.less';
import { connect } from 'umi';
import TopForm from './TopForm'
import { NoteItem } from '@/pages/note/data.d';
import { guid } from '@/utils/utils'
import SeachModal from './SearchModal';
import e from '@umijs/deps/compiled/express';


const { DirectoryTree } = Tree;

const TopMenu: React.FC<{}> = (props) => {

    const [showTree, setShowTree] = useState(true);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const [editTopVisible, setEditTopVisible] = useState(false);

    const [topNote, setTopNote] = useState<NoteItem>({});

    useEffect(() => {
        getTreeData();
    }, []);

    const getTreeData = () => {
        props.dispatch({
            type: `noteMenu/queryMenuTree`,
            payload: 0,
        })
    }

    const handleAdd = () => {
        setEditTopVisible(true);
        setTopNote({ name: '', id: guid() });
    }

    const handleMenuSelect = (id: string, name: string) => {
        props.dispatch({
            type: 'noteMenu/updateActiveTop',
            payload: id,
        })
        setIsMenuVisible(false)
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

    const handleToggle = e => {
        e.preventDefault();
        setShowTree(!showTree)
    }


    const onEditCancel = (needRefresh: boolean) => {
        if (needRefresh) {
            getTreeData();
        }
        setEditTopVisible(false);
    }

    const render = function () {
        const { treeData } = props.noteMenu;
        console.log('====================================');
        console.log(treeData);
        console.log('====================================');

        return (
            <div className={styles.treePanel}>

                <div><HistoryOutlined className={styles.icon} />最新</div>
                <div><StarFilled className={`${styles.favorate} ${styles.icon}`} />收藏夹</div>
                <div className={styles.noteTitle} onClick={handleToggle}><div><BookOutlined className={styles.icon} />笔记本</div><div>{showTree ? <CaretDownOutlined /> : <CaretLeftOutlined />}</div></div>
                <div className={`${styles.tree} ${showTree ? styles.visible : styles.hidden}`}>
                    <DirectoryTree
                        multiple
                        showIcon
                        // switcherIcon={<DownOutlined />}
                        treeData={treeData}
                    />
                </div>
            </div>
            // <div className={styles.main}>
            //     <div className={styles.icon}><SearchOutlined onClick={handleShowSearch} /></div>
            //     <ul onMouseEnter={()=>setIsMenuVisible(true)} onMouseLeave = {()=>setIsMenuVisible(false)}>
            //         {topMenuItem.map(item => {
            //             const isActive = item.id == activeTopId;
            //             return <li key={item.id}
            //                 onClick={() => handleMenuSelect(item.id, item.name)}
            //                 className={`${styles.item} ${isActive ? styles.active : ''}`}
            //             >
            //                 <div className={styles.shortLogo}>
            //                     {item.name.substr(0, 1)}
            //                 </div>
            //                 <div className={`${styles.label} ${isMenuVisible?styles.showLabel:""}`}>{item.name}</div>
            //             </li>
            //         })}
            //     </ul>
            //     <div className={styles.icon}><SettingOutlined onClick={handleShowModal} /></div>

            //     <Modal visible={isModalVisible} closable={false} footer={null} style={{ top: 20 }}>
            //         <div className={styles.modal}>
            //             <div className={styles.title}>
            //                 <span>管理笔记本</span>
            //                 <div className={styles.buttons}>
            //                     <Button type="text" onClick={handleAdd}><PlusCircleOutlined /></Button>
            //                     <Button type="text" onClick={handleCancel}><CloseOutlined /></Button>
            //                 </div>
            //             </div>
            //             <List
            //                 dataSource={topMenuItem}
            //                 renderItem={item => (
            //                     <List.Item
            //                         actions={[<a onClick={() => { handleEdit(item) }}>edit</a>, <a onClick={() => { handleDelete(item.id) }}>delete</a>]}>
            //                         {item.name}
            //                     </List.Item>
            //                 )}
            //             />
            //         </div>
            //     </Modal>
            //     <SeachModal modalVisible={isSearchVisible} onCancel={() => { setIsSearchVisible(false) }} />
            //     <TopForm onCancel={onEditCancel} note={topNote} modalVisible={editTopVisible}></TopForm>
            // </div>
        );
    };
    return render();
};

export default connect(({ note, noteMenu, loading }: { note: NoteModelState, noteMenu: NoteState, loading }) => ({ note, noteMenu, loading }))(TopMenu);
