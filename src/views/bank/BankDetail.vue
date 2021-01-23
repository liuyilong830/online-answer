<template>
  <div class="bank-detail">
    <div class="contain">
      <nav-bar :style="navbarStyle">
        <template #left><i class="iconfont icon-fanhui1" @click="toclose"></i></template>
        <div class="detail-title">详情页</div>
        <template #right><i class="iconfont icon-19"></i></template>
      </nav-bar>
      <div class="copy-tabs" v-if="iscopyed">
        <tabs :tablist="tablist" v-model="currtab" @check="checkTab"/>
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
            <tabs :tablist="tablist" v-model="currtab" @check="checkTab"/>
          </div>
          <div class="normal">
            <div class="public" v-for="(key, index) in types" :key="key">
              <p class="title" ref="titleRefs">
                <span>{{`${index+1}.${formatTitle(key)}`}}</span>
                <button v-if="iscreater" @click="tocreated(key)">创建</button>
              </p>
              <div v-if="timus[key][key].length">
                <ul class="timus">
                  <li class="timu" v-for="(item, i) in timus[key][key]" :key="item.tid">
                    <div class="number">{{i + 1}}</div>
                    <div class="tname">{{item.tname}}</div>
                    <div class="opeations" @click="checkTimu(item)"><i class="iconfont icon-gengduo3"></i></div>
                  </li>
                </ul>
                <div class="more" v-if="!timus[key].finished" @click="tomore(key)">点击加载更多</div>
                <div class="more" v-else>全部读取完成</div>
              </div>
              <div class="equal" v-else>空</div>
            </div>
            <div class="public" ref="rankRef">
              <p class="title">4.排名</p>
              <ul class="rank-list" v-if="ranklist.length">
                <li class="rank-item-info" :class="{myself: isfinishedTest}" v-for="(user,i) in ranklist" :key="user.uid">
                  <span class="number">
                    <span v-if="i>2">{{i+1}}</span>
                    <img v-else :src="require(`../../assets/images/${i==0?'guanjun':(i==1?'yajun':'jijun')}.png`)" alt="">
                  </span>
                  <div class="username"><p>{{user.nickname}}</p></div>
                  <span class="use-time">{{parseTime(user.finishtime)}}</span>
                </li>
              </ul>
              <div class="equal" v-else>快来霸榜呀</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <answers-action ref="actionRef" v-if="operation" :operation.sync="operation" @check="checkOpera" @totest="totest" @toComments="toComments"/>
    <popup :is-show.sync="isinfo" position="bottom" round closeable ref="popup">
      <div class="timuinfo" v-if="Object.keys(timuinfo).length">
        <div class="public">
          <p class="title">题目名</p>
          <div class="text">{{timuinfo.tname}}</div>
        </div>
        <div class="public" v-if="timuinfo.options.length">
          <p class="title">题目选项</p>
          <ul class="options">
            <li class="option" v-for="(opt,i) in timuinfo.options" :key="i">
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
        <div class="btns" v-if="iscreater">
          <div class="btn eqit" @click="toeqit">编辑</div>
          <div class="btn delete" @click="todelete">删除</div>
        </div>
      </div>
    </popup>
    <model-box1 v-model="iscreate">
      <timu-form :type="createtype" @success="onsuccess"/>
    </model-box1>
    <model-box1 v-model="isupdate">
      <update-timu v-model="timuinfo" @closed="updateClosed"/>
    </model-box1>
    <model-box1 v-model="iscomments">
      <ques-comment-list :ques-detail="detail"/>
    </model-box1>
  </div>
</template>

