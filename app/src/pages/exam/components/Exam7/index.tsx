import React from 'react';
import styles from './styles.less'
import 'font-awesome/css/font-awesome.min.css';



const Exam7: React.FC<{}> = () => {
    return (

        <div className={styles.main}>
            <div className={styles.container}>
                <label className={styles.checkbox}>
                    <div className={styles.toggle}>
                        <input className={styles.toggleState} type="checkbox" name="check" value="check" />
                        <div className={styles.indicator}></div>
                    </div>
                    <div className={styles.labelText}>no more emails plz</div>
                </label>
                <button type="button" className={styles.neumorphicBtn}>Button</button>
                <div>
                    <div className={styles.neumorphicProgress}>
                        <div className={styles.back}></div>
                        <div className={styles.line}></div>
                    </div>
                    <div className={styles.neumorphicSlider}>
                        <div className={styles.back}></div>
                        <div className={styles.line}></div>
                        <div className={styles.thumb}></div>
                        <div className={styles.popover}>40%</div>
                    </div>
                </div>
                <div className={styles.center}>
                    <button type="button" className={`${styles.neumorphicBtn} ${styles.neumorphicCheckbox}`}></button>
                    <button type="button" className={`${styles.neumorphicBtn} ${styles.neumorphicCheckbox} ${styles.boxActive}`}></button>
                    <label className={styles.neumorphicText}>Do you have Tripophobia?</label>
                </div >
            </div >
            <div className={styles.container}>
                <div className={styles.neumorphicCard}>
                    <label className={styles.label} htmlFor="login__input">Login</label>
                    <input className={styles.input} id="login__input" type="text" />
                    <label className={styles.label} htmlFor="password_input">Password</label>
                    <input className={styles.input} id="password_input" type="text" />
                    <button type="button" className={styles.neumorphicBtn}>Log in</button>
                </div >
            </div >
            <div className={`${styles.container} ${styles.cardCollection}`}>
                <div className={styles.neumorphicCard}>
                    <div className={styles.outer}>
                        <img className={styles.neumorphicImage} height="300" src="https://images.unsplash.com/photo-1562883676-8c7feb83f09b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=661&q=80" />
                    </div>
                    <div className={styles.title}>Barcelona</div>
                    <div className={styles.text}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
                </div>
                <div className={styles.neumorphicCard}>
                    <div className={styles.outer}>
                        <img className={styles.neumorphicImage} height="300" src="https://images.unsplash.com/photo-1517824488624-8d6e5cdbf991?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80" />
                    </div>
                    <div className={styles.title}>Stockholm</div>
                    <div className={styles.text}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
                </div><div className={styles.neumorphicCard}>
                    <div className={styles.outer}>
                        <img className={styles.neumorphicImage} height="300" src="https://images.unsplash.com/photo-1517736996303-4eec4a66bb17?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80" />
                    </div>
                    <div className={styles.title}>Amsterdam</div>
                    <div className={styles.text}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
                </div>
            </div >
            <div className={styles.container}>
                <div className={styles.neumorphicOuter}>
                    <div className={styles.controls}>
                        <div className={`${styles.control} ${styles.active}`} data-target="barcelona">Barcelona</div>
                        <div className={styles.control} data-target="stockholm">Stockholm</div>
                        <div className={styles.control} data-target="amsterdam">Amsterdam</div>
                    </div>
                    <div className={`${styles.inner} ${styles.shown}`} id="barcelona">
                        <img className={styles.neumorphicImage} height="300" src="https://images.unsplash.com/photo-1562883676-8c7feb83f09b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=661&q=80" />
                        <div className={styles.textLeft}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
                    </div >
                    <div className={styles.inner} id="stockholm">
                        <img className={styles.neumorphicImage} height="300" src="https://images.unsplash.com/photo-1517824488624-8d6e5cdbf991?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80" />
                        <div className={styles.textLeft}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
                    </div >
                    <div className={styles.inner} id="amsterdam">
                        <img className={styles.neumorphicImage} height="300" src="https://images.unsplash.com/photo-1517736996303-4eec4a66bb17?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80" />
                        <div className={styles.textLeft}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
                    </div >
                </div >
            </div >
            <div className={styles.bottom}>
                <div className={styles.neumorphicCard} style={{ minWidth: "300px" }}>
                    <div className={styles.wrapper}>
                        <img className={styles.neumorphicImage} src="https://images.unsplash.com/photo-1517824488624-8d6e5cdbf991?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80" width="100" />
                    </div>
                    <h4 className={styles.title}>Emily Blunt</h4>
                    <div className={styles.text}>British-American actress. I hope nobody minds me using picture of her, she's just pretty.</div>
                </div >
                <div className={styles.neumorphicCard} style={{ minWidth: "300px" }}>
                    <div className={styles.wrapper}>
                        <div className={styles.placeholder}>JD</div>
                    </div>
                    <h4 className={styles.title}>John Doe</h4>
                    <div className={styles.text}>Name instance for somebody abstract. At least you won't get charged fee for him.</div>
                </div >
            </div >

        </div >

    );
};

export default Exam7;
