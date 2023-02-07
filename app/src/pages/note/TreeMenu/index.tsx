import React, { useState, useEffect } from 'react';
import styles from './style.less';
import { connect } from 'umi';
import { queryNote, queryTreeMenu } from '@/services/note'
import Resize from './Resize';
import EditFolderModal from '../components/EditFolderModal';
import NoteList from '../components/NoteList';
import NoteTree from './NoteTree';
import { Button, Spin, Modal, notification } from "antd"
import { CaretLeftOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import ChangeParentModal from '../components/ChangeParentModal';
import { NoteNode } from '@/data/note'

const { confirm } = Modal;
let tempHeight = localStorage.getItem("filesHeight") || 400;
let onMouseUpListerner = false;

const TreeMenu: React.FC = (props, ref) => {

    const [folderModalVisible, setFolderModalVisible] = useState<boolean>(false);
    const [parentModalVisible, setParentModalVisible] = useState<boolean>(false);

    const [editNode, setEditNode] = useState<object>({});
    const [rootKey, setRootKey] = useState<string>("0")
    const [selectedKey, setSelectedKey] = useState<string>(rootKey)
    const [height, setHeight] = useState<number>(tempHeight);
    const [treeData, setTreeData] = useState<NoteNode[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const handleRename = (node) => {
        setFolderModalVisible(true);
        setEditNode(node);
    }

    const handleChangeParent = (node) => {
        setEditNode(node);
        setParentModalVisible(true);
    }

    useEffect(() => {
        reloadAllTreeData()
    }, [props.note.treeParam]);


    const reloadAllTreeData = () => {
        setLoading(true)
        queryTreeMenu("0", false).then(({ result }) => {
            const nodes = {
                key: "0",
                title: "文件夹",
                name: "文件夹",
                children: result
            }
            setTreeData([nodes])
            setLoading(false)
        })
    }


    const onResize = e => {
        const y = e.movementY
        tempHeight = tempHeight - y;
        setHeight(tempHeight);
        localStorage.setItem("filesHeight", tempHeight);
        if (!onMouseUpListerner) {
            document.body.addEventListener('mouseup', onMouseUp);
            onMouseUpListerner = true;
        }
    }

    const onMouseUp = () => {
        document.body.removeEventListener('mousemove', onResize);
        document.body.removeEventListener('mouseup', onMouseUp);
        onMouseUpListerner = false;
    }

    const handleDelete = (node) => {
        confirm({
            title: `确定要删除 ${node.title}?`,
            icon: <ExclamationCircleOutlined />,
            onOk() {

                props.dispatch({
                    type: 'note/deleteNote',
                    payload: node.key,
                }).then(() => {
                    notification["info"]({
                        message: '删除成功',
                    });
                    reloadAllTreeData();
                });
            }
        });
    }


    const render = function () {

        return (

            <Spin spinning={loading} wrapperClassName={styles.content}>
                <div className={styles.toolbar}>
                    <Button className={styles.back} type='link' icon={<CaretLeftOutlined />} onClick={() => setRootKey("0")} disabled={rootKey == "0"}></Button>
                    <EditFolderModal visible={folderModalVisible} parentId={selectedKey} node={editNode} onCancel={() => setFolderModalVisible(false)}></EditFolderModal>
                </div>
                <div className={styles.tree}>
                    <NoteTree
                        handleRename={handleRename}
                        handleChangeParent={handleChangeParent}
                        selectedKey={selectedKey}
                        rootKey={rootKey}
                        setSelectedKey={setSelectedKey}
                        setRootKey={setRootKey}
                        treeData={treeData}
                        onDelete={handleDelete}
                    ></NoteTree>
                </div>
                <Resize resize={onResize}></Resize>
                <div className={styles.files} style={{ height: height + "px" }}>
                    <NoteList getDataMethod={queryNote} params={props.note.listParam} handleChangeParent={handleChangeParent}></NoteList>
                </div>
                <ChangeParentModal treeData={treeData} node={editNode} onCancel={() => setParentModalVisible(false)} visible={parentModalVisible}></ChangeParentModal>
            </Spin >
        );
    };
    return render();
};

export default connect(({ note }: { note: NoteModelState }) => ({ note }))(TreeMenu);
