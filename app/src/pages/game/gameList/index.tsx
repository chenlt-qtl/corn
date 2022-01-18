import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { List, Button, Input, Popconfirm } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { GameItem } from '@/data/game';
import styles from './styles.less'
import { getGameList } from '@/services/game'
import CreateForm from './CreateForm';


const { Search } = Input;

const GameList: React.FC<{}> = () => {

    const [listData, setListData] = useState<GameItem[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [createModalVisible, handleModalVisible] = useState<boolean>(false);
    const createForm = useRef();

    useEffect(() => {
        getTableData();
    }, [])

    const getTableData = async () => {

        const res = await getGameList();
        setListData(res.result.records);
        setTotal(res.result.total);

    }

    const handleDel = (id: string) => {

    }

    
    const handleView = (game:GameItem) => {
        createForm.current.setFormValue(game);
        handleModalVisible(true);
    }

    const handleAdd = () => {
        createForm.current.setFormValue({});
        handleModalVisible(true);
    }

    return (
        <div className={styles.outside}>
            <div className={styles.content}>
                <Search placeholder="input search text" style={{ width: 200, marginRight: '20px' }} />
                <Button shape="circle" type="primary" onClick={handleAdd}>
                    <PlusOutlined />
                </Button>

                <List
                    itemLayout="horizontal"
                    pagination={{
                        onChange: page => {
                        },
                        pageSize: 5,
                        total
                    }}
                    dataSource={listData}
                    renderItem={item => (
                        <List.Item
                            key={item.id}
                            actions={[<Popconfirm
                                title="确认要删除这篇文章?"
                                onConfirm={() => { handleDel(item.id!) }}
                                okText="是"
                                cancelText="否"
                            >
                                <DeleteOutlined />
                            </Popconfirm>]}
                        >
                            <List.Item.Meta
                                title={<a onClick={()=>handleView(item)}>{item.gameName}</a>} 
                            />
                        </List.Item>
                    )}
                />
                <CreateForm ref={createForm} onCancel={(reload: boolean) => { reload && getTableData(); handleModalVisible(false) }} modalVisible={createModalVisible}>
                </CreateForm>
            </div>
        </div>
    );
};

export default GameList;
