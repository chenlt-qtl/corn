<template functional>
  <a-menu-item
    v-if="props.menuInfo.children.length == 0"
    :key="props.menuInfo.key"
  >
    <a-icon v-if="props.menuInfo.parentIds.length == 34" type="book" /><span>{{ props.menuInfo.title }}</span>
  </a-menu-item>
  <a-sub-menu
    v-else-if="props.menuInfo.parentIds.length == 34"
    class="top"
    :key="props.menuInfo.key"
  >
    <span slot="title">
      <a-icon type="book" /><span>{{ props.menuInfo.title }}</span>
    </span>
    <template v-for="item in props.menuInfo.children">
      <a-menu-item
        v-if="item.children.length == 0"
        :key="item.key"
      >
        <span>{{ item.title }}</span>
      </a-menu-item>
      <sub-menu
        v-else
        :key="item.key"
        :menu-info="item"
      />
    </template>
  </a-sub-menu>
  <a-sub-menu
    v-else
    :key="props.menuInfo.key"
  >
    <span slot="title">
      <span>{{ props.menuInfo.title }}</span>
    </span>
    <template v-for="item in props.menuInfo.children">
      <a-menu-item
        v-if="item.children.length == 0"
        :key="item.key"
      >
        <span>{{ item.title }}</span>
      </a-menu-item>
      <sub-menu
        v-else
        :key="item.key"
        :menu-info="item"
      />
    </template>
  </a-sub-menu>
</template>
<script>
  export default {
    props: ['menuInfo'],
  };
</script>

<style>
  .top{
    background-color: rgba(236, 240, 241, 0.41)
  }
</style>
