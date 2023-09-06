import { StarOutlined, PlayCircleOutlined, PlusOutlined, DeleteOutlined, UnorderedListOutlined, AppstoreOutlined, EllipsisOutlined } from '@ant-design/icons';
import { List, Button, Input, Popconfirm } from 'antd';
import { Link } from 'umi';
import React, { useState, useEffect, useRef } from 'react';
import { ArticleItem } from '@/data/word';
import { getArticleList, removeArticle } from '@/services/article';
import styles from './styles.less'
import ArticleEditModal from '../articleEditModal'
import FolderListModal from '../components/Folder/FolderListModal'

const { Search } = Input;

const ArticleList: React.FC<{}> = () => {

    const [listData, setListData] = useState<ArticleItem[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [pageNo, setPageNo] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(20);
    const [searchStr, setSearchStr] = useState<string>("");
    const [createModalVisible, handleModalVisible] = useState<boolean>(false);
    const createForm = useRef();
    const [showPic, setShowPic] = useState<boolean>(false);
    const [folderVisible, setFolderVisible] = useState<boolean>(false);
    

    useEffect(() => {
        getTableData();
    }, [])


    useEffect(() => {
        getTableData();
    }, [pageNo, pageSize, searchStr])

    const getTableData = () => {
        getArticleList({ type: 0, pageSize, pageNo, title: searchStr }).then(res => {
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

    const handleSearch = value => {
        setPageNo(1)
        setSearchStr(value)

    }

    return (
        <>
            <div className={styles.content}>
                <div className={styles.bar}>
                    <div style={{display:"flex",gap:"20px"}}>
                        <Search placeholder="input search text" onSearch={handleSearch} style={{ width: 200}} />
                        <Button shape="circle" type="primary" onClick={handleAdd}>
                            <PlusOutlined />
                        </Button>
                        <Button onClick={()=>setFolderVisible(true)}>文件夹<EllipsisOutlined /></Button>
                    </div>
                    <div>
                        <Button type="link" onClick={() => setShowPic(false)} className={showPic ? styles.noActive : ""}>
                            <UnorderedListOutlined />
                        </Button>
                        <Button type="link" onClick={() => setShowPic(true)} className={showPic ? "" : styles.noActive}>
                            <AppstoreOutlined />
                        </Button>
                    </div>
                </div>
                <List
                    itemLayout={showPic ? "vertical" : "horizontal"}
                    size="large"
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
                    dataSource={listData}
                    renderItem={item => (
                        <List.Item
                            key={item.id}
                            actions={getActions(item)}
                            extra={item.picture && showPic ?
                                <img
                                    width={100}
                                    src={item.picture}
                                /> : ''
                            }
                        >
                            <List.Item.Meta
                                title={<Link to={`/page/article/${item.id}`}>{item.title}</Link>}
                            />
                        </List.Item>
                    )}
                />
            </div>
            <ArticleEditModal ref={createForm} onCancel={(reload: boolean) => { reload && getTableData(); handleModalVisible(false) }} modalVisible={createModalVisible}>
            </ArticleEditModal>

            <FolderListModal onCancel={(reload: boolean) => { reload && getTableData(); setFolderVisible(false) }} visible={folderVisible}>
            </FolderListModal>
        </>
    );
};

export default ArticleList;
