<template>
  <div class="questions-create">
    <div class="content">
      <div class="question-name public">
        <p class="title">题库名称</p>
        <input type="text" placeholder="请输入题库名称" v-model="form.qname" maxlength="16">
        <p class="description">名称长度限制为16个字</p>
      </div>
      <div class="question-desc public">
        <p class="title">题库描述</p>
        <textarea placeholder="吸引人的描述能够增加题库的曝光度哟" v-model="form.description"></textarea>
      </div>
      <div class="question-ishidden public">
        <p class="title">是否将题库私有</p>
        <div class="checkbox">
          <span :class="{item: true, active: form.ishidden === 0}" @click="changeHidden">否</span>
          <sub class="dot"></sub>
          <span :class="{item: true, active: form.ishidden === 1}" @click="changeHidden">是</span>
        </div>
      </div>
      <div class="question-istoclass public">
        <p class="title">是否将题库设置为只出现在班级内（仅供教师选择）</p>
        <div class="checkbox" v-if="isTea">
          <span :class="{item: true, active: form.istoclass === 0}" @click="changeToCls(false)">否</span>
          <sub class="dot"></sub>
          <span :class="{item: true, active: form.istoclass === 1}" @click="changeToCls(true)">是</span>
        </div>
        <div class="checkbox" v-else>
          <span class="item active">否</span>
        </div>
      </div>
      <div class="public" v-if="cls.length">
        <p class="title">选择需要该题库的班级</p>
        <ul class="cls-list">
          <li class="list-item" v-for="item in cls" :key="item.classid">
            <div class="item-text" :class="{active: form.cls.includes(item.classid)}" @click="checkCls(item)">{{item.classname}}</div>
          </li>
        </ul>
      </div>
      <div class="question-bg public">
        <p class="title">设置题库的封面图</p>
        <div class="bg">
          <div class="upload">
            <i class="iconfont icon-jiahao"></i>
            <input type="file" @change="changeFile" accept="image/*" ref="file">
          </div>
          <transition name="img">
            <div class="view" v-if="form.icon">
              <img :src="form.icon" alt="">
              <div class="mask"><i class="iconfont icon-lajitong" @click="todeleteImg"></i></div>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <div class="next">
      <button :class="{disable: isdisable}" @click.stop="tonext">下一步</button>
    </div>
  </div>
</template>

