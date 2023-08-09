import React from 'react'
import styles from './styles.less';

export default function ChoiceQuestion() {
  return (
    <div className={styles.container}>
        <div className={styles.question}>
            question
        </div>
        <ul className={styles.answer}>
            <li>a</li>
            <li>a</li>
            <li>a</li>
            <li>a</li>
        </ul>

    </div>
  )
}
