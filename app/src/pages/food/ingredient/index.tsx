import React, { useState, useEffect } from 'react';
import styles from './styles.less'
import { getIngredientList } from "@/services/food"
import { List, Icon, Button } from 'antd';
import EditForm from './EditForm';
import { PlusOutlined } from '@ant-design/icons';

const Ingredient: React.FC<{}> = () => {

    const [pageNo, setPageNo] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [ingredientList, setIngredientList] = useState<API.Ingredient[]>([]);
    const [ingredient, setIngredient] = useState<API.Recipe>({});
    const [modalVisible, setModalVisible] = useState<boolean>(false)

    useEffect(() => {
        initData()
    }, [])

    const initData = async () => {
        const res = await getIngredientList({ pageSize, pageNo });
        if (res.success) {
            const records = res.result.records;
            setIngredientList(records);
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

    const openEditModal = (data: API.Recipe) => {
        setIngredient(data);
        setModalVisible(true);
    }

    return (
        <div className={styles.container}>
            <div className={styles.toolbar}>
                <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={() => openEditModal({})} />
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
                dataSource={ingredientList}
                renderItem={item => (
                    <List.Item
                        key={item.id}
                        actions={[
                            <IconText type="star-o" text="156" key="list-vertical-star-o" />,
                            <IconText type="like-o" text="156" key="list-vertical-like-o" />,
                            <IconText type="message" text="2" key="list-vertical-message" />,
                        ]}
                    >
                        <a onClick={()=>openEditModal(item)}>{item.name}</a>
                    </List.Item>
                )}
            />

            <EditForm data={ingredient} modalVisible={modalVisible} onCancel={onCancel}></EditForm>

        </div>
    );
};

export default Ingredient;
