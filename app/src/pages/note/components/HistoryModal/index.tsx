import React, { useState, useEffect } from 'react';
import { Modal, List, Pagination, Tree, Divider } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import HocMedia from "@/components/HocMedia";
import styles from './styles.less';
import { getHistorys, getHistory } from '@/services/note'

const HistoryModal: React.FC = (props, ref) => {

    const { noteId, visible, onCancel } = props;

    const [historyData, setHistoryData] = useState<object[]>([]);
    const [text, setText] = useState<string>("");
    const [total, setTotal] = useState<number>(0);
    const [current, setCurrent] = useState<number>(1);

    useEffect(() => {
        initData();
    }, [props.noteId])

    const initData = async () => {
        const res = await getHistorys({ noteId, pageNo: current, pageSize: 10 });
        if (res && res.success) {
            const { records, total } = res.result;

            setHistoryData(records);
            setTotal(total);
        }
    }

    const getHistory = async (id: number) => {
        const res = await getHistory(id);
        if (res && res.success) {
            setText(res.result.text)
        }
    }

    const render = function () {
        return (
            <Modal title="历史记录" visible={visible} onCancel={onCancel}>
                <div className={styles.container}>
                    <div className={styles.table}>
                        <List
                            size="small"
                            bordered
                            dataSource={historyData}
                            renderItem={(item) => <List.Item style={{ cursor: "pointer" }} onClick={() => { getHistory(item.id) }}>{item.createTime}</List.Item>}
                        />
                        <div className={styles.page}>
                            <Pagination defaultCurrent={current} total={total} />
                        </div>
                    </div>
                    <div className={styles.content}>
                        {text ? <div dangerouslySetInnerHTML={{ __html: text }} ></div> : <div className={styles.empty}><InboxOutlined /></div>}
                    </div>
                </div>
            </Modal>
        );
    };
    return render();
};

export default HocMedia(connect(({ note, loading }: { note: NoteModelState, loading }) => ({ note, loading }))(HistoryModal));
