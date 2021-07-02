import { StarOutlined, PlayCircleOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { List, Button, Input, Popconfirm } from 'antd';
import { Link } from 'umi';
import React, { useState, useEffect, useRef } from 'react';
import { ArticleItem } from '../data';
import { getArticleList, removeArticle } from '../service';
import styles from './styles.less'
import ArticleEditModal from '../articleEditModal'

const { Search } = Input;

const ArticleList: React.FC<{}> = () => {

    const [listData, setListData] = useState<ArticleItem[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [createModalVisible, handleModalVisible] = useState<boolean>(false);
    const createForm = useRef();

    useEffect(() => {
        getTableData();
    }, [])

    const getTableData = () => {
        getArticleList().then(res => {
            if (res) {
                setListData(res.result.records);
                setTotal(res.result.total);
            }
        });
    }

    const handleDel = (id: string) => {
        removeArticle(id).then(() => {
            getTableData();
        })
    }

    const handleAdd = () => {
        createForm.current.setFormValue({});
        handleModalVisible(true);
    }

    const getActions = (item: ArticleItem): React.ReactNode[] => {
        const actions = [<StarOutlined />];
        if (item.mp3) {
            actions.push(<PlayCircleOutlined />);
        }
        actions.push(
            <Popconfirm
                title="确认要删除这篇文章?"
                onConfirm={() => { handleDel(item.id) }}
                okText="是"
                cancelText="否"
            >
                <DeleteOutlined />
            </Popconfirm>
        );
        return actions;
    }

    return (
        <>
            <div className={styles.content}>
                <Search placeholder="input search text" style={{ width: 200, marginRight: '20px' }} />
                <Button shape="circle" type="primary" onClick={handleAdd}>
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
                            key={item.id}
                            actions={getActions(item)}
                            extra={item.picture ?
                                <img
                                    width={100}
                                    src={item.picture}
                                /> : ''
                            }
                        >
                            <List.Item.Meta
                                title={<Link to={`/word/${item.id}`}>{item.title}</Link>}
                            />
                        </List.Item>
                    )}
                />
            </div>
            <ArticleEditModal ref={createForm} onCancel={(reload: boolean) => { reload && getTableData(); handleModalVisible(false) }} modalVisible={createModalVisible}>
            </ArticleEditModal>
        </>
    );
};

export default ArticleList;
