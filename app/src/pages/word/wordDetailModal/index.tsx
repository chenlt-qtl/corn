import React from 'react';
import {  Modal, Button } from 'antd';
import { connect } from 'umi';
import 'font-awesome/css/font-awesome.min.css';
import WordDetail from './WordDetail';


export interface WordDetailProps {
    wordName: string
    articleId: string
    isModalVisible: boolean
    hideWordModal: () => void
}


const wordDetailModal: React.FC<WordDetailProps> = (props) => {
    const { wordName, articleId } = props.match ? props.match.params : props;

    return (
        <Modal title="单词详情" width={660} visible={props.isModalVisible}
            onCancel={() => { props.hideWordModal(); }}
            footer={
                <Button onClick={() => { props.hideWordModal(); }}>
                    关闭
                </Button>
            }>
            <WordDetail wordName={wordName} articleId={articleId}/>
        </Modal>
    );
};

export default connect(({ loading }: { loading }) => (
    { loading }))(wordDetailModal);