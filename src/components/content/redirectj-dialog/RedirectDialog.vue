<template>
  <div class="rict-dlg">
    <div class="rict-dlg-normal" v-if="isShow"></div>
    <div class="rict-dlg-content" v-else>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import Dialog from "../../dialog";
  export default {
    name: "RedirectDialog",
    data() {
      return {
        isShow: false,
      }
    },
    methods: {
      ...mapActions(['isLogined']),
      openDialog() {
        this.isShow = true;
        this.$emit('isrender', false);
        Dialog.confirm({
          message: '您还未登录哟，请麻烦进行登录!'
        }).then(() => {
          this.$router.replace('/login');
        }, () => {
          this.$router.replace('/home');
        })
      }
    },
    async created() {
      let token = window.localStorage.getItem('token');
      if (!token) {
        this.openDialog();
      } else {
        let res = await this.isLogined();
        if (res.status === 401) {
          this.openDialog();
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .rict-dlg {
    height: 100%;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0 !important;
    }
    .rict-dlg-normal {
      background-color: #fff;
      height: 100%;
    }
  }
</style>