import { EditOutlined, StarOutlined, PlayCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { List, Card, Button, Input } from 'antd';
import React, { useState, useEffect } from 'react';
import { ArticleItem } from './data.d';
import { getArticleList } from './service';
import CreateForm from './components/CreateForm';

const { Search } = Input;

const getActions = (item: ArticleItem): React.ReactNode[] => {
    const actions = [
        <StarOutlined />,
        <EditOutlined />,];
    if (item.mp3) {
        actions.push(<PlayCircleOutlined />);
    }
    return actions;
}

const TableList: React.FC<{}> = () => {

    const [listData, setListData] = useState<ArticleItem[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [createModalVisible, handleModalVisible] = useState<boolean>(false);

    useEffect(() => {
        getTableData();
    }, [])

    const getTableData = ()=>{
        getArticleList().then(({ result }) => {
            setListData(result.records);
            setTotal(result.total);
        });
    }

    return (
        <>
            <Card>
                <Search placeholder="input search text" style={{ width: 200, marginRight: '20px' }} />
                <Button shape="circle" type="primary" onClick={() => handleModalVisible(true)}>
                    <PlusOutlined />
                </Button>

                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        onChange: page => {
                            console.log(page);
                        },
                        pageSize: 5,
                        total
                    }}
                    dataSource={listData}
                    renderItem={item => (
                        <List.Item
                            key={item.title}
                            actions={getActions(item)}
                            extra={item.picture ?
                                <img
                                    width={100}
                                    alt="logo"
                                    src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                /> : ''
                            }
                        >
                            <List.Item.Meta
                                title={<a>{item.title}</a>}
                            />
                        </List.Item>
                    )}
                />
            </Card>
            <CreateForm onCancel={() => {getTableData();handleModalVisible(false)}} modalVisible={createModalVisible}>
            </CreateForm>
        </>
    );
};

export default TableList;
