<template>
  <transition name="rgs">
    <div class="rgs" v-if="isShow">
      <nav-bar>
        <template #left>
          <i class="iconfont icon-fanhui" @click="closeBox"></i>
        </template>
        <template #default>
          <p class="rgs-tle">注册</p>
        </template>
        <template #right>
          <i class="iconfont icon-19"></i>
        </template>
      </nav-bar>
      <div class="rgs-fm">
        <div class="fm-tp">
          <ul class="user-type-list">
            <li class="user-type-item" v-for="item in types" :key="item.id">
              <card>
                <template #title>
                  <div class="item-title">
                    <span>{{item.name}}</span>
                  </div>
                </template>
                <template #default>
                  <div class="cd-content">
                    <div class="checked-img">
                      <div class="img-tch" v-if="item.id === 1"></div>
                      <div class="img-std" v-else></div>
                    </div>
                  </div>
                </template>
                <template #footer>
                  <div class="checked-btn" v-if="!item.ischecked" @click="checkType(item)">未选择</div>
                  <div class="checked-btn checked" v-else><i class="iconfont icon-gou"></i></div>
                </template>
              </card>
            </li>
          </ul>
          <p class="fm-tp-tt">
            <span>请选择上述的其中一种身份</span>
          </p>
        </div>
        <div class="fm-input">
          <span>昵称</span>
          <input type="text" v-model="nickname">
        </div>
        <div class="fm-input">
          <span>密码</span>
          <input type="password" v-model="password">
        </div>
        <div class="fm-input">
          <span>学校</span>
          <input type="text" @click="focusFromKey('schid')" readonly v-model="getSchoolName">
        </div>
        <div class="fm-input">
          <span>性别</span>
          <input type="text" @click="focusFromKey('sex')" readonly v-model="getSex">
        </div>
        <div class="fm-input">
          <span>生日</span>
          <input type="text" @click="focusFromKey('birthday')" readonly v-model="getBirthday">
        </div>
        <div class="fm-submit">
          <button @click="toRegist">提交</button>
        </div>
      </div>
      <popup v-model="veriable" position="bottom" :boxStyle="boxStyle" round ref="popupRef">
        <div class="popup-sex" v-if="key === 'sex'">
          <p class="sex-man popup-sex-btn" @click="changeSex(0)">男生</p>
          <p class="sex-women popup-sex-btn" @click="changeSex(1)">女生</p>
        </div>
        <div class="popup-birthday" v-else-if="key === 'birthday'">
          <van-datetime-picker
            v-model="currentDate"
            type="date"
            title="选择您的出生年月日"
            :min-date="minDate"
            :max-date="maxDate"
            @confirm="confirmBirthday"
          />
        </div>
        <div class="popup-schid" v-else-if="key === 'schid'">
          <van-picker show-toolbar title="选择你所在的学校" :columns="columns" @confirm="confirmSchid" />
        </div>
      </popup>
    </div>
  </transition>
</template>

