import React, { useState, useEffect } from 'react';
import { List, Form, Input, message, Button, Modal, Spin } from 'antd';
import { getRecipe, getIngredientList, createRecipeRel } from '@/services/food';
import styles from './styles.less'
import { PlusOutlined } from '@ant-design/icons'

interface editProps {
    onCancel: (reload: boolean) => void;
    recipeId: number
}

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 }
};


const EditForm = React.forwardRef((props: editProps, ref) => {
    const { onCancel, recipeId } = props;

    const [recipe, setRecipe] = useState<API.Recipe>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [pageNo, setPageNo] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(200);
    const [ingredientList, setIngredientList] = useState<API.Ingredient[]>([]);
    const [ingredientId, setIngredientId] = useState<number>(0);

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [amountVisible, setAmountVisible] = useState<boolean>(false);

    const [amount, setAmount] = useState<string>("");

    const [form] = Form.useForm();

    useEffect(() => {
        getRecipeData();
    }, [recipeId])

    useEffect(() => {
        initData();
        getRecipeData();
    }, [])

    const initData = async () => {
        const res = await getIngredientList({ pageSize, pageNo })
        if (res.success) {
            const records = res.result.records;
            console.log(records);

            setIngredientList(records);
        }
    }

    const getRecipeData = async () => {

        const res = await getRecipe(recipeId);
        if (res.success) {
            setRecipe(res.result);
            form.setFieldsValue(res.result);
        }
    }

    const handleSaveRel = async () => {
        setLoading(true);
        const relData = { recipeId: recipe.id, ingredientId, amount }

        const res = await createRecipeRel(relData);
        setLoading(false);
        if (res && res.success) {
            message.success("操作成功")
            onCancel(true);
        } else {
            message.error('保存失败');
        }

    }

    const showAmount = (id) => {
        setIngredientId(id)
        setAmount("")
        setAmountVisible(true)
    }

    const showAdd = () => {
        setModalVisible(true)
    }

    const saveRecipe = () => {

    }

    return (
        <Spin spinning={loading}>
            <div className={styles.toolbar}>
                <Button type="primary" onClick={() => saveRecipe} >保存</Button>
            </div>
            <Form
                {...layout}
                form={form}
            >
                <Form.Item
                    label="名称"
                    name="name"
                    rules={[{ required: true, message: '请输入名称' }]}
                >
                    <Input />
                </Form.Item>
            </Form>
            <List
                size="small"
                header={<div>食材</div>}
                footer={<div><Button type="primary" onClick={showAdd}>增加</Button></div>}
                bordered
                dataSource={recipe.recipeRelVoList}
                renderItem={item => <List.Item>{item.name}<span className={styles.ammount}>{item.amount}</span></List.Item>}
            />
            <Modal
                title="增加食材"
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                style={{ top: 20 }}
            >
                <List
                    size="small"
                    header={<div>食材</div>}
                    bordered
                    dataSource={ingredientList.filter(item => recipe.recipeRelVoList.filter(i => i.ingredientId == item.id).length == 0)}
                    renderItem={item => <List.Item> <Button type="link" onClick={() => showAmount(item.id)}><PlusOutlined /></Button>{item.name}</List.Item>}
                />

            </Modal>
            <Modal
                title=""
                visible={amountVisible}
                onCancel={() => setAmountVisible(false)}
                style={{ top: 30 }}
                width={200}
                footer={<Button type="primary" onClick={handleSaveRel}>增加</Button>}
            >
                <article>
                    <label className={styles.amount}>数量:</label><Input value={amount} onChange={e => setAmount(e.currentTarget.value)}></Input>
                </article>

            </Modal>
        </Spin>
    );
});

export default EditForm;
