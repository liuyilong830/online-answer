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
      </div>
    </div>
  </transition>
</template>

<script>
  import NavBar from "../../../components/nav-bar/NavBar";
  import Card from "../../../components/card/Card";
  export default {
    name: "Register",
    components: {
      NavBar,
      Card,
    },
    data() {
      return {
        types: [
          { id: 1, name: '教师', ischecked: false },
          { id: 2, name: '学生', ischecked: false },
        ],
        rid: -1, // 用户的类型选择，1为教师，2为学员
      }
    },
    props: {
      isShow: Boolean,
      phone: String,
    },
    methods: {
      closeBox() {
        this.$emit('update:isShow', !this.isShow);
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
    background-color: #fff;
    .rgs-tle {
      font-size: 18px;
      text-align: center;
      line-height: 49px;
      font-weight: 600;
    }
    .rgs-fm {
      padding: 0 25px;
      .fm-tp {
        margin: 10px 0;
        .user-type-list {
          height: 170px;
          display: flex;
          .user-type-item {
            flex: 1;
            box-sizing: border-box;
            padding: 10px;
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