<template>
  <div>

    <span v-for="sentence in words">
        <span v-for="word in sentence">
          {{word.text}}
        </span>
    </span>
    <a-button :loading="loading" type="primary" @click="nextStep">提交</a-button>
    <a-button style="margin-left: 8px" @click="prevStep">上一步</a-button>
  </div>
</template>

<script>
  export default {
    name: "Step2",
    data () {
      return {
        loading: false,
        words: [],
      }
    },
    methods: {
      nextStep (words) {
        console.log(words);
        this.words = words;
      },
      prevStep () {
        this.$emit('prevStep')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .stepFormText {
    margin-bottom: 24px;

    .ant-form-item-label,
    .ant-form-item-control {
      line-height: 22px;
    }
  }

</style>