<script>
  import { DatetimePicker, Picker } from 'vant';
  import NavBar from "../../../components/nav-bar/NavBar";
  import Card from "../../../components/card/Card";
  import Popup from "../../../components/popup/Popup";
  import columns from '../../../assets/json/universityData';
  import Toast from "../../../components/toast";
  import Dialog from "../../../components/dialog";
  import { mapActions } from 'vuex';
  const schools = columns.campus;
  export default {
    name: "Register",
    components: {
      NavBar,
      Card,
      Popup,
      'VanDatetimePicker': DatetimePicker,
      'VanPicker': Picker,
    },
    data() {
      return {
        types: [
          { id: 1, name: '教师', ischecked: false },
          { id: 2, name: '学生', ischecked: false },
        ],
        rid: -1, // 用户的类型选择，1为教师，2为学员
        veriable: false,
        sex: -1, // 0是男，1是女
        password: '',
        nickname: '',
        school: {
          schid: -1,
          name: ''
        },
        birthday: '',
        key: '',
        minDate: new Date(1900, 0, 1),
        maxDate: new Date(2025, 11, 31),
        currentDate: new Date(),
        columns: schools,
      }
    },
    props: {
      isShow: Boolean,
      phone: String,
    },
    computed: {
      boxStyle() {
        let style = {};
        if (this.key === 'sex') style.height = '130px';
        else if (this.key === 'birthday') style.height = '250px';
        else if (this.key === 'schid') style.height = '250px';
        else style.width = '200px';
        return style;
      },
      getSex() {
        if (this.sex === 0) {
          return '男';
        } else if (this.sex === 1) {
          return '女';
        }
      },
      getBirthday() {
        return this.birthday.split('/').join('-');
      },
      getSchoolName() {
        return this.school.name;
      }
    },
    methods: {
      ...mapActions(['toregister']),
      closeBox() {
        this.$emit('update:isShow', !this.isShow);
      },
      closePopup() {
        this.$refs.popupRef.closePopup();
      },
      checkType(type) {
        this.types[type.id-1].ischecked = true;
        this.rid = type.id;
        let flag = type.id === 1;
        if (flag) {
          this.types[1].ischecked = false;
        } else {
          this.types[0].ischecked = false;
        }
      },
      focusFromKey(key) {
        this.key = key;
        this.veriable = true;
      },
      changeSex(sex) {
        this.sex = sex;
        this.closePopup();
      },
      confirmBirthday(date) {
        this.birthday = date.toLocaleDateString();
        this.closePopup();
      },
      confirmSchid(names, indexs) {
        const {id, text} = schools[indexs[0]].children[indexs[1]];
        this.school.schid = id;
        this.school.name = text;
        this.closePopup();
      },
      toRegist() {
        if (!this.vaildator()) return;
        console.log('成功');
        Dialog.confirm({
          message: '你确定提交吗？'
        }).then(() => {
          console.log('确定');
          // 发送网络请求去注册用户，并跳转到首页
          return this.toregister({
            phone: this.phone,
            password: this.password,
            root: this.rid,
            nickname: this.nickname,
            schid: this.school.schid,
            sex: this.sex,
            birthday: this.birthday
          })
        }).then(res => {
          if (res) {
            let path = localStorage.getItem('tologin');
            path = path ? path : '/home';
            this.$router.push(path);
          }
        })
      },
      vaildator() {
        if (this.rid === -1) {
          return this.setToast('注册时需要选择一个身份');
        } else if (!this.nickname) {
          return this.setToast('昵称是必须的');
        } else if (!this.password) {
          return this.setToast('请输入之后登录时需要的密码');
        } else if (this.school.schid === -1) {
          return this.setToast('请选择你在读或者曾经毕业的学校');
        } else if (this.sex === -1) {
          return this.setToast('请选择您的性别');
        } else if (!this.birthday) {
          return this.setToast('请选择你出生的日期');
        } else {
          return true;
        }
      },
      setToast(msg, delay = 2000) {
        Toast(msg, delay);
      }
    },
  }
</script>

<style scoped lang="scss">
  .rgs {
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: #ececec;
    .rgs-tle {
      font-size: 18px;
      text-align: center;
      line-height: 49px;
      font-weight: 600;
    }
    .rgs-fm {
      border-radius: 15px;
      background-color: #fff;
      margin: 10px;
      overflow: hidden;
      padding: 10px 0;
      .fm-tp {
        margin: 10px 0;
        .user-type-list {
          height: 170px;
          display: flex;
          .user-type-item {
            flex: 1;
            box-sizing: border-box;
            padding: 10px;
            display: flex;
            justify-content: space-around;
            .item-title {
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .cd-content {
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              .checked-img {
                width: 60px;
                height: 60px;
                .img-tch {
                  height: 100%;
                  background: url("../../../assets/images/user.jpg") no-repeat -2px -2px;
                  background-size: 120px 120px;
                }
                .img-std {
                  height: 100%;
                  background: url("../../../assets/images/user.jpg") no-repeat -59px -57px;
                  background-size: 120px 120px;
                }
              }
            }
            .checked-btn {
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 15px;
              border-radius: 5px;
              background-color: #ccc;
              &.checked {
                background-color: #61a949ad;
                .iconfont {
                  font-size: 20px;
                  color: #fff;
                }
              }
            }
          }
        }
        .fm-tp-tt {
          height: 30px;
          text-align: center;
          line-height: 30px;
          font-size: 15px;
        }
      }
      .fm-input {
        min-height: 40px;
        padding: 0 10px;
        display: flex;
        font-size: 16px;
        align-items: center;
        span {
          min-width: 70px;
          padding: 5px 10px;
          line-height: 40px;
        }
        input {
          flex: 1;
          height: 35px;
          box-sizing: border-box;
          border-bottom: 1px solid #ccc;
          padding: 0 5px;
          margin-right: 12px;
        }
      }
      .fm-submit {
        margin-top: 10px;
        height: 40px;
        padding: 0 20px;
        font-size: 16px;
        button {
          border: none;
          width: 100%;
          height: 100%;
          border-radius: 5px;
          background-color: #5754fd;
          color: #ffffff;
        }
      }
    }
    .popup-sex {
      height: 100%;
      box-sizing: border-box;
      padding: 15px;
      font-size: 16px;
      .popup-sex-btn {
        height: 40px;
        border-radius: 5px;
        text-align: center;
        line-height: 40px;
        margin-bottom: 10px;
        color: #fff;
        &.sex-man {
          background-color: #65d2d2;
        }
        &.sex-women {
          background-color: #ffa8a8;
        }
      }
    }
    .popup-birthday {

    }
  }
  .rgs-enter, .rgs-leave-to {
    opacity: 0;
    top: 100px;
  }
  .rgs-enter-active, .rgs-leave-active {
    transition: all .15s;
  }
</style>