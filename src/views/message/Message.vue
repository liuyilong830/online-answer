<template>
  <div class="msg">
    <redirect-dialog>
      message
    </redirect-dialog>
  </div>
</template>

<script>
  import RedirectDialog from "../../components/content/redirectj-dialog/RedirectDialog";
  export default {
    name: "Message",
    components: {
      RedirectDialog,
    },
    data() {
      return {}
    },
    methods: {},
  }
</script>

<style scoped lang="scss">
  .msg {
    height: 100%;
    background-color: #fff;
  }
</style>