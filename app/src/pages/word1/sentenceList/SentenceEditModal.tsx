import React, { useState, useEffect, Fragment } from 'react';
import { Form, Input, Modal, Steps, Button, Spin, InputNumber } from 'antd';
import styles from './styles.less';
import { SentenceItem, ArticleItem } from '@/data/word';
import { saveSentence } from '@/services/article';
import ImgUpload from '../components/ImgUpload'
import Mp3Upload from '../components/Mp3Upload'
import { brReg, DisplaySentence, splipSentences, timeIntervalReg as reg } from '@/utils/wordUtils'
import { connect, WordState } from 'umi';
import Mp3Time from './Mp3Time';

const { TextArea } = Input;
const FormItem = Form.Item;
const { Step } = Steps;

export interface SentenceProps {
    single: boolean;
    sentence: SentenceItem;
    articleId: string;
    modalVisible: boolean;
    hasArticleMp3: boolean;//文章有没有mp3文件
    onPlay: (object) => void;
    onCancel: (reload: boolean) => void;
}


const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};

const SentenceEditModal: React.FC<SentenceProps> = (props) => {
    const { modalVisible, onCancel, sentence = {}, articleId, single, hasArticleMp3, onPlay } = props;

    const [currentStep, setCurrentStep] = useState<number>(0);
    const [selectWords, setSelectWords] = useState<string[]>([]);
    const [sentences, setSentences] = useState<DisplaySentence[]>([]);
    const [loading, setLoading] = useState<boolean>(false);


    const [form] = Form.useForm();

    useEffect(() => {
        form.resetFields();
        form.setFieldsValue(sentence);
        setCurrentStep(0);
        setSelectWords([...props.word.wordNames]);
    }, [modalVisible])

    const handleNext = async () => {
        const formValue = await form.validateFields();
        const wordNames = props.word.wordNames;

        if (currentStep === 0) {
            setCurrentStep(currentStep + 1);
            setSentences(splipSentences(formValue.content.replace(reg, "").split(brReg), 0));
        } else {//提交 
            setLoading(true);
            const article: ArticleItem = { id: articleId, type: 0 };
            article.sentences = sentences.map(sentence => {
                return {
                    ...sentence,
                    content: sentence.allWords.reduce((total: string, item) => {
                        const text = item.text;
                        total += text;
                        if (!item.text.endsWith(" ")) {
                            total += " ";
                        }
                        return total;
                    }, " "),
                }
            })
            article.addWordNames = selectWords.filter(word => !wordNames.includes(word));
            article.removeWordNames = wordNames.filter(word => !selectWords.includes(word));
            if (single && article.sentences) {
                article.sentences[0] = formValue;
                if (sentence.id) {
                    article.sentences[0].id = sentence.id;
                }
            }
            const res = await saveSentence(article);
            if (res) {
                handleCancel(true);
            }
            setLoading(false);
        }
    };

    const handleCancel = (reload: boolean) => {
        onCancel(reload);
    }

    const backward = () => setCurrentStep(currentStep - 1);

    const handleClickWord = (word: string) => {
        var index = selectWords.indexOf(word.toLowerCase());
        if (index > -1) {
            selectWords.splice(index, 1);
        } else {
            selectWords.push(word.toLowerCase());
        }
        setSelectWords([...selectWords]);
    }

    const renderFooter = () => {
        if (currentStep === 1) {
            return (
                <>
                    <Button onClick={() => handleCancel(false)}>取消</Button>
                    <Button onClick={backward}>
                        上一步
                    </Button>
                    <Button type="primary" onClick={handleNext} loading={loading}>
                        完成
                    </Button>
                </>
            );
        }
        return (
            <>
                <Button onClick={() => handleCancel(false)}>取消</Button>
                <Button type="primary" onClick={handleNext}>
                    下一步
                </Button>
            </>
        );
    };
    let key = 0;

    return (
        <Modal
            title={sentence.id ? "修改句子" : (single ? "增加句子" : "批量增加句子")}
            visible={modalVisible}
            onCancel={() => handleCancel(false)}
            style={{ top: 20 }}
            footer={renderFooter()}
            onOk={handleNext}
        >
            <Spin spinning={loading}>
                <Steps style={{ marginBottom: 28 }} size="small" current={currentStep}>
                    <Step title="输入句子" />
                    <Step title="选择生词" />
                    <Step title="完成" />
                </Steps>
                <Form
                    {...formLayout}
                    form={form}
                >

                    <div style={{ display: currentStep == 0 ? "block" : "none" }}>
                        <FormItem name="content" label="内容"
                            rules={[{ required: true, message: '请输入内容！' }]}>
                            <TextArea rows={single ? 4 : 10}></TextArea>
                        </FormItem>
                        {/* 批量和单个增加表单不一样 */}
                        {single ? <>
                            <FormItem name="picture" label="图片">
                                <ImgUpload></ImgUpload>
                            </FormItem>
                            <FormItem name="mp3" label="音频">
                                <Mp3Upload></Mp3Upload>
                            </FormItem>
                            <FormItem name="idx" label="序号">
                                <InputNumber></InputNumber>
                            </FormItem>
                            <FormItem name="acceptation" label="释义">
                                <TextArea></TextArea>
                            </FormItem>
                            {hasArticleMp3 ? <FormItem name="mp3Time" label="音频时间">
                                <Mp3Time onPlay={onPlay} />
                            </FormItem> : ""}
                        </> : <span className={styles.tip}>不同句子请用回车分隔</span>}

                    </div>
                    <div style={{ display: currentStep == 0 ? "none" : "block" }} className={styles.words}>
                        {
                            sentences.map(item =>
                            (<p key={++key}>
                                {item.allWords.map(({ text, isWord }) => {
                                    return isWord ? <span key={++key} className={selectWords.includes(text.toLowerCase()) ? styles.selected : null}
                                        onClick={() => { handleClickWord(text) }} >{text}</span> :
                                        <Fragment key={++key}>{text}{brReg.test(text) ? <br key={++key} /> : ''}</Fragment>
                                }

                                )}
                            </p>)
                            )
                        }
                    </div>
                </Form>
            </Spin>
        </Modal>
    );
};

export default connect(({ word }: { word: WordState }) => (
    { word })
)(SentenceEditModal);