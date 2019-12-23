<template>
  <div style="max-height: 400px;overflow-y: auto;">
    <span v-for="sentence in sentences">
      <span :class="{'word_select':word.selected}" class="word_span" v-for="word in sentence.words">
        {{word.wordName}}
      </span>
      .<br/>
    </span>
  </div>
</template>

<script>
  export default {
    name: "Sentence",
    props: {
      sentences: {
        type: Array
      },
    },
  }
</script>

<style scoped>
  .words_div{
    margin: 30px 20px;
    font-size: 18px;
    font-weight: bold;
  }

  .word_span{
    display: inline-block;
    margin: 1px;
    padding: 0 2px 2px 2px;
    cursor: pointer;
    border:2px solid #fff;
  }

  .word_select {
    background-color: #E1F0FD;
    border-radius: 6px;
    border:2px solid #1890FF;
  }
</style>