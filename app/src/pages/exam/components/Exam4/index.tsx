import React, { useState } from 'react';
import styles from './styles.less'
import 'font-awesome/css/font-awesome.min.css';


const tabs = [{ key: 1, text: "Mercury" },
{ key: 2, text: "Venus" },
{ key: 3, text: "Earth" },
{ key: 4, text: "Mars" }]

const Exam4: React.FC<{}> = () => {
    const [activeKey, setActiveKey] = useState<number>(3);
    const [isDark, setIsDark] = useState<boolean>(false);
    return (
        <div className={isDark ? styles.darkmode : ""} style={{ height: "100%" }}>
            <div id="container" className={styles.container}>
                <div id="tabs" className={styles.tabsContainer}>

                    <div className={styles.tabs}>
                        {tabs.map(item => <a key={item.key} className={`${styles.tab} ${item.key == activeKey ? styles.active : ""}`}
                            onClick={() => setActiveKey(item.key)}>{item.text}</a>)}
                    </div>

                    <div className={styles.content}>
                        <div id="tabcontent1" data-tab="1" className={`${styles.tabcontent} ${1 == activeKey ? styles.active : ""}`}>
                            <p>Mercury is the smallest and innermost planet in the Solar System.</p>
                            <p>Its orbit around the Sun takes 87.97 days, the shortest of all the planets in the Solar System.</p>
                            <p>It is named after the Roman deity Mercury, the messenger of the gods.</p>
                            <p className={styles.readMoreLink}><a href="#" target="_blank">Learn more<span className={styles.icon}>➡️</span></a></p>
                        </div>
                        <div id="tabcontent2" data-tab="2" className={`${styles.tabcontent} ${2 == activeKey ? styles.active : ""}`}>
                            <p>Venus is the second planet from the Sun. It is named after the Roman goddess of love and beauty.</p>
                            <p>Venus orbits the Sun every 224.7 Earth days.</p>
                            <p>As the second-brightest natural object in the night sky after the Moon, Venus can cast shadows and, rarely, is visible to the naked eye in broad daylight.</p>
                            <p className={styles.readMoreLink}><a href="#" target="_blank">Learn more<span className={styles.icon}>➡️</span></a></p>
                        </div>
                        <div id="tabcontent3" data-tab="3" className={`${styles.tabcontent} ${3 == activeKey ? styles.active : ""}`}>
                            <p>Earth is the third planet from the Sun.</p>
                            <p>Earth orbits around the Sun in 365.256 days, a period known as an Earth sidereal year. During this time, Earth rotates about its axis about 366.256 times.</p>
                            <p>Earth's axis of rotation is tilted with respect to its orbital plane, producing seasons on Earth.</p>
                            <p className={styles.readMoreLink}><a href="#" target="_blank">Learn more<span className={styles.icon}>➡️</span></a></p>
                        </div>
                        <div id="tabcontent4" data-tab="4" className={`${styles.tabcontent} ${4 == activeKey ? styles.active : ""}`}>
                            <p>Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System after Mercury.</p>
                            <p> In English, Mars carries a name of the Roman god of war and is often referred to as the 'Red Planet'. The latter refers to the effect of the iron oxide prevalent on Mars' surface.</p>
                            <p>Mars is a terrestrial planet with a thin atmosphere.</p>
                            <p className={styles.readMoreLink}><a href="#" target="_blank">Learn more<span className={styles.icon}>➡️</span></a></p>
                        </div>
                    </div>

                </div>

                <div className={styles.darkModeSwitch}>
                    <label className={styles.switchLabel} htmlFor="dark-mode-switch">Dark mode</label>
                    <label className={styles.switch}>
                        <input type="checkbox" id="dark-mode-switch" onChange={e => {
                            setIsDark(e.target.checked)
                        }} />
                        <span className={styles.slider}></span>
                    </label>
                </div>

            </div>



            <div className={styles.smallScreen}>
                <div className={styles.smallScreenContent}>
                    <p>You're going to need a bigger display my friend.</p>
                    <p className={styles.readMoreLink}><a href="#" target="_blank">Learn more<span className={styles.icon}>➡️</span></a></p>
                </div>
            </div>
        </div>
    );
};

export default Exam4;
