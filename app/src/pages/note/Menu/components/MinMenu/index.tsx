import React, { useState, useEffect } from 'react';
import styles from './style.less';
import { connect } from 'umi';
import EditFolderModal from '../../../components/EditFolderModal';
import { Button, Spin, Modal, notification } from "antd"
import { CaretLeftOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const MinMenu: React.FC = (props, ref) => {

    const [folderModalVisible, setFolderModalVisible] = useState<boolean>(false);

    const [editNode, setEditNode] = useState<object>({});
    const [rootKey, setRootKey] = useState<string>("0")
    const [selectedKey, setSelectedKey] = useState<string>(rootKey)

    const render = function () {

        return (
            <div className={styles.content}>
                <div className={styles.toolbar}>
                    <Button className={styles.back} type='link' icon={<CaretLeftOutlined />} onClick={() => setRootKey("0")} disabled={rootKey == "0"}></Button>
                    <EditFolderModal visible={folderModalVisible} parentId={selectedKey} node={editNode} onCancel={() => setFolderModalVisible(false)}></EditFolderModal>
                </div>
                <div><span className="iconfont" dangerouslySetInnerHTML={{ __html: '&#xe8b1;' }}></span></div>
                <div><span className="iconfont" dangerouslySetInnerHTML={{ __html: '&#xe8b1;' }}></span></div>
            </div>
        );
    };
    return render();
};

export default connect(({ note }: { note: NoteModelState }) => ({ note }))(MinMenu);
