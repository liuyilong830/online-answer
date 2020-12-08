<template>
  <div class="cls-dtl-info">
    <div class="dtl-info-base">
      <div class="base-img">
        <img :src="getClsDetailInfo.classavatar" alt="">
      </div>
      <div class="base-author-info">
        <p><span>班号：</span><span>{{getClsDetailInfo.classid}}</span></p>
        <p><span>创始人：</span><span>{{getClsDetailInfo.nickname}}</span></p>
        <p><span>班级名称：</span><span>{{getClsDetailInfo.classname}}</span></p>
        <p><span>班级创建于：</span><span>{{getCreateTime}}</span></p>
        <p><span>人数：</span><span>{{getClsDetailInfo.count}}人</span></p>
      </div>
    </div>
    <div class="dtl-info-desc">
      <p class="desc"><span>班级描述：</span>{{getClsDetailInfo.description}}</p>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  export default {
    name: "ClassDetailInfo",
    data() {
      return {}
    },
    computed: {
      ...mapGetters(['getClsDetailInfo']),
      getCreateTime() {
        let time = new Date(this.getClsDetailInfo.createtime).toLocaleDateString();
        let arr = time.split('/').map(str => {
          if (str.length < 2) {
            str = 0 + str;
          }
          return str;
        })
        return arr.join('-');
      },
    },
    methods: {},
  }
</script>

<style scoped lang="scss">
  @import "../../../../assets/css/base";
  .cls-dtl-info {
    background-image: linear-gradient(to right, pink, lightblue);
    padding: 10px 10px;
    .dtl-info-base {
      display: flex;
      .base-img {
        width: 90px;
        height: 110px;
        overflow: hidden;
        display: flex;
        align-items: center;
        img {
          width: 90px;
          border-radius: 5px;
        }
      }
      .base-author-info {
        flex: 1;
        box-sizing: border-box;
        padding-left: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        p {
          @include toEllipse(1);
        }
      }
    }
    .dtl-info-desc {
      .desc {
        @include toEllipse(3);
      }
    }
  }
</style>