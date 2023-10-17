import React, { useState } from 'react';
import { connect, WordState } from 'umi';
import { Input, Tabs, Button } from 'antd';
import { SearchOutlined, ContainerOutlined, HomeOutlined } from '@ant-design/icons';
import styles from './styles.less';
import { Link } from 'umi'
import WordDetail from '../wordDetailModal/WordDetail';

const data = {
    "en": [{ title: "文章列表", url: "/page/article/list" },
    { title: "生字本", url: "" },
    { title: "背单词", url: "" }],
    "cn": [{ title: "文章列表", url: "/page/wordChinese" },
    { title: "生字本", url: "" },
    { title: "认生字", url: "" }],
}

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

                <div className={styles.wi_searchBar} style={showDetail ? { marginBottom: "0px" } : {}}>
                    {showDetail ? <Button size='large' onClick={() => setShowDetail(false)} type="link"><HomeOutlined /></Button> : ""}
                    <Input
                        size={showDetail ? "middle" : "large"}
                        placeholder="Search..."
                        prefix={<SearchOutlined className="site-form-item-icon" />}
                        value={searchStr} onChange={e => setSearchStr((e.target.value || "").trim())} onPressEnter={onSearch}

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
                                        {data["en"].map(({ title, url }) => <Link to={url}>
                                            <div className={styles.wi_item}>
                                                <ContainerOutlined />
                                                {title}
                                            </div>
                                        </Link>)}
                                    </div>
                                    <div className={styles.wi_menu}>
                                        {data["cn"].map(({ title, url }) => <Link to={url}>
                                            <div className={styles.wi_item}>
                                                <ContainerOutlined />
                                                {title}
                                            </div>
                                        </Link>)}
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