import React from 'react'
import ChoiceQuestion from '@/components/Game/ChoiceQuestion'
import styles from './styles.less';

export default function Game() {
  return (
    <div className={styles.container}>
      <ChoiceQuestion></ChoiceQuestion>
    </div>
  )
}
