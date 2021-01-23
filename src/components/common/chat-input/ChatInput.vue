<template>
  <div class="chat-input">
    <div class="chat-content">
      <input
        type="text"
        ref="inputRef"
        :placeholder="placeholder || '发布评论'"
        :value="value"
        @input="$emit('input', $event.target.value)"
        @blur="onblur"
      />
    </div>
    <div class="chat-operations">
      <span class="send-btn" :class="{active: value !== ''}" @click="tosend">发送</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ChatInput",
    data() {
      return {}
    },
    props: {
      value: String,
      placeholder: String,
    },
    methods: {
      tosend() {
        this.$emit('send', this.value)
      },
      focus() {
        this.$refs.inputRef.focus()
      },
      onblur() {
        this.$emit('onblur');
      },
    },
  }
</script>

<style lang="scss" scoped>
  .chat-input {
    width: 100vw;
    height: 45px;
    box-sizing: border-box;
    padding: 3px 5px;
    border-top: 1px solid #e6e6e6;
    display: flex;
    .chat-content {
      flex: 1;
      input {
        box-sizing: border-box;
        padding: 0 10px 0 5px;
        width: 100%;
        height: 100%;
        font-size: 15px;
        border: none;
      }
    }
    .chat-operations {
      display: flex;
      align-items: center;
      .send-btn {
        padding: 3px 5px;
        color: #ccc;
        &.active {
          color: #5754fd;
        }
      }
    }
  }
</style>