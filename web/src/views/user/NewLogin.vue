<template>
  <div class="banner-layer">
    <div class="logo text-center">
      <h1>
        <a href="index.html">
          <span aria-hidden="true">
            <img src="~@/assets/corn.svg" style="padding-top: 12px;width: 50px;height: 50px;" class="logo" alt="logo">
          </span></a>
      </h1>
    </div>
    <div class="w3ls-container text-center">

      <div class="w3l-content main-agile">
        <div class="left-grid">
          <a-carousel autoplay>
            <div><h3>便捷笔记，多层目录，随时记录</h3></div>
            <div><h3>自定义英语背诵内容</h3></div>
            <div><h3>多种速度听英语短文和单词</h3></div>
            <div><h3>边游戏边背诵单词，娱乐学习两不误</h3></div>
          </a-carousel>
        </div>
        <div class="right-grid">
          <div class="sub-form">
            <a-form class="user-layout-login" ref="formLogin" :autoFormCreate="(form)=>{this.form = form}" id="formLogin">
              <a-form-item
                fieldDecoratorId="username"
                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入帐户名或邮箱' }, { validator: this.handleUsernameOrEmail }], validateTrigger: 'change'}">
                <a-input size="large" type="text" placeholder="请输入帐户名 / jeecg" :style="{marginBottom: '30px'}">
                  <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                </a-input>
              </a-form-item>
              <a-form-item
                fieldDecoratorId="password"
                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}">
                <a-input size="large" type="password" autocomplete="false" placeholder="密码 / 123456">
                  <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                </a-input>
              </a-form-item>
              <a-form-item style="text-align: left">
                <label class="switch">
                  <input type="checkbox">
                  <span class="slider round"></span>
                  <span class="switch_label">记住我</span>
                </label>
                <router-link :to="{ name: 'recover', params: { user: 'aaa'} }" class="forge-password" style="float: right;">
                  忘记密码?
                </router-link>
              </a-form-item>
              <a-form-item style="margin-top:24px">
                <a-button
                  size="large"
                  type="primary"
                  htmlType="submit"
                  class="login-button"
                  :loading="loginBtn"
                  @click.stop.prevent="handleSubmit"
                  :disabled="loginBtn">确定
                </a-button>
              </a-form-item>
            </a-form>
          </div>
        </div>
      </div>
      <div class="agile-social-icons">
        <p>免费提供以下服务，欢迎使用</p>
        <ul class="social_list">
          <li>
              <img src="~@/assets/a.svg" alt="" />
              <span>听英语</span>
          </li>
          <li>
              <img src="~@/assets/b.svg" alt="" />
            <span>背单词</span>
          </li>
          <li>
              <img src="~@/assets/c.svg" alt="" />
            <span>记笔记</span>
          </li>
        </ul>
      </div>

    </div>
    <div class="footer">
      <p> &copy; 2019 Corn. All Rights Reserved by Damu
      </p>
    </div>
  </div>
</template>

