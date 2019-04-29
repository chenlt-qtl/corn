<template>
  <!-- , width: fixedHeader ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'  -->
  <a-layout-header
    v-if="!headerBarFixed"
    :class="[fixedHeader && 'ant-header-fixedHeader', sidebarOpened ? 'ant-header-side-opened' : 'ant-header-side-closed', ]"
    :style="{ padding: '0' }">

    <div class="header" :class="theme">

      <div class="logo">
        <router-link :to="{name:'blank'}">
          <img src="~@/assets/corn.svg" alt="logo">
          <h1>Welcome to corn</h1>
        </router-link>
      </div>

      <user-menu :theme="theme"/>
    </div>

  </a-layout-header>
</template>

<script>
  import UserMenu from '../tools/UserMenu'

  import { mixin } from '@/utils/mixin.js'
  import { topNavScrollToSelectItem } from '@/utils/util'

  export default {
    name: 'HomeHeader',
    components: {
      UserMenu,
    },
    mixins: [mixin],
    props: {
      mode: {
        type: String,
        // sidemenu, topmenu
        default: 'sidemenu'
      },
      menus: {
        type: Array,
        required: true
      },
      theme: {
        type: String,
        required: false,
        default: 'dark'
      },
      collapsed: {
        type: Boolean,
        required: false,
        default: false
      },
      device: {
        type: String,
        required: false,
        default: 'desktop'
      }
    },
    data() {
      return {
        headerBarFixed: false,
        //update-begin--author:sunjianlei---date:20190408------for: 顶部导航栏增加横向滚动条-----
        topMenuStyle: {
          headerIndexLeft: {},
          topNavHeader: {},
          headerIndexRight: {},
          scrollView: {
            'overflow-x': 'auto',
            'overflow-y': 'hidden'
          },
          scrollWidth: {
            // 设置这么宽是为了让顶部菜单首次加载时充分展开，方便计算真实宽度
            'width': '10000px'
          }
        }
      }
    },
    watch: {
      /** 监听设备变化 */
      device() {
        if (this.mode === 'topmenu') {
          this.buildTopMenuStyle()
        }
      },
      /** 监听导航栏模式变化 */
      mode(newVal) {
        if (newVal === 'topmenu') {
          this.calcTopMenuScrollWidth()
        }
      }
    },
    //update-end--author:sunjianlei---date:20190408------for: 顶部导航栏增加横向滚动条-----
    mounted() {
      window.addEventListener('scroll', this.handleScroll)
      //update-begin--author:sunjianlei---date:20190408------for: 顶部导航栏增加横向滚动条-----
      if (this.mode === 'topmenu') {
        this.buildTopMenuStyle()
        this.calcTopMenuScrollWidth()
      }
      //update-end--author:sunjianlei---date:20190408------for: 顶部导航栏增加横向滚动条-----
    },
    methods: {
      handleScroll() {
        if (this.autoHideHeader) {
          let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
          if (scrollTop > 100) {
            this.headerBarFixed = true
          } else {
            this.headerBarFixed = false
          }
        } else {
          this.headerBarFixed = false
        }
      },
      toggle() {
        this.$emit('toggle')
      },
      //update-begin--author:sunjianlei---date:20190408------for: 顶部导航栏增加横向滚动条-----
      buildTopMenuStyle() {
        if (this.mode === 'topmenu') {
          if (this.device === 'mobile') {
            // 手机端需要清空样式，否则显示会错乱
            this.topMenuStyle.topNavHeader = {}
            this.topMenuStyle.headerIndexRight = {}
            this.topMenuStyle.headerIndexLeft = {}
          } else {
            let rightWidth = '360px'
            this.topMenuStyle.topNavHeader = { 'min-width': '165px' }
            this.topMenuStyle.headerIndexRight = { 'min-width': rightWidth }
            this.topMenuStyle.headerIndexLeft = { 'width': `calc(100% - ${rightWidth})` }
            // 由于首次从mobile设备下切换到desktop设备没有初始化TopMenuScrollWidth，所以这里需要计算一下
            if (this.topMenuStyle.scrollWidth['width'] === '10000px') {
              this.calcTopMenuScrollWidth()
            }
          }
        }
      },
      /** 计算滚动条的宽度 */
      calcTopMenuScrollWidth() {
        // 非顶部菜单时不计算宽度
        if (this.mode !== 'topmenu') return
        let count = 0
        let timer = setInterval(() => {
          count++
          let scrollWidth = document.getElementById('top-nav-scroll-width')
          if (scrollWidth == null) {
            clearInterval(timer)
            return
          }
          let menu = scrollWidth.getElementsByClassName('ant-menu')[0]
          if (menu) {
            let widthCount = 0
            let menuItems = menu.getElementsByTagName('li')
            for (let item of menuItems) {
              if (item.className.indexOf('ant-menu-overflowed-submenu') === -1) {
                widthCount += item.offsetWidth
              }
            }
            // 由于首次从侧边菜单模式下切换到顶部菜单模式下没有buildTopMenuStyle，所以这里需要build一下
            if (this.topMenuStyle.scrollWidth['width'] === '10000px') {
              // 防止递归调用
              this.$nextTick(() => {
                this.buildTopMenuStyle()
              })
            }
            this.topMenuStyle.scrollWidth['width'] = `${widthCount + 10}px`
            // 将滚动条位置滚动到当前选中的菜单处
            if (count === 1) {
              topNavScrollToSelectItem(document)
            }
          }
          // 校准数据三次再关闭定时器
          if (count === 3) {
            clearInterval(timer)
          }
        }, 100)
      }
      //update-end--author:sunjianlei---date:20190408------for: 顶部导航栏增加横向滚动条-----
    }
  }
