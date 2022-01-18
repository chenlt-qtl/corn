import React, { useState, useImperativeHandle, useEffect } from 'react';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Modal, Form, Input, message, Radio, List, Divider, Button, Checkbox } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { addGame, updateGame, getEnWordByGame, getCnWordByGame, relWithWords } from '@/services/game';
import { getArticleList } from "@/services/article";
import { WordItem } from '@/data/word'
import { GameItem } from '@/data/game'
import styles from './styles.less'




interface CreateFormProps {
  modalVisible: boolean;
  onCancel: (reload: boolean) => void;
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 }
};


const CreateForm = React.forwardRef((props: CreateFormProps, ref) => {
  const { modalVisible, onCancel } = props;


  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [checkedArticle, setCheckedArticle] = useState<string[]>([]);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const [game, setGame] = useState<GameItem>({});
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNo, setPageNo] = useState<number>(1);
  const [wordData, setWordData] = useState<WordItem[]>([]);
  const [articleData, setArticleData] = useState<Object[]>([]);

  const [form] = Form.useForm();


  useEffect(() => {
    getWordList(pageSize,pageNo);
    setCheckedArticle([]);
  }, [game.id])

  useEffect(() => {
    getArticleData();
  }, [game.type])

  const getWordList = async (pageSize:number,pageNo:number) => {

    if (game.id) {
      if (game.type) {
        const res = await getCnWordByGame({gameId:game.id,pageSize,pageNo});
        setWordData(res.result.records);
        setTotal(res.result.total);
      } else {
        const res = await getEnWordByGame({gameId:game.id,pageSize,pageNo});
        setWordData(res.result.records);
        setTotal(res.result.total);
      }
    }

  }

  const getArticleData = async () => {

    if (game.id) {
      const res = await getArticleList({ type: game.type! });
      setArticleData(res.result.records);
    }

  }

  const handleSaveWord = async () => {
    setConfirmLoading(true);
    const res = await relWithWords({ id: game.id, articleIds: checkedArticle });
    setConfirmLoading(false);
    if (res.success) {
      setAddVisible(false)
      setCheckedArticle([]);
      const result = res.result;
      if (result && result.length > 0) {
        message.success('保存成功,成功添加 ' + result);
        getWordList();
      } else {
        message.info('所选的文章对应的单词均已经添加。')
      }

    } else {
      message.error('保存失败');
    }

  }

  const handleSaveGame = async () => {
    setConfirmLoading(true);
    let value = await form.validateFields();
    let result;
    if (game.id) {
      value = { ...game, ...value };
      result = await updateGame(value);
    } else {
      result = await addGame(value);
    }
    if (result) {
      if (result.success) {
        message.success('保存成功!');
        onCancel(true);
      } else {
        message.error(result.message);
      }
    }
    setConfirmLoading(false);
  }

  const addWord = () => {
    setAddVisible(true)
  }

  const onCheckChange = (e, articleId: string) => {
    const checked = e.target.checked;
    let articleIds;
    if (checked) {
      articleIds = [articleId, ...checkedArticle];
    } else {
      articleIds = checkedArticle.filter(item => item != articleId);
    }

    setCheckedArticle(articleIds);
  }

  useImperativeHandle(ref, () => ({
    setFormValue: (value: GameItem) => {
      const { gameName, type, comment } = value;
      setGame(value);
      form.setFieldsValue({ gameName, type, comment });

    }
  }), []);

  return (
    <>
      <Modal
        title="增加游戏"
        visible={modalVisible}
        onCancel={() => { onCancel(false) }}
        style={{ top: 20 }}
        onOk={handleSaveGame}
        confirmLoading={confirmLoading}
      >
        <Form
          {...layout}
          form={form}
          name="game"
        >
          <Form.Item
            label="名字"
            name="gameName"
            rules={[{ required: true, message: 'Please input your title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="类型"
            name="type"
            rules={[{ required: true }]}
            initialValue={0}
          >
            <Radio.Group disabled={game.id ? true : false}>
              <Radio value={0}>英语</Radio>
              <Radio value={1}>中文</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="备注"
            name="comment"
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
        {game.id ?
          <div>
            <div className={styles.listTitle}>
              <Divider orientation="left">生字列表</Divider>
              <div className={styles.toolbar}>

                <Button type="link" onClick={addWord}>
                  <PlusCircleOutlined />
                </Button>

              </div>
            </div>
            <List
              itemLayout="horizontal"
              pagination={{
                onChange: page => {
                  setPageNo(page);
                  getWordList(pageSize,page);
                },
                pageSize: pageSize,
                current:pageNo,
                total,
                size:"small",
                showTotal:(total)=>`共${total}条`,
                showSizeChanger:true,
                onShowSizeChange:(_,size)=>{
                  setPageSize(size);
                  getWordList(size,pageNo);
                }
              }}
              dataSource={wordData}
              renderItem={item => (
                <List.Item
                  key={item.id}
                >
                  <List.Item.Meta
                    title={item.wordName}
                  />
                </List.Item>
              )}
            />
          </div>
          : ""}
      </Modal>
      <Modal
        title="选择文章"
        visible={addVisible}
        onCancel={() => { setAddVisible(false) }}
        style={{ top: 20 }}
        onOk={handleSaveWord}
        confirmLoading={confirmLoading}
      >
        <List
          size="small"
          bordered
          dataSource={articleData}
          renderItem={item => <List.Item><Checkbox checked={(checkedArticle.find(id => id == item.id)) ? true : false} onChange={e => onCheckChange(e, item.id)}>{item.title}</Checkbox></List.Item>}
        />
      </Modal>
    </>
  );
});

export default CreateForm;
