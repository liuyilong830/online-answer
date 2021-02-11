<template>
  <div class="profile-collection">
    <ul class="collections-list">
      <li class="collection-item" @click="toQuesCollection">
        <div class="text">
          <i class="iconfont icon-shoucangjia"></i>
          <span>题库收藏夹</span>
        </div>
      </li>
      <li class="collection-item" @click="toTimuCollection">
        <div class="text">
          <i class="iconfont icon-shoucangjia"></i>
          <span>题目收藏夹</span>
        </div>
      </li>
    </ul>
    <popup
      :is-show.sync="isshow"
      round
      position="bottom"
      :box-style="{height: '70vh'}"
    >
      <div class="title">{{popupTitle}}</div>
      <div class="content">
        <questions-list v-if="!istimu" :list="list" :mode="2" @tobank="tobank"/>
        <ul class="collections" v-else>
          <li class="timu-list-item" v-for="timu in list" :key="timu.tid">
            <timu-card :timu="timu" @click.native="toTimu(timu)" />
          </li>
        </ul>
      </div>
    </popup>
    <model-box1 v-model="isdetaled" @enterd="isenter = true" @closed="isenter = false">
      <bank-detail :detail="detailinfo" :isenter="isenter"/>
    </model-box1>
    <popup :is-show.sync="istimudetail" round :box-style="{padding: '5px'}">
      <timu-card-two :timu="timuinfo"/>
    </popup>
  </div>
</template>

<script>
  import Popup from "@/components/popup/Popup";
  import QuestionsList from "@/components/content/questions/QuestionsList";
  import ModelBox1 from "@/components/content/model-box/ModelBox1";
  import BankDetail from "@/views/bank/BankDetail";
  import TimuCard from "@/components/content/timu/TimuCard";
  import TimuCardTwo from "@/components/content/timu/TimuCardTwo";
  import { mapActions } from 'vuex';
  import islogin from '@/util/mixins/islogin'
  export default {
    name: "ProfileCollection",
    components: {
      Popup,
      QuestionsList,
      ModelBox1,
      BankDetail,
      TimuCard,
      TimuCardTwo,
    },
    mixins: [islogin],
    data() {
      return {
        isshow: false,
        istimu: false,
        list: [],
        detailinfo: null,
        isdetaled: false,
        isenter: false,
        timuinfo: null,
        istimudetail: false,
      }
    },
    computed: {
      popupTitle() {
        return this.istimu ? '题目收藏' : '题库收藏';
      },
    },
    methods: {
      ...mapActions(['queryCollections']),
      toQuesCollection() {
        this.vaildator(() => {
          this.isshow = true;
          this.istimu = false;
          this.list = [];
          this.queryCollections(false).then(res => {
            if (res.status === 200) {
              this.list = res.data;
            }
          })
        }, {
          reject: () => {}
        })
      },
      toTimuCollection() {
        this.vaildator(() => {
          this.isshow = true;
          this.istimu = true;
          this.list = [];
          this.queryCollections(true).then(res => {
            if (res.status === 200) {
              this.list = res.data;
            }
          })
        }, {
          reject: () => {}
        })
      },
      tobank(info) {
        this.detailinfo = info;
        this.isdetaled = true;
      },
      toTimu(timu) {
        this.timuinfo = timu;
        this.istimudetail = true;
      },
    },
  }
</script>

<style lang="scss" scoped>
  .profile-collection {
    .collection-item {
      height: 70px;
      border-radius: 5px;
      margin-bottom: 20px;
      box-shadow: 0px 0px 4px 2px #dedede;
      box-sizing: border-box;
      padding: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-image: linear-gradient(to left, #2fd5fb, #3db4fb);
      &:nth-last-of-type(1) {
        background-image: linear-gradient(to left, #2ffbe8, #fbb83d);
      }
      .text {
        color: #fff;
        font-size: 20px;
        display: flex;
        align-items: center;
        .iconfont {
          padding-right: 10px;
          font-size: 18px;
        }
      }
    }
    .title {
      box-sizing: border-box;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 16px;
      border-bottom: 1px solid #f2f3f5;
    }
    .content {
      height: calc(100% - 40px);
      box-sizing: border-box;
      padding: 5px 15px 0;
      &::-webkit-scrollbar {
        width: 0 !important;
      }
      .timu-list-item {
        margin-bottom: 15px;
      }
    }
  }
</style>