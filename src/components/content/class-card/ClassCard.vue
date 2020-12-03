<template>
  <div class="class-card">
    <card :style="{backgroundColor: '#cecece42', boxShadow: '0px 0px 5px 1px #a5a2a2'}">
      <template #image>
        <div class="class-img">
          <img :src="classInfo.classavatar" alt="">
        </div>
      </template>
      <div class="class-name">
        <p class="name">{{classInfo.classname}}</p>
      </div>
      <template #other>
        <div class="class-others">
          <p class="class-creater">
            <img :src="classInfo.avatar" alt="">
            <span>{{classInfo.nickname}}</span>
          </p>
          <p class="class-count">
            <span>{{classInfo.count}}</span>
            <i class="iconfont icon-ren"></i>
          </p>
        </div>
      </template>
    </card>
  </div>
</template>

<script>
  import Card from "../../common/card/Card";
  export default {
    name: "ClassCard",
    components: {
      Card,
    },
    data() {
      return {}
    },
    props: {
      classInfo: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    methods: {},
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/css/base";
  .class-card {
    .class-img {
      height: 100px;
      img {
        height: 100%;
      }
    }
    .class-name {
      .name {
        font-weight: bold;
      }
    }
    .class-others {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
      height: 30px;
      .class-creater {
        flex: 1;
        height: 25px;
        line-height: 25px;
        @include toEllipse(1);
        img {
          height: 25px;
          border-radius: 50%;
          vertical-align: bottom;
          padding-right: 5px;
        }
      }
      .class-count {
        width: 30%;
        text-align: right;
        height: 25px;
        line-height: 25px;
      }
    }
  }
</style>