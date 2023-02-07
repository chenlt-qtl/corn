import React, { useState, useEffect } from 'react';
import styles from './styles.less'
import { getRecipeList, getRecipe } from "@/services/food"
import { List, Icon, Button } from 'antd';
import EditForm from './EditForm';
import { PlusOutlined } from '@ant-design/icons';

const Recipe: React.FC<{}> = () => {

    const [pageNo, setPageNo] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [recipeList, setRecipeList] = useState<API.Recipe[]>([]);
    const [recipeId, setRecipeId] = useState<number>(0);
    const [modalVisible, setModalVisible] = useState<boolean>(false)

    useEffect(() => {
        initData()
    }, [])

    const initData = async () => {
        const res = await getRecipeList({ pageSize, pageNo });
        if (res.success) {
            const records = res.result.records;
            setRecipeList(records);
        }

    }

    const IconText = ({ type, text }) => (
        <span>
            <Icon type={type} style={{ marginRight: 8 }} />
            {text}
        </span>
    );

    const onCancel = (reload: boolean) => {
        if (reload) {
            initData();
        }
        setModalVisible(false);
    }

    const openEditModal = async (id: number) => {
        if (id) {
            setRecipeId(id);
            setModalVisible(true);
        }
    }

    return (
        <div className={styles.container}>

            {modalVisible ?
                <EditForm recipeId={recipeId} modalVisible={modalVisible} onCancel={onCancel}></EditForm> :
                <>
                    <div className={styles.toolbar}>
                        <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={() => openEditModal()} />
                    </div>
                    <List
                        itemLayout="vertical"
                        size="large"
                        pagination={{
                            onChange: page => {
                                console.log(page);
                            },
                            pageSize: 3,
                        }}
                        dataSource={recipeList}
                        renderItem={item => (
                            <List.Item
                                key={item.id}
                                actions={[
                                    <IconText type="star-o" text="156" key="list-vertical-star-o" />,
                                    <IconText type="like-o" text="156" key="list-vertical-like-o" />,
                                    <IconText type="message" text="2" key="list-vertical-message" />,
                                ]}
                                extra={
                                    <img
                                        width={120}
                                        alt="logo"
                                        src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                    />
                                }
                            >
                                <a onClick={() => openEditModal(item.id)}>{item.name}</a>
                            </List.Item>
                        )}
                    /></>}

        </div>
    );
};

export default Recipe;
