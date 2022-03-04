import React, { useState, useEffect } from 'react';
import { WordCnItem } from '@/data/word';
import styles from './styles.less'
import { getCnWordByGameLevel, getRandWord } from '@/services/game';
import star from '@/assets/diamond.svg';
import starGray from '@/assets/diamond_gray.svg';
import starBg from '@/assets/diamond_bg.svg';
import starGrayBg from '@/assets/diamond_gray_bg.svg';
import { bihua } from '@/utils/constants';

let questions: object[] = [];

const CnGame: React.FC<{}> = (props) => {

    const [wordList, setWordList] = useState<WordCnItem[]>([]);
    const [randList, setRandList] = useState<WordCnItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [qaIndex, setQaIndex] = useState<number>(0);//第几题
    const [questionNum, setQuestionNum] = useState<number>(0);//问题数量
    const [question, setQuestion] = useState<object>({});//题目
    const [answerIndex, setAnswerIndex] = useState<number>(-1);//答案
    const [rightNum, setRightNum] = useState<number>(0);//正确的题数

    useEffect(() => {
        let urlParams = props.match.params;
        getData(urlParams.id);
    }, [])

    useEffect(() => {
        if (wordList && wordList.length > 0 && randList && randList.length > 0) {
            genQustions();
        }
    }, [wordList, randList])

    const getData = async (id: string) => {
        if (id) {
            const res = await getCnWordByGameLevel(id);
            if (res && res.success) {
                const list = res.result.records;
                setWordList(list);
            }

            const res1 = await getRandWord(id);
            if (res1 && res1.success) {
                const list = res1.result;
                setRandList(list);
            }
        }

    }

    const genQustions = () => {
        //笔顺        
        questions = [];
        wordList.map(item => {
            //笔画
            const num = Math.ceil(Math.random() * item.biHuaShu!);
            let rightIndex = Math.floor(Math.random() * 4);
            const rightAnswer: string = item.biShun!.split("")[num - 1];

            let answers: string[] = [];
            [...Array(4).keys()].forEach((_, index) => {

                if (index == rightIndex) {
                    answers.push(rightAnswer)
                } else {
                    while (true) {
                        const answer = bihua[Math.floor(Math.random() * 5)]
                        if (answer != rightAnswer && !(answers.includes(answer))) {
                            answers.push(answer)
                            break;
                        }
                    }
                }
            })

            // questions.push({ wordName: item.wordName, question: "的第" + num + "画是?", answers, rightIndex })
            //拼音
            rightIndex = Math.floor(Math.random() * 4);
            answers = [];
            [...Array(4).keys()].forEach((_, index) => {

                if (index == rightIndex) {
                    answers.push(item.pinYin!)
                } else {
                    while (true) {
                        const randWord = randList[Math.floor(Math.random() * 5)]
                        if (randWord.wordName != item.wordName && !(answers.includes(randWord.pinYin!))) {
                            answers.push(randWord.pinYin!)
                            break;
                        }
                    }
                }
            })
            // questions.push({ wordName: item.wordName, question: "", answers, rightIndex })

            //意思
            rightIndex = Math.floor(Math.random() * 4);
            answers = [];
            const list = [...randList];
            [...Array(4).keys()].forEach((_, index) => {

                if (index == rightIndex) {
                    answers.push(getAcceptation(item))
                } else {
                    while (true) {
                        const randWord = list.splice(Math.floor(Math.random() * list.length), 1);
                        console.log(list.length);

                        if (randWord && randWord[0].wordName != item.wordName) {
                            console.log(randWord);

                            answers.push(getAcceptation(randWord[0]))
                            break;
                        }
                    }
                }
            })
            function getAcceptation(word: WordCnItem) {
                if (word.shortAcce) {
                    return word.shortAcce
                }
                // console.log(word.acceptation);

                const acceptations = word.acceptation?.split("|") || [];
                if (acceptations.length > 1) {
                    return acceptations[1].split("。").reduce((result, item) => {
                        const stocks = item.split(".");
                        let words;
                        if (stocks.length > 1) {
                            words = stocks[1].split("：")
                        } else {
                            words = stocks[0].split("：")
                        }
                        if (words.length > 0) {
                            if (result) {
                                result += ","
                            }
                            result += words[0]
                        }

                        return result;
                    }, "");


                }
            }

            questions.push({ wordName: item.wordName, question: "", answers, rightIndex })

        })
        setQuestion(questions[0]);
        setQaIndex(0);
        setQuestionNum(questions.length);
        setLoading(false);
    }

    const handleAnswer = (index: number) => {
        let time = 1000;
        if (answerIndex == -1) {

            if (index == question.rightIndex) {
                setRightNum(rightNum + 1);
                time = 100;
            }
            setAnswerIndex(index);

            setTimeout(() => {
                setQaIndex(qaIndex + 1);
                if (qaIndex < questionNum - 1) {
                    setAnswerIndex(-1);
                    setQuestion(questions[qaIndex + 1])
                }
            }, time);
        }
    }

    let score = rightNum * 100 / (questionNum * 0.9);
    score = score > 100 ? 100 : score;

    return (

        <div className={styles.outer}>
            {loading ? <div>loading</div> :
                <div className={styles.main}>
                    <header>
                        <div className={styles.time}>
                            <span className={styles.start1}>
                                {score >= 50 ?
                                    <><img src={star} /><img src={starBg} /></>
                                    :
                                    <><img src={starGray} /><img src={starGrayBg} /></>}
                            </span>
                            <span className={styles.start2}>
                                {score >= 80 ?
                                    <><img src={star} /><img src={starBg} /></>
                                    :
                                    <><img src={starGray} /><img src={starGrayBg} /></>}
                            </span>
                            <span className={styles.start3}>
                                {score >= 90 ?
                                    <><img src={star} /><img src={starBg} /></>
                                    :
                                    <><img src={starGray} /><img src={starGrayBg} /></>}
                            </span>
                            <div className={styles.bar} style={{ width: score + "%" }}>
                            </div>
                        </div>
                    </header>
                    <section className={styles.content}>
                        {questionNum == qaIndex ? <div>
                            {score >= 50 ? "挑战成功!" : "挑战失败"}
                        </div> :
                            <>
                                <div className={styles.wordName}>{question.wordName}</div>
                                <div className={styles.question}>{question.question}</div>
                                <ul className={`${styles.answer} `}>
                                    {question.answers.map((item, index) => {
                                        let className = "";
                                        if (answerIndex != -1) {
                                            if (answerIndex == index && index == question.rightIndex) {
                                                className = styles.right
                                            } else {
                                                if (answerIndex == index && index != question.rightIndex) {
                                                    className = styles.wrong
                                                } else if (answerIndex != index && index == question.rightIndex) {
                                                    className = styles.right
                                                }
                                            }
                                        }
                                        return <li key={index} className={className} onClick={() => handleAnswer(index)}><span>{item}</span></li>
                                    })}
                                </ul>
                                <div className={styles.text}>{qaIndex + 1}/{questionNum}</div>
                            </>
                        }
                    </section>
                </div>}
        </div>
    );
};

export default CnGame;
