<template>
  <div class="cls-create">
    <div class="cls-list">
      <div class="list-text">班级名称：</div>
      <div class="list-input">
        <input type="text" placeholder="请输入班级名称" :value="classname" @input="$emit('update:classname', $event.target.value)">
      </div>
    </div>
    <div class="cls-list">
      <div class="list-text">描述信息：</div>
      <div class="list-input">
        <textarea placeholder="请输入该班级的一些描述信息" :value="description" @input="$emit('update:description', $event.target.value)"></textarea>
      </div>
    </div>
    <div class="cls-submit" @click.stop="toCreate">提交</div>
  </div>
</template>

<script>
  import Dialog from "../../../../components/dialog";
  import Toast from "../../../../components/toast";
  export default {
    name: "ClassCreate",
    data() {
      return {}
    },
    props: {
      classname: String,
      description: String,
    },
    methods: {
      toCreate() {
        if (!this.validation()) return;
        Dialog.confirm({
          message: '你确定吗'
        }).then(res => {
          this.$emit('toCreateClass');
        })
      },
      validation() {
        if (this.classname === '') {
          Toast('班级名称不能为空', 1000);
          return false;
        } else {
          return true;
        }
      }
    },
  }
</script>

<style scoped lang="scss">
  .cls-create {
    padding: 0 10px;
    .cls-list {
      display: flex;
      margin-bottom: 10px;
      .list-text {
        padding-right: 3px;
        line-height: 35px;
      }
      .list-input {
        flex: 1;
        font-size: 16px;
        input {
          width: 100%;
          height: 35px;
          border: 1px solid #666;
          border-radius: 5px;
        }
        textarea {
          width: 100%;
          height: 100px;
          border: 1px solid #666;
          border-radius: 5px;
        }
      }
    }
    .cls-submit {
      height: 35px;
      text-align: center;
      line-height: 35px;
      background-color: #5754fd;
      color: #fff;
      font-size: 16px;
      border-radius: 5px;
      margin-bottom: 10px;
    }
  }
</style>