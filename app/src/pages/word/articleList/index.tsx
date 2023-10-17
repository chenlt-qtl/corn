import { StarOutlined, PlayCircleOutlined, PlusOutlined, DeleteOutlined, LeftOutlined } from '@ant-design/icons';
import { List, Button, Input, Popconfirm } from 'antd';
import { Link } from 'umi';
import React, { useState, useEffect, useRef } from 'react';
import { ArticleItem } from '@/data/word';
import { getArticleList, removeArticle } from '@/services/article';
import styles from './styles.less'
import ArticleEditModal from '../components/ArticleEditModal'

const { Search } = Input;

const ArticleList: React.FC<{}> = props => {

    const { match: { params: { type: typeStr } }, history } = props;
    const type = typeStr == "cn" ? 1 : 0;


    const [listData, setListData] = useState<ArticleItem[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [createModalVisible, handleModalVisible] = useState<boolean>(false);

    useEffect(() => {
        getTableData();
    }, [])

    const getTableData = () => {
        getArticleList({ type }).then(res => {
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
                <Button type="link" onClick={() => history.go(-1)}>
                    <LeftOutlined />
                </Button>
                <Search placeholder="input search text" style={{ width: 200, marginRight: '20px' }} />
                <Button shape="circle" type="primary" onClick={handleAdd}>
                    <PlusOutlined />
                </Button>

                <List
                    itemLayout="vertical"
                    size="large"
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
                            actions={getActions(item)}
                            extra={item.picture ?
                                <img
                                    width={100}
                                    src={item.picture}
                                /> : ''
                            }
                        >
                            <List.Item.Meta
                                title={<Link to={`/page/word/article/${item.id}`}>{item.title}</Link>}
                            />
                        </List.Item>
                    )}
                />
            </div>
            <ArticleEditModal onCancel={(reload: boolean) => {
                reload && getTableData();
                handleModalVisible(false)
            }} modalVisible={createModalVisible}>
            </ArticleEditModal>
        </>
    );
};

export default ArticleList;
