<template>
  <div class="dpwn">
    <div class="dpwn-bar">
      <div class="dpwn-bar_item">{{list[value]}}</div>
    </div>
    <div class="dpwn-btn" @click.stop="checked">
      <i class="iconfont icon-liebiao"></i>
    </div>
    <ul class="dpwn-list" v-show="isShow">
      <li
        :class="{'dpwn-item': true, 'dpwn-item-active': value === index}"
        v-for="(item, index) in list"
        :key="item"
        @click.stop="changeCurrent(index)"
      >
        {{item}}
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "DropDown",
    data() {
      return {
        isShow: false,
      }
    },
    props: {
      value: { type: Number },
      list: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    methods: {
      checked() {
        this.isShow = true;
      },
      changeCurrent(index) {
        this.isShow = false;
        if (this.value === index) return;
        this.$emit('input', index);
      }
    },
    created() {
      document.body.addEventListener('click', () => {
        if (this.isShow) {
          this.isShow = false;
        }
      });
    }
  }
</script>

<style scoped lang="scss">
  .dpwn {
    position: relative;
    margin-bottom: 10px;
    .dpwn-bar {
      display: flex;
      height: 40px;
      background-color: #fff;
      .dpwn-bar_item {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .dpwn-btn {
      position: absolute;
      top: 50%;
      left: 10px;
      transform: translateY(-50%);
      .iconfont {
        font-size: 20px;
      }
    }
    .dpwn-list {
      position: absolute;
      top: 50%;
      left: 30px;
      overflow: hidden;
      border-radius: 5px;
      z-index: 2;
      box-shadow: 0px 1px 5px 1px #00000047;
      .dpwn-item {
        padding: 10px 6px;
        text-align: center;
        background-color: #fff;
        &.dpwn-item-active {
          color: #5754fd;
        }
      }
    }
  }
</style>