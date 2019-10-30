<template>
  <!-- , width: fixedHeader ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'  -->
  <div class="header">
      <div class="logo">
        <a href="#"><img src="~@/assets/corn.svg"/>Corn</a>
      </div>
      <!------Navigation starts--------->
      <div class="nav">
        <ul>
          <li><router-link :to="{ name: 'blank-note' }" @click.native="active(1)">
            <span>笔记</span>
          </router-link><span :class="{'active':show(1)}"> </span></li>
          <li><router-link :to="{ name: 'blank-word-articleList' }" @click.native="active(2)">
            <span>英语</span>
          </router-link><span :class="{'active':show(2)}"> </span></li>
          <li>
            <a-dropdown>
              <span class="drop-title">
                <a-avatar class="avatar" size="small" :src="getAvatar()"/>
                <span v-if="isDesktop()">欢迎您，{{ nickname() }}</span>
              </span>
              <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
                <a-menu-item key="0">
                  <router-link :to="{ name: 'account-center' }">
                    <a-icon type="user"/>
                    <span>个人中心</span>
                  </router-link>
                </a-menu-item>
                <a-menu-item key="1">
                  <router-link :to="{ name: 'account-settings' }">
                    <a-icon type="setting"/>
                    <span>账户设置</span>
                  </router-link>
                </a-menu-item>
                <a-menu-item key="2" @click="handleLogout">
                    <a-icon type="setting"/>
                    <span>退出登录</span>
                </a-menu-item>
              </a-menu>
            </a-dropdown>

          </li>
        </ul>
      </div>
      <!------Navigation ends-------->
      <div class="clear"></div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import { mixinDevice } from '@/utils/mixin.js'
  export default {
    name: 'IndexHeader',
    mixins: [mixinDevice],
    data(){
      return {
        activeIndex:1,
      }
    },
    methods:{
      ...mapActions(["Logout"]),
      ...mapGetters(["nickname", "avatar"]),
      getAvatar(){
        return window._CONFIG['imgDomainURL']+"/"+this.avatar()
      },
      handleLogout() {
        const that = this

        this.$confirm({
          title: '提示',
          content: '真的要注销登录吗 ?',
          onOk() {
            return that.Logout({}).then(() => {
              window.location.href="/";
              //window.location.reload()
            }).catch(err => {
              that.$message.error({
                title: '错误',
                description: err.message
              })
            })
          },
          onCancel() {
          },
        });
      },
      active(index){
        this.activeIndex = index;
      },
      show(index){
        if(this.activeIndex == index){
          return true;
        }else {
          return false;
        }
      },
    }
  }
</script>

<style lang="scss" scoped>

  $height: 50px;
  $marTop: $height - 17px;
  .header{
    background:rgba(0, 0, 0, 0.24);
    height: $height;
  }
  .logo{
    float:left;
    margin:1em 1.5em 0 1em;
  }
  .logo a{
    color:#fff;
    font-size:14px;
    font-weight: bold;
  }
  .logo a img{
    height: 18px;
    padding-right: 5px;
  }
  .logo a:hover{
    color:#d8d8d8;
    text-decoration:none;
  }
  .nav{
    float:right;
  }
  .nav ul li{
    display:inline-block;
    margin:14px 1.5em 0 0;
  }
  .nav ul li a{
    color:#fff;
    font-size:14px;
    padding: 0 15px;
    text-decoration:none;
  }
  .nav ul li a:hover{
    color: #d8d8d8;
    text-decoration:none;
    border-bottom: #fff;
  }
  .active{
    width: 100%;
    height: 3px;
    background: #FFF;
    display: block;
    text-align: center;
    margin: 0 auto;
    margin-top: 12px;
  }
  .avatar{
    margin-right:10px;
    padding-left:20px;
  }
  .drop-title{
    color: #fff;
    height: $marTop;
    display: inline-block;
  }
</style>