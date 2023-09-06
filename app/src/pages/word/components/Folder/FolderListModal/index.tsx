import { Modal,List } from 'antd'
import React, { useEffect, useState } from 'react'
import { getFolderList } from '../../../service'

export default function FolderListModal(props) {
    const { visible, onCancel } = props

    const [listData, setListData] = useState<[]>([])
    const [total, setTotal] = useState<number>(0);
    const [pageNo, setPageNo] = useState<number>(5);
    const [pageSize, setPageSize] = useState<number>(20);

    useEffect(() => {
        getListData()
    }, [])

    const getListData = async () => {
        const res = await getFolderList({pageSize,pageNo});
        if (res.success) {
            setListData(res.result.records)
            setTotal(res.result.total)
        }

    }

    return (
        <Modal visible={visible} closable={false}
            onCancel={() => { onCancel(false) }}>
            <List
                size="small"
                bordered
                dataSource={listData}
                pagination={{
                    onChange: page => {
                        setPageNo(page);
                    },
                    showSizeChanger: true,
                    onShowSizeChange: (current, pageSize) => {

                        setPageSize(pageSize);
                        setPageNo(current);
                    },
                    showTotal: total => `共 ${total} 条`,
                    pageSize,
                    total
                }}
                renderItem={item => <List.Item>{item.title}</List.Item>}
            />
        </Modal>
    )
}
