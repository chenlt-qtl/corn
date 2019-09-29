<template>
  <div>
    <a-form style="margin: 40px auto 0;">
      <result title="添加成功" :is-success="true">
        <div class="information">
          <a-row>
            <a-col :sm="8" :xs="24">标题：</a-col>
            <a-col :sm="16" :xs="24">{{value.name}}</a-col>
          </a-row>
          <a-row>
            <a-col :sm="8" :xs="24">内容：</a-col>
            <a-col :sm="16" :xs="24">{{value.content}}</a-col>
          </a-row>
        </div>
      </result>
    </a-form>
  </div>
</template>

<script>
  import Result from '../../result/Result'

  export default {
    name: "Step3",
    components: {
      Result
    },
    props: {
      value:{
        type: Object
      },
    },
    data () {
      return {
        title:this.name,
        loading: false
      }
    },
  }
</script>
<style lang="scss" scoped>
  .information {
    line-height: 22px;

    .ant-row:not(:last-child) {
      margin-bottom: 24px;
    }
  }
</style>