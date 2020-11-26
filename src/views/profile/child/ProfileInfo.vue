<template>
  <div class="pfl-info">
    <div class="pfl-info-normal">
      <div class="pfl-info-base">
        <div class="baseinfo-img">
          <img src="http://localhost:5000/img/def-avatar.png" alt="">
        </div>
        <div class="baseinfo-others">
          <p class="others-nickname">大树</p>
          <p class="others-uid">答题号: 10000</p>
          <p class="others-tags"><span><i class="iconfont icon-nan man"></i>21岁</span><span>中国</span></p>
        </div>
      </div>
      <div class="pfl-info-signature">即将去小红书总部搬砖的程序猿</div>
      <div class="pfl-info-others">
        <div class="others-of-num">
          <p class="focus-num"><span>12</span><span>关注</span></p>
          <p class="fans-num"><span>8</span><span>粉丝</span></p>
          <p class="zan-num"><span>99</span><span>获赞</span></p>
        </div>
        <div class="others-of-setting">
          <p class="edit-data public">编辑资料</p>
          <p class="setting public"><i class="iconfont icon-shezhi"></i></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ProfileInfo",
    data() {
      return {}
    },
    methods: {},
  }
</script>

<style scoped lang="scss">
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
              }
            }
          }
        }
      }
      .pfl-info-signature {
        height: 30px;
        margin-bottom: 5px;
        line-height: 30px;
        color: #fff;
        font-size: 13px;
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