<template>
  <div class="update-timu">
    <nav-bar :style="navbarStyle">
      <template #left>
        <span @click.stop="toclose">取消</span>
      </template>
      <div class="update-title">修改</div>
      <template #right><i></i></template>
    </nav-bar>
    <div class="update-content">
      <template v-if="getType === 'single'">
        <single-or-multi-timu isedit :edit-info="value" @submit="updateTimu" />
      </template>
      <template v-else-if="getType === 'multi'">
        <single-or-multi-timu ismulti isedit :edit-info="value" @submit="updateTimu" />
      </template>
      <template v-else-if="getType === 'fill'">
        <fill-timu-form isedit :edit-info="value" @submit="updateTimu" />
      </template>
    </div>
  </div>
</template>

<script>
  import NavBar from "../../nav-bar/NavBar";
  import SingleOrMultiTimu from "@/components/content/form/SingleOrMultiTimu";
  import FillTimuForm from "@/components/content/form/FillTimuForm";
  import { mapActions, mapGetters } from 'vuex';
  export default {
    name: "UpdateTimu",
    components: {
      NavBar,
      SingleOrMultiTimu,
      FillTimuForm,
    },
    data() {
      return {}
    },
    inject: {
      'model': {
        from: 'box1'
      }
    },
    props: {
      value: Object,
    },
    computed: {
      ...mapGetters(['getQuesDetail']),
      navbarStyle() {
        return {
          backgroundColor: 'transparent',
          borderBottom: 'none',
          boxShadow: 'none'
        }
      },
      getType() {
        let { res_json, res_count } = this.value;
        if (Array.isArray(res_json)) {
          return 'fill';
        } else if (typeof res_count === 'number') {
          return 'multi';
        } else {
          return 'single';
        }
      },
    },
    methods: {
      ...mapActions(['updateTypeTimu']),
      toclose() {
        this.model.toclose();
      },
      async updateTimu(form) {
        this.updateTypeTimu({
          ...form,
          type: this.getType,
          id: this.value.tid,
        }).then(() => {
          this.$toast('更新成功');
          this.toclose();
          this.$emit('closed', { ...this.value, ...form });
        }).catch(() => {
          this.$toast('系统出现异常，请稍后再试~');
        })
      },
    }
  }
</script>

<style scoped lang="scss">
  .update-timu {
    height: 100%;
    box-sizing: border-box;
    padding: 0 15px 10px;
    display: flex;
    flex-direction: column;
    .update-title {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 15px;
    }
    .update-btn {
      padding: 5px 10px;
      border-radius: 30px;
      background-color: #e4e4e4;
      color: #c1c0c0;
      &.btn-active {
        color: #fff;
        background-color: #5754fd;
      }
    }
    .update-content {
      flex: 1;
      overflow: auto;
      @import "../../../assets/css/form";
      &::-webkit-scrollbar {
        width: 0 !important;
      }
    }
  }
</style>