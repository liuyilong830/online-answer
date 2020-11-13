<template>
  <div class="pfl">
    <redirect-dialog>
      profile
    </redirect-dialog>
  </div>
</template>

<script>
  import RedirectDialog from "../../components/content/redirectj-dialog/RedirectDialog";
  export default {
    name: "Profile",
    components: {
      RedirectDialog,
    },
    data() {
      return {}
    },
    methods: {}
  }
</script>

<style scoped lang="scss">
  .pfl {
    height: 100%;
    background-color: #fff;
  }
</style>