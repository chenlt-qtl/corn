import React, { useState, useEffect } from 'react';
import styles from './styles.less'
import 'font-awesome/css/font-awesome.min.css';

let onMouseUpListerner = false;

let tempHeight = 100;

const Resize: React.FC<{}> = () => {

    const [height, setHeight] = useState<number>(tempHeight);

    useEffect(() => {
        return () => {
            document.body.removeEventListener('mousemove', onResize);
        }
    }, []);

    const onResize = e => {
        const y = e.movementY
        tempHeight = tempHeight - y;

        if (tempHeight < 5) {
            tempHeight = 5
        }

        if (tempHeight > 290) {
            tempHeight = 290
        }

        setHeight(tempHeight);
        if (!onMouseUpListerner) {
            document.body.addEventListener('mouseup', onMouseUp);
            onMouseUpListerner = true;
        }
        console.log(3);
    }

    const onMouseUp = () => {
        document.body.removeEventListener('mousemove', onResize);
        document.body.removeEventListener('mouseup', onMouseUp);
        onMouseUpListerner = false;
        console.log(1);
        
    }

    const onMouseDown = () => {
        document.body.addEventListener('mousemove', onResize);
        console.log(2);
    }

    return (

        <div className={styles.container}>
            <div className={styles.top}></div>
            <div className={styles.resizeBar} onMouseDown={onMouseDown} ></div>
            <div className={styles.bottom} style={{ height: height + "px" }}></div>
        </div>

    );
};

export default Resize;
