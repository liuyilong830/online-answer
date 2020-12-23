<template>
  <div class="finish-question">
    <div class="content">
      <div class="bank">
        <p class="title">题库信息</p>
        <ul class="bank-info">
          <li class="item">
            <span class="item-title">名称</span>
            <span class="val">{{getqname}}</span>
          </li>
          <li class="item">
            <span class="item-title">描述</span>
            <span class="val">{{getDescription}}</span>
          </li>
          <li class="item">
            <span class="item-title">是否私有</span>
            <span class="val">{{ishidden}}</span>
          </li>
          <li class="item">
            <span class="item-title">是否只加入班级</span>
            <span class="val">{{istoclass}}</span>
          </li>
          <li class="item">
            <span class="item-title">封面</span>
            <img :src="getbg" alt="">
          </li>
        </ul>
      </div>
      <div class="multiple">
        <p class="title">选择题</p>
        <ul class="list" v-if="multiples.length">
          <li class="list-item" v-for="(item, i) in multiples.length" :key="item">
            <div class="round" @click="showMultipleInfo(i)">{{item}}</div>
          </li>
        </ul>
        <div class="normal" v-else>空</div>
      </div>
      <div class="shortanswer">
        <p class="title">简答题</p>
        <ul class="list" v-if="shortanswer.length">
          <li class="list-item" v-for="(item, i) in shortanswer.length" :key="item">
            <div class="round" @click="showAnswerInfo(i)">{{item}}</div>
          </li>
        </ul>
        <div class="normal" v-else>空</div>
      </div>
    </div>
    <div class="opeartion">
      <button class="prev-btn" @click="toprev">上一步</button>
      <button class="next-btn" @click="tofinish">完成</button>
    </div>
    <popup round :is-show.sync="isshow" :get-container="getBody()" @closed="closed">
      <div class="box-info">
        <div class="public">
          <p class="title">题目</p>
          <div class="text">{{info.tname}}</div>
        </div>
        <div class="public" v-if="ismult">
          <p class="title">选项</p>
          <ul class="options">
            <li class="option-item" v-for="(item, index) in info.options" :key="index">
              <span>{{`${formatTnum(index)}. ${item}`}}</span>
            </li>
          </ul>
        </div>
        <div class="public" v-if="info.res">
          <p class="title">正确答案</p>
          <p class="result">{{formatRes(info.res)}}</p>
        </div>
        <div class="public">
          <p class="title">答案解析</p>
          <p class="description">{{info.description}}</p>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import { deepClone } from '../../../util/util';
  import Dialog from "../../../components/dialog";
  import Popup from "../../../components/popup/Popup";
  export default {
    name: "FinishQuestion",
    components: {
      Popup,
    },
    data() {
      return {
        bank: {},
        multiples: [],
        shortanswer: [],
        isshow: false,
        ismult: false,
        info: {},
        iconname: '',
      }
    },
    inject: ['Release'],
    computed: {
      getqname() {
        return this.bank.qname || '空';
      },
      getDescription() {
        return this.bank.description || '空';
      },
      ishidden() {
        let {ishidden} = this.bank;
        return ishidden === 0 ? '否' : ishidden === 1 ? '是' : '未知';
      },
      istoclass() {
        let {istoclass} = this.bank;
        return istoclass === 0 ? '否' : istoclass === 1 ? '是' : '未知';
      },
      getbg() {
        return this.bank.icon || '';
      },
    },
    methods: {
      ...mapActions(['createQuesBank', 'createTimus']),
      toprev() {
        this.$emit('toprev');
      },
      tofinish() {
        Dialog.confirm({
          message: '确定根据相关配置项进行创建题库吗？'
        }).then(() => {
          this.loading = this.$toast.loading({
            message: '正在创建中',
            duration: 0
          })
          this.bank.createtime = Date.now();
          this.asyncCreateQuesBank({...this.bank, icon: this.iconname}, (qid) => {
            let multiples = deepClone(this.multiples);
            multiples = multiples.map(item => {
              item.res = item.res.map(i => item.options[i]);
              return item;
            });
            let list = [...multiples, ...this.shortanswer];
            this.asyncCreateTimus(qid, list);
          }, () => {});
        });
      },
      init() {
        this.$bus.$on('createQues', (bank, iconname) => {
          this.bank = bank;
          this.iconname = iconname;
        })
        this.$bus.$on('createMultiple', (multiples) => {
          this.multiples = multiples;
        })
        this.$bus.$on('createShortAnswer', (shortanswer) => {
          this.shortanswer = shortanswer;
        })
      },
      showMultipleInfo(index) {
        this.isshow = true;
        this.ismult = true;
        this.info = this.multiples[index];
      },
      showAnswerInfo(index) {
        this.isshow = true;
        this.info = this.shortanswer[index];
      },
      getBody() {
        return document.body;
      },
      formatTnum(num) {
        return String.fromCharCode(65 + num);
      },
      formatRes(res) {
        if (typeof res === 'string') {
          return res;
        } else {
          return res.map(i => this.formatTnum(i)).join('');
        }
      },
      closed() {
        this.info = {};
        this.ismult = false;
      },
      async asyncCreateQuesBank(bank, cb) {
        let res = await this.createQuesBank(bank);
        if (res.status === 200) {
          let { qid } = res.data;
          cb(qid)
        }
      },
      async asyncCreateTimus(quesid, list) {
        let res = await this.createTimus({quesid, list});
        console.log(res);
        if (res.status === 200) {
          this.loading.clear();
          this.$toast.success({
            message: '创建成功',
            duration: 1000,
            onClose: () => {
              this.Release.toclose();
            }
          });
        }
      },
    },
    mounted() {
      this.init();
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/css/base";
  .finish-question {
    width: 100vw;
    height: 100%;
    box-sizing: border-box;
    padding: 10px 15px 0;
    .content {
      height: calc(100% - 50px);
      overflow: auto;
      .bank, .multiple, .shortanswer {
        margin-bottom: 10px;
      }
      .normal {
        height: 40px;
        border-radius: 10px;
        background-color: #fff;
        color: #ccc;
        font-size: 16px;
        text-align: center;
        line-height: 40px;
      }
      .title {
        font-size: 12px;
        color: #b1b1b1;
        padding-left: 4px;
        margin-bottom: 5px;
      }
      .bank-info {
        border-radius: 10px;
        background-color: #fff;
        box-sizing: border-box;
        padding: 0 10px;
        .item {
          height: 40px;
          border-bottom: 1px solid #cccccc52;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 15px;
          .item-title {
            padding-right: 15px;
          }
          .val {
            flex: 1;
            text-align: right;
            @include toEllipse(1);
          }
          img {
            height: 70%;
          }
        }
        & .item:nth-last-child(1) {
          border-bottom: none;
        }
      }
      .list {
        border-radius: 10px;
        background-color: #fff;
        display: flex;
        flex-wrap: wrap;
        .list-item {
          width: calc(100% / 8);
          display: flex;
          justify-content: center;
          padding: 10px 0;
          .round {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: #1989fa;
            text-align: center;
            line-height: 30px;
            color: #fff;
          }
        }
      }
      &::-webkit-scrollbar {
        width: 0 !important;
      }
    }
    .opeartion {
      height: 40px;
      margin-top: 10px;
      text-align: right;
      button {
        padding: 3px 10px;
        border-radius: 5px;
        margin-left: 10px;
        background-color: #5754fd;
        color: #fff;
      }
    }
  }
  .box-info {
    width: 290px;
    background-color: #fff;
    box-sizing: border-box;
    padding: 10px;
    .public {
      margin-bottom: 10px;
      .title {
        font-size: 12px;
        color: #b1b1b1;
        padding-left: 4px;
        margin-bottom: 5px;
      }
      .text {
        min-height: 30px;
        max-height: 60px;
        overflow: auto;
        font-size: 15px;
        display: flex;
        align-items: center;
        &::-webkit-scrollbar {
          width: 0 !important;
        }
      }
      .options {
        max-height: 200px;
        padding: 5px 0;
        border-top: 1px solid #ccc;
        overflow: auto;
        &::-webkit-scrollbar {
          width: 0 !important;
        }
        .option-item {
          min-height: 30px;
          border-radius: 10px;
          background-color: #f2f3f5;
          border: 1px solid #ccc;
          display: flex;
          align-items: center;
          padding: 0 5px;
          margin-bottom: 5px;
        }
      }
      .result {
        min-height: 30px;
        display: flex;
        align-items: center;
        padding: 0 5px;
      }
      .description {
        min-height: 50px;
        max-height: 100px;
        overflow: auto;
        border-radius: 10px;
        background-color: #f2f3f5;
        border: 1px solid #ccc;
        display: flex;
        align-items: center;
        padding: 0 5px;
        &::-webkit-scrollbar {
          width: 0 !important;
        }
      }
    }
  }
</style>