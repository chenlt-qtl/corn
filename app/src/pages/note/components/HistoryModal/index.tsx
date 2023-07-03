import React, { useState, useEffect } from 'react';
import { Modal, List, Pagination, Spin, Empty } from 'antd';
import { connect } from 'umi';
import HocMedia from "@/components/HocMedia";
import styles from './styles.less';
import { getHistorys, getHistory } from '@/services/note'


const HistoryModal: React.FC = (props, ref) => {

    const { noteId, visible, onCancel } = props;

    const [historyData, setHistoryData] = useState<object[]>([]);
    const [text, setText] = useState<string>("");
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (props.visible) {
            getListData(1);
        }
    }, [props.visible])

    const getListData = async (current:number) => {
        setLoading(true)
        const res = await getHistorys({ noteId, pageNo: current, pageSize: 10 });
        setLoading(false)
        if (res && res.success) {
            const { records, total } = res.result;

            setHistoryData(records);
            setTotal(total);
        }
    }

    const onRowClick = async (id: number) => {
        const res = await getHistory(id);
        if (res && res.success) {
            setText(res.result.text)
        }
    }

    const onPageChange = (page:number) => {
        getListData(page);
    }

    const render = function () {
        return (
            <Modal title="历史记录" visible={visible} onCancel={onCancel}
                footer={null}>
                <Spin spinning={loading}>
                    <div className={styles.container}>
                        <div className={styles.table}>
                            <List
                                size="small"
                                bordered={false}
                                dataSource={historyData}
                                renderItem={(item) => <List.Item style={{ cursor: "pointer" }} onClick={() => { onRowClick(item.id) }}>{item.createTime}</List.Item>}
                            />
                        </div>
                        <div className={styles.page}>
                            <Pagination defaultCurrent={1} onChange={onPageChange} total={total} />
                        </div>

                        <div className={styles.content}>
                            {text ? <pre dangerouslySetInnerHTML={{ __html: text }} ></pre> :
                                <div className={styles.empty}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE}></Empty></div>}
                        </div>
                    </div>
                </Spin>
            </Modal>
        );
    };
    return render();
};

export default HocMedia(connect(({ note, loading }: { note: NoteModelState, loading }) => ({ note, loading }))(HistoryModal));
