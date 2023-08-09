import React from 'react'
import ChoiceQuestion from '@/components/Game/ChoiceQuestion'
import styles from './styles.less';

export default function Game() {
  const answers = ["aa","bb","cc","dd"]
  return (
    <div className={styles.container}>
      <ChoiceQuestion question="corn" answers={answers} rightAnswer={1}></ChoiceQuestion>
    </div>
  )
}
