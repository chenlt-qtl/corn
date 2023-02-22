import React, { useState } from 'react';
import { connect, WordState } from 'umi';
import { Input, Tabs, Button } from 'antd';
import { SearchOutlined, ContainerOutlined, ReadOutlined, ExperimentOutlined, HomeOutlined } from '@ant-design/icons';
import styles from './styles.less';
import { Link } from 'umi'
import WordDetail from './wordDetailModal/WordDetail';


const { TabPane } = Tabs;
const WordIndex: React.FC<{}> = (props) => {

    const [left, setLeft] = useState<string>("0");
    const [searchStr, setSearchStr] = useState<string>("");

    const [wordName, setWordName] = useState<string>("");
    const [showDetail, setShowDetail] = useState<boolean>(false);

    const onChange = (key: string) => {
        if (key == "1") {
            setLeft("0")
        } else {
            setLeft("-100%")
        }

    }

    const onSearch = () => {
        setWordName(searchStr);
        setShowDetail(true);
    }


    const render = function () {

        return (
            <div className={styles.wi_container}>

                <div className={styles.wi_searchBar} style={showDetail?{marginBottom:"0px"}:{}}>
                    {showDetail ? <Button size='large' onClick={() => setShowDetail(false)} type="link"><HomeOutlined /></Button> : ""}
                    <Input
                        size={showDetail ? "middle" : "large"}
                        placeholder="Search..."
                        prefix={<SearchOutlined className="site-form-item-icon" />}
                        value={searchStr} onChange={e => setSearchStr((e.target.value||"").trim())} onPressEnter={onSearch}

                    />
                </div>
                <div className={styles.wi_body}>
                    {showDetail ? <WordDetail wordName={wordName} articleId="0"></WordDetail> :
                        <div>
                            <div className={styles.wi_tab}>
                                <Tabs defaultActiveKey="1" onChange={onChange}>
                                    <TabPane tab="英语" key="1">
                                    </TabPane>
                                    <TabPane tab="中文" key="2">
                                    </TabPane>
                                </Tabs>
                            </div>
                            <div className={styles.wi_menus}>
                                <div className={styles.wi_trans} style={{ left: left }}>
                                    <div className={styles.wi_menu}>
                                        <div className={styles.wi_item}>
                                            <ContainerOutlined />
                                            <Link to="/article/list">文章列表</Link>
                                        </div>
                                        <div className={styles.wi_item}>
                                            <ReadOutlined />
                                            <Link to="">生字本</Link>
                                        </div>
                                        <div className={styles.wi_item}>
                                            <ExperimentOutlined />
                                            <Link to="">背单词</Link>
                                        </div>
                                    </div>
                                    <div className={styles.wi_menu}>
                                        <div className={styles.wi_item}>
                                            <ContainerOutlined />
                                            <Link to="/article/list">文章列表</Link>
                                        </div>
                                        <div className={styles.wi_item}>
                                            <ReadOutlined />
                                            <Link to="">生字本</Link>
                                        </div>
                                        <div className={styles.wi_item}>
                                            <ExperimentOutlined />
                                            <Link to="">认生字</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>}
                </div>
            </div>
        );
    }
    return render();
};


export default connect(({ word, loading }: { word: WordState, loading }) => (
    { word, loading })
)(WordIndex);