<template>
  <div class="msg-redirect">
    <redirect-dialog>
      <message/>
    </redirect-dialog>
  </div>
</template>

<script>
  import RedirectDialog from "@/components/content/redirectj-dialog/RedirectDialog";
  import Message from "@/views/message/Message";
  export default {
    name: "MessageRedirect",
    components: {
      RedirectDialog,
      Message,
    },
  }
</script>

<style scoped>
  .msg-redirect {
    height: calc(100% - 50px);
  }
</style>