<script>
  import Toast from "../../toast";
  import { root } from '../../../util/Mixin';
  import { mapActions } from 'vuex';
  export default {
    name: "QuestionsCreate",
    data() {
      return {
        form: {
          qname: '',
          description: '',
          ishidden: 0,
          istoclass: 0,
          icon: '',
          cls: [],
        },
        cls: [],
      }
    },
    mixins: [root],
    computed: {
      isdisable() {
        return !this.form.qname || !this.form.icon;
      },
    },
    methods: {
      ...mapActions(['getCreatedCls', 'uploadImg', 'deleteImg']),
      changeHidden() {
        this.form.ishidden = this.form.ishidden ? 0 : 1;
      },
      async changeToCls(flag) {
        if (!this.isTea) return;
        this.form.istoclass = this.form.istoclass ? 0 : 1;
        if (flag) {
          let res = await this.getCreatedCls();
          this.cls = res.data;
        } else {
          this.cls = [];
        }
      },
      checkCls(cls) {
        let index = this.form.cls.findIndex(classid => classid === cls.classid);
        if (index > -1) {
          this.form.cls.splice(index, 1);
        } else {
          this.form.cls.push(cls.classid);
        }
      },
      changeFile(e) {
        let file = e.target.files[0];
        console.log(file);
        this.asyncUploadImg(file);
        // this.form.icon = 'http://localhost:5000/img/356.jpg';
      },
      todeleteImg() {
        this.$refs.file.value = '';
        this.form.icon = '';
        this.asyncDeleteImg(this.filename);
      },
      validation() {
        let { qname, icon } = this.form;
        if (!qname || qname.length > 16) {
          Toast('题库名称是必填的，且长度不得超过16个字');
        } else if (!icon) {
          Toast('请选择一个题库的封面图片');
        } else {
          return true;
        }
      },
      tonext() {
        if (!this.validation()) return;
        this.$bus.$emit('createQues', this.form, this.filename);
        this.$emit('tonext');
      },
      async asyncUploadImg(file) {
        let res = await this.uploadImg(file);
        console.log(res);
        let { path, filename } = res.data;
        this.form.icon = path;
        this.filename = filename;
      },
      async asyncDeleteImg(filename) {
        await this.deleteImg(filename);
      }
    },
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/css/base";
  @mixin desc{
    font-size: 12px;
    color: #b1b1b1;
    padding-left: 4px;
  }
  .questions-create {
    width: 100vw;
    height: 100%;
    box-sizing: border-box;
    padding: 10px 15px 0;
    .content {
      height: calc(100% - 50px);
      overflow: auto;
      &::-webkit-scrollbar {
        width: 0 !important;
      }
    }
    .next {
      height: 40px;
      margin-bottom: 10px;
      text-align: right;
      padding-top: 10px;
      button {
        padding: 3px 10px;
        border-radius: 5px;
        background-color: #5754fd;
        color: #fff;
        &.disable {
          background-color: #e4e4e4;
          color: #c1c0c0;
        }
      }
    }
    .public {
      margin-bottom: 10px;
      .title {
        @include desc;
        margin-bottom: 5px;
      }
      input {
        width: 100%;
        height: 40px;
        border-radius: 10px;
        box-sizing: border-box;
        padding: 5px 10px;
      }
      textarea {
        width: 100%;
        height: 140px;
        border-radius: 10px;
        box-sizing: border-box;
        padding: 5px 10px;
      }
      .description {
        padding-top: 5px;
        @include desc;
      }
      .checkbox {
        position: relative;
        height: 40px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        background-color: #fff;
        overflow: hidden;
        .item {
          height: 100%;
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          &.active {
            background-color: #5754fd;
            color: #fff;
          }
        }
        .dot {
          width: 1px;
          height: 80%;
          background-color: #ccc6;
        }
      }
      .bg {
        border-radius: 10px;
        padding: 5px 10px;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        .upload {
          position: relative;
          width: 150px;
          height: 150px;
          border: 1px dashed #5754fd;
          border-radius: 10px;
          input {
            width: 100%;
            height: 100%;
            opacity: 0;
          }
          .iconfont {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 20px;
            color: #5754fd;
          }
        }
        .view {
          position: relative;
          width: 150px;
          height: 150px;
          overflow: hidden;
          border: 1px solid #ccc6;
          border-radius: 10px;
          display: flex;
          align-items: center;
          img {
            width: 100%;
          }
          .mask {
            position: absolute;
            top: 0;
            right: 0;
            width: 25px;
            height: 25px;
            border-top-right-radius: 10px;
            border-bottom-left-radius: 10px;
            background-color: rgba(0,0,0, .7);
            display: flex;
            align-items: center;
            justify-content: center;
            .iconfont {
              color: #fff;
            }
          }
          &.img-enter, &.img-leave-to {
            opacity: 0;
          }
          &.img-enter-active, &.img-leave-active {
            transition: all .3s;
          }
        }
      }
      .cls-list {
        max-height: 150px;
        background-color: #fff;
        border-radius: 10px;
        box-sizing: border-box;
        padding: 5px;
        display: flex;
        flex-wrap: wrap;
        .list-item {
          width: 50%;
          box-sizing: border-box;
          padding: 5px;
          .item-text {
            text-align: center;
            height: 30px;
            line-height: 30px;
            background-color: #1989fa;
            border-radius: 7px;
            color: #fff;
            @include toEllipse(1);
            &.active {
              background-color: #5754fd;
            }
          }
        }
      }
    }
  }
</style>