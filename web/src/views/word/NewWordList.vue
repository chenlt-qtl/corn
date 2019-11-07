<template>
  <word-list ref="list">
    <a-button type="primary" style="float: right;margin-left: 5px;" @click="back">
      <a-icon type="left" />返回列表
    </a-button>
  </word-list>
</template>

<script>
  import WordList from './components/WordList'

  export default {
    name: "NewWordList",
    components: {
      WordList,
    },
    mounted(){
      this.$refs.list.loadData("word/word/list");
    },
    methods: {
      back() {
        this.$router.push({ path: '/blank/word/articleList' });
      },
    }
  }
</script>
