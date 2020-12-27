<template>
  <div class="bank-detail">
    <nav-bar :style="navbarStyle">
      <template #left><i class="iconfont icon-fanhui1" @click="toclose"></i></template>
      <div class="detail-title">详情页</div>
      <template #right><i class="iconfont icon-19"></i></template>
    </nav-bar>
    <div class="copy-tabs" v-if="iscopyed">
      <tabs :tablist="tablist" v-model="currtab"/>
    </div>
    <div class="detail" @scroll="onscroll">
      <div class="content" ref="contentRef">
        <div class="detail-img">
          <img :src="detail.icon" alt="">
        </div>
        <div class="detail-baseinfo">
          <p class="createtime">发布于：{{getCreatetime}}</p>
          <p class="name">{{detail.qname}}</p>
          <p class="desc">{{detail.description}}</p>
        </div>
        <div class="detail-tabs" ref="tabRef">
          <tabs :tablist="tablist" v-model="currtab"/>
        </div>
        <div class="normal">
          <div class="public" v-for="(key, index) in types" :key="key">
            <p class="title" ref="titleRefs">{{`${index+1}.${formatTitle(key)}`}}</p>
            <ul class="timus" v-if="timus[key].length">
              <li class="timu" v-for="(item, i) in timus[key]" :key="item.tid">
                <div class="number">{{i + 1}}</div>
                <div class="tname">{{item.tname}}</div>
                <div class="opeations" @click="checkTimu(item)"><i class="iconfont icon-gengduo3"></i></div>
              </li>
            </ul>
            <div class="equal" v-else>空</div>
          </div>
        </div>
      </div>
    </div>
    <popup :is-show.sync="isinfo" position="bottom" round closeable>
      <div class="timuinfo" v-if="timuinfo">
        <div class="public">
          <p class="title">题目名</p>
          <div class="text">{{timuinfo.tname}}</div>
        </div>
        <div class="public" v-if="timuinfo.options.length">
          <p class="title">题目选项</p>
          <ul class="options">
            <li class="option" v-for="(opt,i) in timuinfo.options" :key="opt">
              <span :class="{active: timuinfo.res.includes(opt)}">{{`${formatTnum(i)}. ${opt}`}}</span>
            </li>
          </ul>
        </div>
        <div class="public" v-if="timuinfo.tnum === 0">
          <p class="title">题目答案</p>
          <div class="textarea" v-if="timuinfo.res.length">{{timuinfo.res[0]}}</div>
          <div class="equal" v-else>空</div>
        </div>
        <div class="public">
          <p class="title">题目解析</p>
          <div class="textarea" v-if="timuinfo.description">{{timuinfo.description}}</div>
          <div class="equal" v-else>空</div>
        </div>
        <div class="btns">
          <div class="btn eqit" @click="toeqit">编辑</div>
          <div class="btn delete" @click="todelete">删除</div>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
  import NavBar from "../../components/nav-bar/NavBar";
  import Tabs from '../../components/common/tabs/Tabs';
  import Popup from "../../components/popup/Popup";
  import { formatTime } from '../../util/util';
  import { mapActions } from 'vuex';
  export default {
    name: "BankDetail",
    inheritAttrs: false,
    components: {
      Popup,
      Tabs,
      NavBar,
    },
    inject: ['box2'],
    data() {
      return {
        tablist: ['单选', '多选', '简答', '汇总'],
        currtab: 0,
        iscopyed: false,
        navbarheight: 40,
        height: 0,
        top: 0,
        timus: {
          singles: [],
          multis: [],
          shortanswers: [],
        },
        types: ['singles', 'multis', 'shortanswers'],
        isinfo: false,
        timuinfo: null,
        starts: {
          singles: 0,
          multis: 0,
          shortanswers: 0
        }
      }
    },
    props: {
      detail: {
        type: Object,
        default() { return {} }
      },
    },
    computed: {
      opacity() {
        if (!this.top || !this.height) {
          return 0;
        }
        return this.top / this.height;
      },
      getColor() {
        let num = 255 - 255 * this.opacity;
        num = num <= 102 ? 102 : num;
        return `rgb(${num}, ${num}, ${num})`
      },
      navbarStyle() {
        return {
          position: 'absolute',
          top: 0,
          backgroundColor: `rgba(255,255,255, ${this.opacity})`,
          borderBottom: 'none',
          boxShadow: 'none',
          height: `${this.navbarheight}px`,
          width: '100%',
          color: this.getColor,
          zIndex: 2,
        }
      },
      getCreatetime() {
        return formatTime(this.detail.createtime);
      },
    },
    methods: {
      ...mapActions(['querySingles', 'queryMultis', 'queryShortAnswers']),
      toclose() {
        this.box2.toclose();
      },
      init() {
        this.$nextTick(() => {
          this.tabsRect = this.$refs.tabRef.getBoundingClientRect();
          this.height = this.tabsRect.top - this.navbarheight;
          this.titlesRect = this.$refs.titleRefs.map(ref => ref.getBoundingClientRect());
        })
      },
      onscroll() {
        this.contentRect = this.$refs.contentRef.getBoundingClientRect();
        this.top = Math.abs(this.contentRect.top);
        if (this.top >= this.height) {
          this.iscopyed = true;
        } else {
          this.iscopyed = false;
        }
      },
      formatTitle(key) {
        return key === 'singles' ? '单选题' : (
          key === 'multis' ? '多选题' : '简单题'
        );
      },
      formatTnum(num) {
        return String.fromCharCode(65 + num);
      },
      checkTimu(info) {
        this.isinfo = true;
        this.timuinfo = info;
      },
      toeqit() {},
      todelete() {},
      async asyncQuerySingles(qid, start = 0, limit = 10) {
        let res = await this.querySingles({qid, start, limit})
        if (res.status === 200 && res.data) {
          let singles = res.data.singles;
          this.timus.singles = singles;
          this.starts.singles += singles.length;
        }
      },
      async asyncQueryMultis(qid, start = 0, limit = 10) {
        let res = await this.queryMultis({qid, start, limit})
        if (res.status === 200 && res.data) {
          let multis = res.data.multis;
          this.timus.multis = multis;
          this.starts.multis += multis.length;
        }
      },
      async asyncQueryShortAnswers(qid, start = 0, limit = 10) {
        let res = await this.queryShortAnswers({qid, start, limit})
        if (res.status === 200 && res.data) {
          let shortanswers = res.data.shortanswers;
          this.timus.shortanswers = shortanswers;
          this.starts.shortanswers += shortanswers.length;
        }
      }
    },
    watch: {
      currtab(val) {
        if (val < this.types.length) {
          let navbarheight = this.navbarheight;
          let tabsheight = this.tabsRect.height;
          this.$refs.contentRef.parentNode.scrollTop = this.titlesRect[val].top - (tabsheight + navbarheight);
        } else {
          console.log(val);
        }
      }
    },
    mounted() {
      this.init();
      this.asyncQuerySingles(this.detail.qid, this.starts.singles, 10);
      this.asyncQueryMultis(this.detail.qid, this.starts.multis, 10);
      this.asyncQueryShortAnswers(this.detail.qid, this.starts.shortanswers, 10);
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/css/base";
  .bank-detail {
    height: 100%;
    overflow: auto;
    position: relative;
    .detail-title {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
    }
    .copy-tabs {
      box-sizing: border-box;
      position: absolute;
      top: 40px;
      width: 100%;
      height: 40px;
      padding: 0 25px;
      z-index: 2;
      background-color: #fff;
      box-shadow: 0px 5px 4px -5px #ccc;
    }
    .detail {
      height: 100%;
      overflow: auto;
      .detail-img {
        font-size: 0;
        img {
          width: 100%;
        }
      }
      .detail-baseinfo {
        box-sizing: border-box;
        padding: 0 10px;
        background-color: #fff;
        margin-bottom: 5px;
        .createtime, .name {
          height: 30px;
          line-height: 30px;
          @include toEllipse(1);
        }
        .name {
          font-weight: bold;
          font-size: 16px;
          color: #333;
        }
        .desc {
          min-height: 30px;
          display: flex;
          line-height: 20px;
          text-align: justify;
        }
      }
      .detail-tabs {
        height: 40px;
        padding: 0 25px;
        background-color: #fff;
      }
      .normal {
        box-sizing: border-box;
        padding: 5px 10px;
        background-color: #fff;
      }
      &::-webkit-scrollbar {
        width: 0 !important;
      }
    }
    .public {
      .title {
        font-size: 12px;
        color: #b1b1b1;
        margin-bottom: 5px;
      }
      .timus {
        margin-bottom: 20px;
        .timu {
          margin-bottom: 5px;
          border-radius: 5px;
          background-color: #f2f3f5;
          display: flex;
          .number {
            min-width: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .tname {
            flex: 1;
            min-height: 35px;
            display: flex;
            align-items: center;
            padding: 3px 0;
          }
          .opeations {
            width: 35px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
      .equal {
        height: 35px;
        margin-bottom: 5px;
        border-radius: 5px;
        background-color: #f2f3f5;
        text-align: center;
        line-height: 35px;
        color: #ccc;
      }
      .text, .textarea {
        width: 100%;
        height: 30px;
        border-radius: 10px;
        box-sizing: border-box;
        padding: 5px 10px;
        background-color: #f2f3f5;
        overflow: auto;
      }
      .options {
        display: flex;
        flex-wrap: wrap;
        .option {
          min-width: 50%;
          max-width: 100%;
          box-sizing: border-box;
          min-height: 30px;
          display: flex;
          align-items: center;
          padding: 0  5px;
          margin-bottom: 5px;
          span {
            border-radius: 5px;
            background-color: #f2f3f5;
            padding: 2px 5px;
            &.active {
              background-color: #5754fd;
              color: #fff;
            }
          }
        }
      }
      .textarea {
        height: 60px;
      }
    }
    .timuinfo {
      box-sizing: border-box;
      padding: 0 10px;
      .public {
        margin-bottom: 10px;
      }
      .btns {
        display: flex;
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 10px;
        .btn {
          flex: 1;
          height: 40px;
          color: #fff;
          font-size: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          &.eqit {
            background-color: #5754fd;
          }
          &.delete {
            background-color: #d84848;
          }
        }
      }
    }
    &::-webkit-scrollbar {
      width: 0 !important;
    }
  }
</style>