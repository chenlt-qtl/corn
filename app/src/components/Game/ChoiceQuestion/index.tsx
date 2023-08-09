import React, { useState } from 'react'
import styles from './styles.less';

const ChoiceQuestion = (props) => {

  const [answer, setAnswer] = useState<number>(0);

  const { question, rightAnswer, answers } = props;
  return (
    <div className={styles.container}>
      <div className={styles.question}>
        {question}
      </div>
      <ul className={styles.answer}>
        {answers.map((i, index) => {
          let className = "";
          if (answer) {
            if (rightAnswer == index + 1) {
              className = styles.green
            }
            else if (answer == index + 1) {
              className = styles.red
            }
          }

          return <li className={className}
            onClick={() => !answer && setAnswer(index + 1)} key={index}>i</li>
        })}

      </ul>

    </div>
  )
}

export default ChoiceQuestion;
