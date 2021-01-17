<template>
  <div class="profile-redirect">
    <redirect-dialog>
      <profile/>
    </redirect-dialog>
  </div>
</template>

<script>
  import RedirectDialog from "@/components/content/redirectj-dialog/RedirectDialog";
  import Profile from "@/views/profile/Profile";
  export default {
    name: 'ProfileRedirect',
    components: {
      RedirectDialog,
      Profile,
    },
  }
</script>

<style scoped>
  .profile-redirect {
    height: calc(100% - 50px);
  }
</style>
