<template>
  <div class="pfl-info">
    <div class="pfl-info-normal">
      <div class="pfl-info-base">
        <div class="baseinfo-img">
          <img :src="info.avatar" alt="">
        </div>
        <div class="baseinfo-others">
          <p class="others-nickname">{{info.nickname}}</p>
          <p class="others-uid">答题号: {{info.uid}}</p>
          <p class="others-tags">
            <span>
              <i :class="sexClass"></i>
              {{getAge}}
            </span>
            <span>{{info.sname}}</span>
            <span>{{getIdentity}}</span>
          </p>
        </div>
      </div>
      <div class="pfl-info-signature">{{getSignature}}</div>
      <div class="pfl-info-others">
        <div class="others-of-num">
          <p class="focus-num"><span>{{info.foucs}}</span><span>关注</span></p>
          <p class="fans-num"><span>{{info.fans}}</span><span>粉丝</span></p>
          <p class="zan-num"><span>{{info.zan}}</span><span>获赞</span></p>
        </div>
        <div class="others-of-setting">
          <p class="edit-data public" @click.stop="editorClick">编辑资料</p>
          <p class="setting public" @click.stop="signOut">退出</p>
        </div>
      </div>
    </div>
    <update-info v-model="isupdate" :form-data="formData" :info="changeInfo" @changeData="changeData" />
  </div>
</template>

<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  import { signOutUser, changeUserInfo } from '../../../store/mutation-types';
  import Dialog from "../../../components/dialog";
  import UpdateInfo from "../../../components/content/update-info/UpdateInfo";
  import Toast from "../../../components/toast";
  export default {
    name: "ProfileInfo",
    components: {
      UpdateInfo,
    },
    data() {
      return {
        isupdate: false,
        formData: [
          { mode: 'img', key: 'avatar', name: '头像' },
          { mode: 'text', key: 'nickname', name: '昵称' },
          { mode: 'sex', key: 'sex', name: '性别' },
          { mode: 'birthday', key: 'birthday', name: '生日' },
          { mode: 'text', key: 'sname', name: '毕业学校' },
          { mode: 'textarea', key: 'signature', name: '个人简介' }
        ],
        changeInfo: {
          avatar: '',
          nickname: '',
          sex: '',
          birthday: '',
          sname: '',
          signature: '',
        }
      }
    },
    computed: {
      ...mapGetters(['getUserInfo']),
      info() {
        return this.getUserInfo;
      },
      sexClass() {
        let cls = ['iconfont'];
        if (this.info.sex === 0) {
          cls.push('icon-nan', 'man');
        } else {
          cls.push('icon-nv1', 'women');
        }
        return cls;
      },
      getSignature() {
        return this.info.signature ? this.info.signature : '该用户比较懒，什么都没留下...'
      },
      getBirthday() {
        let arr = new Date(this.info.birthday).toLocaleDateString().split('/');
        arr = arr.map(str => {
          if (str.length < 2) {
            str = 0 + str;
          }
          return str;
        })
        return arr.join('-')
      },
      getAge() {
        let time = parseInt((new Date() - this.info.birthday) / 1000);
        let age = 0;
        if (time.toString() === 'NaN') {
          age = 0;
        } else {
          age = parseInt(time / (86400 * 365));
        }
        return age + '岁';
      },
      getIdentity() {
        let rid = this.info.rid;
        if (rid === 1) {
          return '教师';
        } else if (rid === 2) {
          return '学生';
        } else {
          return '';
        }
      },
    },
    methods: {
      ...mapActions(['updateUser']),
      ...mapMutations([signOutUser, changeUserInfo]),
      init() {
        let { avatar, nickname, sex, sname, signature } = this.info;
        this.changeInfo.avatar = avatar;
        this.changeInfo.nickname = nickname;
        this.changeInfo.sex = sex === 0 ? '男' : '女';
        this.changeInfo.birthday = this.getBirthday;
        this.changeInfo.sname = sname;
        this.changeInfo.signature = signature;
      },
      editorClick() {
        this.isupdate = true;
      },
      changeData(key, val) {
        let info = {};
        if (key === 'birthday') {
          info[key] = new Date(val).getTime();
        } else if (key === 'sex') {
          info[key] = val === '男' ? 0 : 1;
        } else {
          info[key] = val;
        }
        this.asyncUpdateUser(info, key, val);
      },
      signOut() {
        Dialog.confirm({
          message: '您确定退出登录吗？'
        }).then(() => {
          this.signOutUser();
          this.$router.replace('/login');
        }, () => {});
      },
      async asyncUpdateUser(info, key, val) {
        let res = await this.updateUser(info);
        if (res.status === 200) {
          this.changeInfo[key] = val;
          this.changeUserInfo({...this.info, ...info});
          this.$bus.$emit('resetPosition');
          Toast(res.message, 1000);
        }
      }
    },
    mounted() {
      this.init();
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/css/base";
  .pfl-info {
    position: relative;
    &::before {
      content: "";
      position: absolute;
      z-index: -1;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      background: url("http://localhost:5000/img/bg.jpg") no-repeat;
      overflow:hidden;
      background-size: cover;
    }
    .pfl-info-normal {
      position: relative;
      box-sizing: border-box;
      padding: 50px 15px 0px;
      &::before {
        content: "";
        position: absolute;
        z-index: -1;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        background-color: rgba(0,0,0, .58);
      }
      .pfl-info-base {
        height: 65px;
        margin-bottom: 5px;
        display: flex;
        .baseinfo-img {
          width: 65px;
          margin-right: 15px;
          border-radius: 50%;
          overflow: hidden;
          img {
            width: 100%;
          }
        }
        .baseinfo-others {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          .others-nickname {
            font-size: 14px;
            color: #fff;
            font-weight: 600;
          }
          .others-uid {
            font-size: 12px;
            color: #fffefe;
          }
          .others-tags {
            font-size: 12px;
            color: #fff;
            span {
              padding: 0 6px;
              display: inline-block;
              background-color: #67676761;
              border-radius: 15px;
              margin-right: 5px;
              .iconfont {
                font-size: 14px;
                &.man {
                  color: #1989fa;
                }
                &.women {
                  color: pink;
                }
                &.icon-nv1 {
                  font-size: 13px;
                }
              }
            }
          }
        }
      }
      .pfl-info-signature {
        min-height: 30px;
        margin-bottom: 5px;
        color: #fff;
        font-size: 13px;
        @include toEllipse(3);
      }
      .pfl-info-others {
        height: 50px;
        display: flex;
        padding-bottom: 60px;
        .others-of-num {
          flex: 1;
          height: 100%;
          display: flex;
          justify-content: space-between;
          .focus-num, .fans-num, .zan-num {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            align-items: center;
            color: #fff;
          }
        }
        .others-of-setting {
          box-sizing: border-box;
          padding: 12px 0;
          flex: 1;
          color: #fff;
          display: flex;
          justify-content: space-evenly;
          .public {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0 7px;
            border-radius: 15px;
            border: 1px solid #fff;
            &.setting .iconfont {
              font-size: 23px;
            }
          }
        }
      }
    }
  }
</style>