</script>

<style lang="scss" scoped>
  /* update_begin author:scott date:20190220 for: 缩小首页布局顶部的高度*/

  $height: 59px;

  .layout {

    .top-nav-header-index {

      .header-index-wide {
        margin-left: 10px;

        .ant-menu.ant-menu-horizontal {
          height: $height;
          line-height: $height;
        }
      }
      .trigger {
        line-height: 64px;
        &:hover {
          background: rgba(0, 0, 0, 0.05);
        }
      }
    }

    .header {
      z-index: 2;
      color: white;
      height: $height;
      background-color: #1890ff;
      transition: background 300ms;
    }

    .header, .top-nav-header-index {
      &.dark .trigger:hover {
        background: rgba(0, 0, 0, 0.05);
      }
    }
  }

  .ant-layout-header {
    height: $height;
    line-height: $height;
  }

  /* update_end author:scott date:20190220 for: 缩小首页布局顶部的高度*/

  /* update_begin author:sunjianlei date:20190408 for: 修改顶部导航栏滚动条的样式 */
  #top-nav-scroll-view {
    $scrollBarSize: 8px;

    /* 定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
    &::-webkit-scrollbar {
      width: $scrollBarSize;
      height: $scrollBarSize;
      background-color: transparent;
    }

    /* 定义滚动条轨道 */
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }

    /* 定义滑块 */
    &::-webkit-scrollbar-thumb {
      border-radius: $scrollBarSize;
      background-color: #eee;
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);

      &:hover {
        background-color: #dddddd;
      }

      &:active {
        background-color: #bbbbbb;
      }
    }
  }

  /** 暗色系滚动条样式 */
  .dark #top-nav-scroll-view {
    &::-webkit-scrollbar-thumb {
      background-color: #666666;

      &:hover {
        background-color: #808080;
      }

      &:active {
        background-color: #999999;
      }
    }
  }

  .logo {
    height: $height !important;
    line-height: $height !important;
    box-shadow: none !important;
    transition: background 300ms;
    position: relative;
    padding-left: 24px;
    -webkit-transition: all .3s;
    overflow: hidden;
    display: inline-block;

    img {
      height: 34px;
    }
    a {
      color: white;
      &:hover {
        color: rgba(255, 255, 255, 0.8);
      }
    }

    img, h1 {
      display: inline-block;
      vertical-align: middle;
    }

    h1 {
      color: #fff;
      font-size: 18px;
      margin: 0 0 0 8px;
      font-family: "Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
      font-weight: 600;
    }
  }

  /* update_end author:sunjianlei date:20190408 for: 修改顶部导航栏滚动条的样式 */
</style>