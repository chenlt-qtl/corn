import React, { useState, useEffect, Fragment } from 'react';
import { Form, Input, Modal, Steps, Button, Spin } from 'antd';
import styles from './styles.less';
import { SentenceItem, ArticleItem, WordItem } from '../../data';
import { saveSentence, getWordBySentence } from '../../service';
import ImgUpload from '../ImgUpload'
import Mp3Upload from '../Mp3Upload'


const { TextArea } = Input;
const FormItem = Form.Item;
const { Step } = Steps;

export interface SentenceProps {
    single: boolean;
    sentence: SentenceItem;
    articleId: string;
    modalVisible: boolean;
    onCancel: (reload: boolean) => void;
}

interface DisplaySentence {
    id?: string;
    content?: string;
    mp3?: string;
    picture?: string;
    allWords: { text: string, isWord: boolean }[]
}

const formLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 18 },
};

const EditModal: React.FC<SentenceProps> = (props) => {
    const { modalVisible, onCancel, sentence = {}, articleId, single } = props;

    const [currentStep, setCurrentStep] = useState<number>(0);
    const [selectWords, setSelectWords] = useState<string[]>([]);
    const [sentences, setSentences] = useState<DisplaySentence[]>([]);
    const [picture, setPicture] = useState<string>('');
    const [mp3, setMp3] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const [form] = Form.useForm();

    const brReg = /[\n]+/;

    useEffect(() => {
        console.log(sentence);
        form.setFieldsValue(sentence);
        setCurrentStep(0);
        if (sentence.id) {
            const { picture = '', mp3 = '' } = sentence;
            setPicture(picture);
            setMp3(mp3);
            setLoading(true);
            getWordBySentence(sentence.id).then(res => {
                if (res && res.result) {
                    const { records } = res.result;
                    setSelectWords(records.map((item: WordItem) => item.wordName));
                }
                setLoading(false);
            });
        }
    }, [sentence])

    const handleNext = async () => {
        const formValue = await form.validateFields();

        if (currentStep === 0) {
            setCurrentStep(currentStep + 1);
            parseSentences(formValue.content);
        } else {//提交 
            setLoading(true);
            const article: ArticleItem = { id: articleId };
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
                    words: sentence.allWords.filter(item => selectWords.includes(item.text.toLowerCase())).map(item => ({ wordName: item.text }))
                }
            })
            if (single && article.sentences[0]) {
                mp3 && (article.sentences[0].mp3 = mp3);
                picture && (article.sentences[0].picture = picture);
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

    const handleImgChange = (value: string) => {
        setPicture(value);
    };

    const handleMp3Change = (value: string) => {
        setMp3(value);
    };

    //获取选择单词界面
    const parseSentences = (content: string) => {
        const sentenceStrs = single ? [content] : content.split(brReg);
        const sentences: DisplaySentence[] = [];

        let patt = /([a-z|'|-]+)/ig;
        let r = null;
        setSentences(sentenceStrs.reduce((sentences, item) => {
            const sentence: DisplaySentence = { allWords: [] };
            let index = 1;
            while (r = patt.exec(item)) {
                const word = r[0];
                sentence.allWords.push({ text: word, isWord: true });
                if (r.index > index) {
                    sentence.allWords.push({ text: item.slice(index, r.index), isWord: false });
                }
                index = r.index + word.length;
            }
            if (index < item.length) {
                sentence.allWords.push({ text: item.slice(index), isWord: false });
            }
            sentences.push(sentence);
            return sentences;
        }, sentences));
    }

    const renderFooter = () => {
        if (currentStep === 1) {
            return (
                <>
                    <Button onClick={() => handleCancel(false)}>取消</Button>
                    <Button onClick={backward}>
                        上一步
                    </Button>
                    <Button type="primary" onClick={handleNext}>
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
                    {currentStep === 0 ?
                        <>
                            <FormItem name="content" label="内容"
                                rules={[{ required: true, message: '请输入内容！' }]}>
                                <TextArea rows={single ? 4 : 10}></TextArea>
                            </FormItem>
                            {/* 批量和单个增加表单不一样 */}
                            {single ? <>
                                <FormItem name="picture" label="图片">
                                    <ImgUpload
                                        picture={picture}
                                        onChange={handleImgChange}
                                    >
                                    </ImgUpload>
                                </FormItem>
                                <FormItem name="mp3" label="音频">
                                    <Mp3Upload mp3={mp3}
                                        onChange={handleMp3Change}></Mp3Upload>
                                </FormItem>
                            </> : <span className={styles.tip}>不同句子请用回车分隔</span>}

                        </> :
                        <div className={styles.words}>
                            {
                                sentences.map(item =>
                                (<p key={++key}>
                                    {item.allWords.map(({ text, isWord }) =>
                                        isWord ? <span key={++key} className={selectWords.includes(text.toLowerCase()) ? styles.selected : null}
                                            onClick={() => { handleClickWord(text) }} >{text}</span> :
                                            <Fragment key={++key}>{text}{brReg.test(text) ? <br key={++key} /> : ''}</Fragment>

                                    )}
                                </p>)
                                )
                            }
                        </div>
                    }
                </Form>
            </Spin>
        </Modal>
    );
};

export default EditModal;
