import React, { useEffect } from 'react';
import styles from './style.less';


const Resize: React.FC = (props, ref) => {


    useEffect(() => {
        return () => {
            document.body.removeEventListener('mousemove', props.resize);
        }
    }, []);


    const onMouseDown = () => {
        document.body.addEventListener('mousemove', props.resize);
    }

    const render = function () {

        return (

            <div className={styles.resizeBar} onMouseDown={onMouseDown} ></div>
        );
    };
    return render();
};

export default Resize;