<script>
  import NavBar from "../../components/nav-bar/NavBar";
  import Tabs from '../../components/common/tabs/Tabs';
  import Popup from "../../components/popup/Popup";
  import AnswersAction from "../../components/content/answer-action/AnswersAction";
  import ModelBox1 from "../../components/content/model-box/ModelBox1";
  import TimuForm from "../../components/content/form/TimuForm";
  import UpdateTimu from "../../components/content/update-info/UpdateTimu";
  import QuesCommentList from "../../views/comments/QuesCommentList";
  import { parseFormat, formatTime, parsetimeData } from '../../util/util';
  import {root} from '../../util/mixins/root';
  import islogin from '../../util/mixins/islogin'
  import { mapActions, mapMutations } from 'vuex';
  import Dialog from "../../components/dialog";
  import { totestQuest, quesDetailInfo } from "../../store/mutation-types";
  const Template = function (type, res = [], start = 0, limit = 10, finished = false) {
    this[type] = res;
    this.start = start;
    this.limit = limit;
    this.finished = finished;
  };
  export default {
    name: "BankDetail",
    inheritAttrs: false,
    components: {
      Popup,
      Tabs,
      NavBar,
      AnswersAction,
      ModelBox1,
      TimuForm,
      UpdateTimu,
      QuesCommentList,
    },
    mixins: [root, islogin],
    inject: ['box1'],
    data() {
      return {
        tablist: ['单选', '多选', '简答', '排名'],
        currtab: 0,
        iscopyed: false,
        navbarheight: 40,
        height: 0,
        top: 0,
        timus: {
          singles: new Template('singles'),
          multis: new Template('multis'),
          shortanswers: new Template('shortanswers'),
        },
        types: ['singles', 'multis', 'shortanswers'],
        isinfo: false,
        timuinfo: {},
        operation: {},
        iscreate: false,
        createtype: null,
        isupdate: false,
        ranklist: [],
        iscomments: false,
      }
    },
    props: {
      detail: {
        type: Object,
        default() { return {} }
      },
      isenter: Boolean,
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
      iscreater() {
        return this.getUid === this.detail.uid;
      },
      getType() {
        let { options, res } = this.timuinfo;
        return options.length ? (
          res.length < 2 ? 'singles' : 'multis'
        ) : 'shortanswers';
      },
      getArr() {
        let type = this.getType;
        return this.timus[type][type];
      },
      isfinishedTest() {
        return this.ranklist.findIndex(user => user.uid === this.getUid) > -1;
      },
    },
    methods: {
      ...mapMutations([totestQuest, quesDetailInfo]),
      ...mapActions([
        'queryTimus',
        'querySingles',
        'queryMultis',
        'queryShortAnswers',
        'queryAboutuser',
        'createTimus',
        'deleteTimu',
        'getRankListUser',
        'setQuestOpt',
      ]),
      toclose() {
        this.box1.toclose();
      },
      init() {
        this.$nextTick(() => {
          this.tabsRef = this.$refs.tabRef.getBoundingClientRect();
          let { top } = this.tabsRef;
          let navbarheight = this.navbarheight;
          this.height = top - navbarheight;
          this.getTitlesRect();
        })
      },
      getTitlesRect() {
        let {height} = this.tabsRef;
        let navbarheight = this.navbarheight;
        let titlesRect = this.$refs.titleRefs.map(ref => ref.getBoundingClientRect());
        let rankRect = this.$refs.rankRef.getBoundingClientRect();
        this.scrollTops = titlesRect.map(rect => {
          return this.top + rect.top - (height + navbarheight);
        });
        this.scrollTops.push(this.top + rankRect.top - (height + navbarheight));
      },
      onscroll() {
        this.contentRect = this.$refs.contentRef.getBoundingClientRect();
        let actionRect = this.$refs.actionRef.$el.getBoundingClientRect();
        this.top = Math.abs(this.contentRect.top);
        this.maxTop = Math.max(this.contentRect.height + actionRect.height - document.body.clientHeight, 0);
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
      toeqit() {
        this.vaildator(() => {
          this.isupdate = true;
        }, {
          reject: () => {}
        })
      },
      updateClosed(timuinfo) {
        let arr = this.getArr;
        let index = arr.findIndex(tm => tm.tid === timuinfo.tid);
        if (index > -1) {
          arr.splice(index, 1, timuinfo);
          this.$nextTick(() => {
            this.getTitlesRect();
          })
        }
      },
      todelete() {
        this.vaildator(() => {
          Dialog.confirm({
            message: '您确定删除该题目吗?'
          }).then(() => {
            let { tid, quesid } = this.timuinfo;
            this.asyncDeleteTimu(tid, quesid, () => {
              if (!this.getArr.length && !this.timus[this.getType].finished) {
                return this.tomore(this.getType);
              }
              this.$nextTick(() => {
                this.getTitlesRect();
              })
            });
          }, () => {})
        }, {
          reject: () => {}
        })
      },
      checkOpera(key, val) {
        let qid = this.detail.qid;
        let info = { quesid: qid, [key]: val};
        this.asyncUpdateQuestOpt(info);
      },
      checkTab(index) {
        this.$nextTick(() => {
          let dom = this.$refs.contentRef;
          if (dom && dom.parentNode) {
            this.currtab = index;
            dom.parentNode.scrollTop = this.scrollTops[index];
          }
        })
      },
      tocreated(key) {
        this.createtype = key;
        this.iscreate = true;
      },
      tomore(key) {
        let qid = this.detail.qid;
        let { start, limit } = this.timus[key];
        this.asyncQueryTypes(key, qid, start, limit, () => {
          this.$nextTick(() => {
            this.getTitlesRect()
          })
        });
      },
      toComments() {
        this.iscomments = true;
      },
      totest() {
        Dialog.confirm({
          message: '您确定开始刷题吗？'
        }).then(() => {
          this[totestQuest](this.detail);
          this.$bus.$emit('openAnswers', true); // 进入到刷题页面
        }, () => {});
      },
      parseTime(time) {
        time = parsetimeData(time * 1000);
        return parseFormat('HH:mm:ss', time);
      },
      onsuccess(list, onclose) {
        let type = this.createtype;
        let arr = list.map(item => {
          if (type === 'shortanswers') {
            item.res = [item.res];
          } else {
            item.res = item.res.map(i => item.options[i]);
          }
          return item;
        });
        let qid = this.detail.qid;
        this.asyncCreateTimus(qid, arr, () => {
          this.$nextTick(() => {
            this.getTitlesRect()
          })
        }, onclose);
        this.loading = this.$toast.loading({
          message: '正在创建中',
          duration: 0
        });
      },
      async asyncQueryTimus(qid, start = 0, limit = 10) {
        let res = await this.queryTimus({qid, start, limit});
        if (res.status === 200 && res.data) {
          this.types.forEach(type => {
            let arr = res.data[type];
            this.timus[type] = new Template(type, arr, arr.length, limit, arr.length < limit);
          })
          this.$nextTick(() => {
            this.getTitlesRect()
          })
        }
      },
      async asyncQueryAboutuser(qid) {
        let res = await this.queryAboutuser(qid);
        if (res.status === 200) {
          this.operation = res.data;
        }
      },
      async asyncQueryTypes(type, qid, start = 0, limit = 10, func) {
        if (!type) return;
        let res;
        if (type === 'singles') {
          res = await this.querySingles({qid, start, limit});
        } else if (type === 'multis') {
          res = await this.queryMultis({qid, start, limit})
        } else {
          res = await this.queryShortAnswers({qid, start, limit})
        }
        if (res && res.status === 200 && res.data) {
          let timus = res.data[type];
          if (!timus.length) {
            return this.timus[type].finished = true;
          }
          let arr = this.timus[type][type];
          timus.forEach(timu => {
            let index = arr.findIndex(item => item.tid === timu.tid);
            if (index > -1) {
              arr.splice(index, 1);
            }
            arr.push(timu);
          })
          this.timus[type] = new Template(type, arr, start + timus.length, limit, timus.length < limit);
          if (func && typeof func === 'function') {
            func.call(this);
          }
        }
      },
      async asyncCreateTimus(qid, list, func, onclose) {
        let res = await this.createTimus({quesid: qid, list});
        if (res.status === 200) {
          let type = this.createtype;
          let {insertId: tid} = res.data;
          list.forEach((timu, index) => {
            timu.quesid = qid;
            timu.tid = tid + index;
            this.timus[type][type].push(timu);
          })
          this.loading.close();
          this.$toast.success({
            message: '创建成功',
            duration: 500,
            onClose: onclose
          });
          if (func && typeof func === 'function') func();
        }
      },
      async asyncDeleteTimu(tid, quesid, func) {
        let res = await this.deleteTimu({tid, quesid});
        if (res.status === 200) {
          let arr = this.getArr;
          let index = arr.findIndex(tm => tm.tid === tid);
          if (index > -1) {
            this.$toast.success({
              message: '创建成功',
              duration: 500,
              onClose: () => this.$refs.popup.closePopup()
            })
            arr.splice(index, 1);
            if (func && typeof func === 'function') func();
          }
        }
      },
      async asyncQueryRanklist(quesid, cb) {
        let res = await this.getRankListUser(quesid);
        let { status, data: arr } = res;
        if (status === 200) {
          this.ranklist = arr.sort((a,b) => a.finishtime - b.finishtime);
          if (typeof cb === 'function') cb();
        }
      },
      async asyncUpdateQuestOpt(info) {
        let res = await this.setQuestOpt(info);
        if (res.status === 200) {
          this.$toast('更新成功');
        }
      },
    },
    watch: {
      top(val) {
        let index = this.currtab;
        let prev = this.scrollTops[index];
        let next = this.scrollTops[index + 1];
        if (this.maxTop === val) return;
        if (val > next) {
          this.currtab += 1;
        } else if (val + 1 < prev && this.currtab >= 1) {
          this.currtab -= 1;
        }
      },
      isenter(val) {
        if (val) {
          this.init();
        }
      }
    },
    mounted() {
      this.init();
      this.quesDetailInfo(this.detail);
      let qid = this.detail.qid;
      this.asyncQueryTimus(qid, 0, 3);
      this.asyncQueryAboutuser(qid);
      this.asyncQueryRanklist(qid);
      this.$bus.$on('finishedTest', () => {
        this.asyncQueryRanklist(qid, () => {
          this.checkTab(this.tablist.length-1);
        });
      })
    },
  }
</script>

<style scoped lang="scss">
  @import "../../assets/css/base";
  .bank-detail {
    height: 100%;
    position: relative;
    background-color: #fff;
    .contain {
      height: calc(100% - 50px);
      overflow: auto;
      &::-webkit-scrollbar {
        width: 0 !important;
      }
    }
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
        border-bottom: 5px solid #f2f3f5;
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
      margin-bottom: 20px;
      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        color: #b1b1b1;
        margin-bottom: 5px;
        button {
          display: flex;
          align-items: center;
          padding: 1px 5px;
          border-radius: 5px;
          background-color: #5754fd;
          color: #fff;
        }
      }
      .timus {
        margin-bottom: 5px;
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
      .more {
        height: 25px;
        line-height: 25px;
        text-align: center;
        color: #797979;
        background-color: #f2f3f5;
        border-radius: 5px;
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
    .rank-list {
      .rank-item-info {
        margin-bottom: 5px;
        border-radius: 5px;
        background-color: #f2f3f5;
        display: flex;
        &.myself {
          background-color: #82abff;
          color: #fff;
        }
        .number {
          width: 40px;
          padding-right: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 30px;
            height: 30px;
          }
        }
        .username {
          flex: 1;
          line-height: 35px;
          padding: 3px 0;
          p {
            @include toEllipse(1);
          }
        }
        .use-time {
          padding-left: 5px;
          width: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
</style>