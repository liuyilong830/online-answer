<template>
  <div class="profile-navbar">
    <ul class="profile-navbar-list">
      <li
        :class="{'profile-navbar_item': true, 'profile-navbar_item-active': index === value}"
        v-for="(val,index) in list"
        :key="val.path"
        @click.stop="changeTag(index)"
      >
        <span class="item_text" ref="textRefs">{{val.title}}</span>
      </li>
    </ul>
    <div class="dot" ref="dotRef">
      <div class="dynamic-dot" :style="dynamicDotStyle"></div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  export default {
    name: "ProfileNavBar",
    data() {
      return {
        offset: 0,
        width: 0,
        isanimation: false,
      }
    },
    props: {
      value: Number,
      list: Array,
    },
    computed: {
      ...mapGetters(['getUserInfo']),
      dynamicDotStyle() {
        return {
          transform: `translate(${this.offset}px, 0)`,
          width: `${this.width}px`,
          transition: `${this.isanimation ? 0.5 : 0}s`,
        }
      }
    },
    methods: {
      changeTag(index) {
        if (index === this.value) return;
        this.$emit('input', index);
        this.$emit('changeIndex', index);
      },
      init() {
        this.dotRect = this.$refs.dotRef.getBoundingClientRect();
        let arr = [];
        this.$refs.textRefs.forEach(ref => {
          arr.push(ref.getBoundingClientRect());
        })
        this.rects = arr;
        if (this.value < 0) return;
        this.move(this.value);
      },
      move(index) {
        this.offset = this.rects[index].left - this.dotRect.left;
        this.width = this.rects[index].width;
      }
    },
    watch: {
      value(val) {
        this.isanimation = true;
        this.move(val);
      }
    },
    mounted() {
      this.init();
    }
  }
</script>

<style scoped lang="scss">
  .profile-navbar {
    box-sizing: border-box;
    width: 100%;
    height: 45px;
    background-color: #fff;
    border-bottom: 1px solid #d0c8c8;
    margin-bottom: 10px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    overflow: hidden;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    font-size: 16px;
    font-weight: 600;
    .profile-navbar-list {
      flex: 1;
      display: flex;
      .profile-navbar_item {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        &.profile-navbar_item-active {
          color: #5754fd;
        }
      }
    }
    .dot {
      height: 3px;
      .dynamic-dot {
        width: 40px;
        height: 100%;
        background-color: #5754fd;
      }
    }
  }
</style>