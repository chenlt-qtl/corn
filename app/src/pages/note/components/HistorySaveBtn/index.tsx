import React, { useState } from 'react';
import { Modal, Button, Input, message } from 'antd';
import { connect } from 'umi';
import { VerticalAlignBottomOutlined } from '@ant-design/icons';
import { addNoteHistory } from '@/services/note'


const HistorySaveModal: React.FC = (props, ref) => {

    const { id, text } = props;

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");

    const openSaveModal = () => {
        setIsOpen(true)
        setTitle("")
    }

    const onSave = async () => {
        const res = await addNoteHistory({ noteId: id, text, title })
        if (res.success) {
            message.success("保存成功")
            setIsOpen(false)
        }
    }

    const render = function () {
        return (
            <>
                <Button key="save" onClick={() => {
                    openSaveModal();
                }} type='text'><VerticalAlignBottomOutlined /></Button>
                <Modal closable={false} title="" visible={isOpen} onOk={onSave} onCancel={() => setIsOpen(false)}>
                    <div style={{ display: "flex", alignItems: "center" }}> <div style={{ width: "100px", textAlign: "right" }}>标题： </div>
                        <Input value={title} onChange={e => setTitle(e.target.value)} /></div>
                </Modal >
            </>
        );
    };
    return render();
};

export default connect(({ note: { openedNote: { id, text } }, loading }) => ({ id, text, loading }))(HistorySaveModal);
