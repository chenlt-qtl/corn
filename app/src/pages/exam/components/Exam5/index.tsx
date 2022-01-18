import React from 'react';
import styles from './styles.less'
import 'font-awesome/css/font-awesome.min.css';



const Exam6: React.FC<{}> = () => {
    return (

        <div className={styles.container}>
            <form>

                <div className={styles.segment}>
                    <h1>Sign up</h1>
                </div>

                <label>
                    <input type="text" placeholder="Email Address" />
                </label>
                <label>
                    <input type="password" placeholder="Password" />
                </label>
                <button className={styles.red} type="button"><i className="fa fa-lock"></i> Log in</button>

                <div className={styles.segment}>
                    <button className={styles.unit} type="button"><i className="fa fa-arrow-left"></i></button>
                    <button className={styles.unit} type="button"><i className="fa fa-bookmark"></i></button>
                    <button className={styles.unit} type="button"><i className="fa fa-gear"></i></button>
                </div>

                <div className={styles.inputGroup}>
                    <label>
                        <input type="text" placeholder="Email Address" />
                    </label>
                    <button className={styles.unit} type="button"><i className="fa fa-search"></i></button>
                </div>

            </form>
        </div>

    );
};

export default Exam6;