<script>
  import RouteView from "@/components/layouts/RouteView"
  import { mixinDevice } from '@/utils/mixin.js'
  import { timeFix } from "@/utils/util"
  import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import { mapActions } from "vuex"

  export default {
    name: "UserLayout",
    components: { RouteView },
    mixins: [mixinDevice],
    data () {
      return {
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        requiredTwoStepCaptcha: false,
        stepCaptchaVisible: false,
        form: null,
        state: {
          time: 60,
          smsSendBtn: false,
        },
        formLogin: {
          username: "",
          password: "",
          captcha: "",
          mobile: "",
          rememberMe: true
        },
      }
    },
    created(){
      Vue.ls.remove(ACCESS_TOKEN);
    },
    methods:{
      ...mapActions([ "Login", "Logout" ]),
      handleUsernameOrEmail (rule, value, callback) {
        const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
        if (regex.test(value)) {
          this.loginType = 0
        } else {
          this.loginType = 1
        }
        callback()
      },
      handleSubmit () {
        let that = this
        let flag = false

        let loginParams = {
          remember_me: that.formLogin.rememberMe
        };


        that.form.validateFields([ 'username', 'password' ], { force: true }, (err, values) => {
          if (!err) {
            flag = true
            loginParams[!that.loginType ? 'email' : 'username'] = values.username
            //loginParams.password = md5(values.password)
            loginParams.password = values.password
          }
        })

        if (!flag) return

        that.loginBtn = true

        that.Login(loginParams).then(() => {
          if (that.requiredTwoStepCaptcha) {
            that.stepCaptchaVisible = true
          } else {
            that.loginSuccess()
          }
        }).catch((err) => {
          that.requestFailed(err);
        })

      },
      loginSuccess () {
        this.loginBtn = false
        this.$router.push({ name: "blank" })
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`,
        });
      },
      requestFailed (err) {
        this.$notification[ 'error' ]({
          message: '登录失败',
          description: ((err.response || {}).data || {}).message || err.message || "请求出现错误，请稍后再试",
          duration: 4,
        });
        this.loginBtn = false;
      },
    }
  }
</script>

<style scoped>

  div,
  span,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  blockquote,
  pre,
  a,
  abbr,
  acronym,
  address,
  big,
  cite,
  code,
  del,
  dfn,
  em,
  img,
  ins,
  kbd,
  q,
  s,
  samp,
  small,
  strike,
  strong,
  sub,
  sup,
  tt,
  var,
  b,
  u,
  i,
  dl,
  dt,
  dd,
  ol,
  nav ul,
  nav li,
  fieldset,
  form,
  label,
  legend,
  table,
  caption,
  tbody,
  tfoot,
  thead,
  tr,
  th,
  td,
  canvas,
  embed,
  footer,
  header,
  hgroup,
  menu,
  nav,
  output,
  ruby,
  section,
  summary,
  time,
  mark,
  audio,
  video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }

  footer,
  header,
  hgroup,
  menu,
  nav,
  section {
    display: block;
  }

  ol,
  ul {
    list-style: none;
    margin: 0px;
    padding: 0px;
  }

  blockquote,
  q {
    quotes: none;
  }

  blockquote:before,
  blockquote:after,
  q:before,
  q:after {
    content: '';
    content: none;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  a {
    text-decoration: none;
  }

  nav.vertical ul li {
    display: block;
  }

  nav.horizontal ul li {
    display: inline-block;
  }

  img {
    max-width: 100%;
  }

  .banner-layer {
    font-family: 'Work Sans', sans-serif;
    background: url(~@/assets/cover4.jpg) no-repeat center;
    background-size: cover;
    background-attachment: fixed;
  }

  p {
    font-size: 1em;
    line-height: 1.5;
  }

  .text-center {
    text-align: center;
  }

  a {
    transition: 0.5s all;
    -webkit-transition: 0.5s all;
    -moz-transition: 0.5s all;
    -o-transition: 0.5s all;
    -ms-transition: 0.5s all;
    text-decoration: none;
  }

  .w3ls-container  {
    width: 70%;
    margin: 0em auto 3em;
  }

  .logo h1 {
    padding: 3em;
  }

  .forge-password{
    color: #fff;
    display: inline-block;
    font-family: 'Work Sans', sans-serif;
    text-transform: capitalize;
    font-weight: 300;
    letter-spacing: 1px;
    text-decoration: none;
  }
  .forge-password:hover{
    color: #12b776;
  }

  .logo h1 a {
    color: #fff;
    display: inline-block;
    font-size: 2.8em;
    font-family: 'Work Sans', sans-serif;
    text-transform: capitalize;
    font-weight: 300;
    letter-spacing: 1px;
  }

  .left-grid {
    border-right: 1px solid #fff;
    padding-right: 15px;
  }

  .logo h1 span {
    color: #fff;
    font-size: 1.2em;
    display: block;
    background: #12b776;
    width: 80px;
    line-height: 1.5;
    padding: 4px;
    height: 80px;
    border-radius: 50%;
    margin: 0 auto;
  }

  .user-layout-login {
    padding: 0.8em;
    width: 70%;
    font-size: 1em;
    color: #000000;
    outline: none;
    display: inline-block;
    font-family: 'Work Sans', sans-serif;
  }

  .login-button {
    color: #ffffff;
    padding: 10px;
    width: 100%;
    border-radius: 4px;
    font-size: 1em;
    text-align: center;
    cursor: pointer;
    text-decoration: none;
    background: #12b776;
    border: solid 1px #000000;
    transition: 0.5s all;
    -webkit-transition: 0.5s all;
    -moz-transition: 0.5s all;
    -o-transition: 0.5s all;
    -ms-transition: 0.5s all;
  }

  .sub-form button:hover {
    color: #94bf36;
    background: transparent;
    border: solid 1px #ffffff;
  }

  .sub-form button:focus {
    outline: none;
  }

  .w3ls-container  p {
    color: #fff;
    font-size: 1.1em;
    margin: 35px 0;
    text-transform: capitalize;
  }
  label .switch_label{
    position: relative;
    left: 45px;
    font-family: 'Work Sans', sans-serif;
    font-weight: 300;
    letter-spacing: 1px;
    font-size: 14px;
  }

  label.switch {
    position: relative;
    display: inline;
    height: 18px;
    cursor: pointer;
    color: #ccc;
    font-weight: 300;
  }

  label.switch {
    margin-top: 10px;
    font-size: 15px;
    letter-spacing: 1px;
    font-weight: 300;
    color: #ccc !important;
    text-transform: capitalize;
  }

  .switch input {
    display: none;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 3px;
    left: 0;
    right: 0;
    bottom: 0;
    width: 40px;
    background-color: rgba(255, 255, 255, 0.15);
    -webkit-transition: .4s;
    transition: .4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    left: 3px;
    height: 10px;
    width: 10px;
    bottom: 3px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
  }

  input:checked+.slider {
    background-color: #12b776;
  }

  input:focus+.slider {
    box-shadow: 0 0 1px #2196F3;
  }

  input:checked+.slider:before {
    -webkit-transform: translateX(25px);
    -ms-transform: translateX(25px);
    transform: translateX(25px);
  }

  /* Rounded sliders */

  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }

  .footer p {
    text-align: center;
    font-size: 14px;
    color: #fff;
    letter-spacing: 1px;
    font-weight: 300;
  }

  .footer p a {
    color: #fff;
  }

  .footer p a:hover {
    color: #12b776;
  }

  .social_list li {
    display: inline-block;
    margin-left: 80px;
  }

  .social_list span {
    display: block;
    color: #fff;
    margin-top: 10px;
  }

  .ant-carousel >>> .slick-slide {
    text-align: center;
    height: 250px;
    line-height: 160px;
    overflow: hidden;
  }

  .ant-carousel >>> .slick-slide h3 {
    color: #fff;
  }

  .main-agile {
    margin: 0px auto 0px auto;
    background: rgba(0, 0, 0, 0.64);
    padding: 50px 30px;
    position: relative;
    -webkit-box-shadow: 10px 10px 16px 0px rgba(0, 0, 0, 0.35);
    -moz-box-shadow: 10px 10px 16px 0px rgba(0, 0, 0, 0.35);
    box-shadow: 10px 10px 16px 0px rgba(0, 0, 0, 0.35);
  }

  @media screen and (max-width: 1440px) {
    .footer p {
      padding-bottom: 2em;
    }
  }

  @media screen and (max-width: 1080px) {
    .w3ls-container  {
      width: 95%;
    }

  }
  @media screen and (max-width: 1024px) {
    .w3ls-container  p {
      margin: 35px 0 20px;
    }
  }

  @media screen and (max-width: 991px) {
    .logo h1 span {
      font-size: 1em;
      width: 75px;
      line-height: 1.7;
      height: 75px;
    }
  }

  @media screen and (max-width: 900px) {
    .w3ls-container  {
      width: 98%;
    }
    .w3ls-container  p {
      font-size: 1.05em;
    }
    .sub-form button {
      width: 16%;
    }
  }
  @media screen and (min-width: 801px) {

    .w3l-content {
      display: -webkit-box;
      display: -moz-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      margin-bottom: 5em;
    }

    .left-grid,
    .right-grid {
      -webkit-box-flex: 1;
      -moz-box-flex: 1;
      width: 20%;
      -webkit-flex: 1;
      -ms-flex: 1;
      flex: 1;
    }
  }

  @media screen and (max-width: 800px) {
    .w3ls-container  {
      width: 72%;
      margin: 2em auto 3em;
    }
    .left-grid {
      border-bottom: 1px solid #fff;
      border-right: none;
      padding-bottom: 2em;
    }
    .social_list li {
      width: 13%;
    }

  }

  @media screen and (max-width: 768px) {
    .social_list li {
      width: 14%;
    }
  }
  @media screen and (max-width: 667px) {
    .w3ls-container  {
      width: 78%;
    }
  }

  @media screen and (max-width: 640px) {
    .logo h1 span {
      font-size: 0.95em;
      width: 65px;
      line-height: 1.6;
      height: 65px;
    }
  }


  @media screen and (max-width: 568px) {
    .social_list li {
      margin-left: 0.8em;
    }
    .w3ls-container  p {
      margin: 30px 0;
    }
    .w3ls-container  p {
      font-size: 1em;
    }
  }

  @media screen and (max-width: 480px) {
    .w3ls-container  {
      width: 88%;
    }
    .sub-form input {
      width: 52%;
    }
    .footer p {
      padding: 0 2em 2em;
      line-height: 1.7;
    }
  }

  @media screen and (max-width: 414px) {
    .w3ls-container  {
      width: 90%;
    }
    .sub-form input[type="email"] {
      width: 59%;
    }
    ul.social_list {
      margin: 2em 0;
    }
    .logo h1 a {
      font-size: 2.5em;
    }
    .logo h1 span {
      width: 60px;
      height: 60px;
    }
  }

  @media screen and (max-width: 384px) {
    .sub-form input[type="email"] {
      margin-right: 5px;
    }
    .w3ls-container  p {
      font-size: 1em;
    }
  }

  @media screen and (max-width: 375px) {
    .logo h1 span {
      font-size: 0.85em;
      width: 60px;
      line-height: 1.6;
      height: 60px;
    }

  }

  @media screen and (max-width: 320px) {
    .logo h1 a {
      font-size: 2.3em;
    }
    .sub-form input[type="email"] {
      width: 63%;
    }
    .sub-form button {
      width: 18%;
    }
    .w3ls-container  p {
      margin: 17px 0;
    }
    .w3ls-container  {
      margin: 2em auto 2em;
    }
  }

</style>