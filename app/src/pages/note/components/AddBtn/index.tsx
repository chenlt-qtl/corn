import React from 'react';
import { Button, Menu, Dropdown, message } from 'antd';
import { PlusOutlined, FolderOutlined, FileMarkdownOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import styles from './styles.less'


const AddBtn: React.FC = (props, ref) => {

    const { size, onAddFolder } = props;


    const handleAddNote = ({ key }) => {
        const { listParentId } = props.note;

        if (!listParentId || isNaN(listParentId)) {
            message.error("请选中要增加的文件夹")
            return
        }
        if (key == "1") {//文件夹
            onAddFolder();
        } else {
            props.dispatch({
                type: 'note/refreshOpenedNote',
                payload: { name: "新文档", text: "", isLeaf: true, parentId: listParentId }
            })


        }
    }

    const menu = (
        <Menu onClick={handleAddNote}>
            <Menu.Item key="1" icon={<FolderOutlined />}>文件夹</Menu.Item>
            <Menu.Item key="2" icon={<FileMarkdownOutlined />}>笔记</Menu.Item>
        </Menu>
    );


    const render = function () {

        const small = size == "small";

        return (
            <div className={small ? styles.small : ""}>
                <Dropdown overlay={menu} trigger={['click']}>
                    <Button type={small ? "link" : "primary"} shape="round" icon={<PlusOutlined />}>{small ? "" : "增加"}</Button>
                </Dropdown>
            </div>
        );
    };
    return render();
};

export default connect(({ note }: { note: NoteModelState }) => ({ note }))(AddBtn);
