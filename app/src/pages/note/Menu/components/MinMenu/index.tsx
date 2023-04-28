import React, { useState } from 'react';
import styles from './style.less';
import { connect } from 'umi';
import EditFolderModal from '../../../components/EditFolderModal';
import { menuData, isFolder } from '../../../utils'
import 'font-awesome/css/font-awesome.min.css';

const MinMenu: React.FC = (props, ref) => {

    const [folderModalVisible, setFolderModalVisible] = useState<boolean>(false);

    const [editNode, setEditNode] = useState<object>({});

    const render = function () {
        const { listParentId } = props.note;
        const { onChangeMenuType } = props;
        const activeId = isFolder(listParentId) ? "0" : listParentId;


        return (
            <div className={styles.content}>
                <div className={styles.toolbar}>
                    <EditFolderModal size="small" visible={folderModalVisible} parentId={listParentId} node={editNode} onCancel={() => setFolderModalVisible(false)}></EditFolderModal>
                </div>
                {
                    menuData.filter(i => !i.hide).map(menu => <div key={menu.id} className={`${styles.menuItem} ${activeId == menu.id ? styles.active : ""}`} onClick={() => {
                        props.dispatch({ type: "note/refreshListParentId", payload: menu.id })
                    }}>
                        {menu.icon}
                    </div>)
                }
                <div className={`${styles.menuItem} ${styles.toggler}`} onClick={() => onChangeMenuType(3)}>
                    <span className='iconfont' dangerouslySetInnerHTML={{ __html: '&#xe88c;' }}></span>
                </div>
            </div>
        );
    };
    return render();
};

export default connect(({ note }: { note: NoteModelState }) => ({ note }))(MinMenu);
