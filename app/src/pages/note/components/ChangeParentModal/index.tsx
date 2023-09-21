import React, { useState, useEffect } from 'react';
import { Modal, message, Card, Tree } from 'antd';
import { connect } from 'umi';
import HocMedia from "@/components/HocMedia";
import styles from './styles.less';

const ChangeParent: React.FC = (props, ref) => {

    const { treeData, node, onCancel, visible } = props;

    const [newParentId, setNewParentId] = useState<number>();

    useEffect(() => {
        setNewParentId(node.parentId)
    }, [node])

    const handleChangeParent = () => {

        if (newParentId == node.parentId || node.id == newParentId) {
            message.error("父节点不能是自己或者原父节点")
        } else {
            props.dispatch({
                type: 'note/updateParent',
                payload: { id: node.id, parentId: newParentId }
            }).then(res => {
                if (res) {
                    if (res.success) {
                        message.success("操作成功")
                        onCancel()
                    } else {
                        message.error(res.message)
                    }
                }
            })
        }
    }

    const onSelect = ([_, id]) => {
        setNewParentId(id)
    }

    const render = function () {
        return (
            <Modal title="移动" visible={visible} onOk={handleChangeParent}
                onCancel={onCancel}>
                <article className={styles.container}>
                    <label>移动到:</label>
                    <Card>
                        <Tree
                            selectedKeys={[newParentId]}
                            blockNode
                            multiple
                            showIcon={false}
                            treeData={treeData}
                            autoExpandParent={false}
                            onSelect={onSelect}
                            fieldNames={{ title: "name" }}
                        />
                    </Card>
                </article>
            </Modal>
        );
    };
    return render();
};

export default HocMedia(connect(({ note, loading }: { note: NoteModelState, loading }) => ({ note, loading }))(ChangeParent));
