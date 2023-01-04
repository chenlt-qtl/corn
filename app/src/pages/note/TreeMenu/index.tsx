import React, { useState, useEffect } from 'react';
import styles from './style.less';
import { connect } from 'umi';
import { queryNote, queryTreeMenu } from '@/services/note'
import Resize from './Resize';
import EditFolderModal from '../components/EditFolderModal';
import NoteList from '../components/NoteList';
import NoteTree from './NoteTree';
import { Button, Spin } from "antd"
import { CaretLeftOutlined } from '@ant-design/icons';
import ChangeParentModal from '../components/ChangeParentModal';
import { NoteNode } from '@/data/note'

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

    const handleRename = (node) => {
        setFolderModalVisible(true);
        setEditNode(node);
    }

    const handleChangeParent = (node) => {
        console.log(node);
        
        setEditNode(node);
        setParentModalVisible(true);
    }

    useEffect(() => {
        queryTreeMenu("0", false).then(({ result }) => {
            const nodes = {
                key: "0",
                title: "文件夹",
                name: "文件夹",
                children: result
            }
            setTreeData([nodes])
        })
    }, [props.note.treeParam]);



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


    const render = function () {

        const loading = props.loading.effects["note/queryMenuTree"] || false;

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

export default connect(({ note, loading }: { note: NoteModelState, loading }) => ({ note, loading }))(TreeMenu);
