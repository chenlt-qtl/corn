import React from 'react'
import styles from './styles.less'

export default function Exam11(props) {
  return (
    <div className={styles.container}>
        <div className={styles.bg}>
            <span></span><span></span><span></span>
        </div>
        <div className={styles.glass}>
            <div className={styles.text}>login</div>
            <input type="text" placeholder='UserId' />
            <input type="password" placeholder='Password'></input>
            <button>→</button>
        </div>
    </div>
  )
}
