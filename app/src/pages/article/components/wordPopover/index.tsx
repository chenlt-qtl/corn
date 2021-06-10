import React from 'react';
import { Popover } from 'antd';
import 'font-awesome/css/font-awesome.min.css';

import WordShortDetail from '../wordShortDetail'



export interface WordPopoverProps {
    wordName: string;
}


const WordPopover: React.FC<WordPopoverProps> = (props) => {

    const content = (
        <WordShortDetail wordName={props.wordName}></WordShortDetail>
    );

    return (
        <>
            <Popover content={content} placement="bottomLeft" >
                {props.children}
            </Popover>
        </>
    );
};

export default WordPopover;