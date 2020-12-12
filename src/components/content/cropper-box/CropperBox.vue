<template>
  <transition name="cropper">
    <div class="cropper-box" v-if="value">
      <div class="content">
        <vueCropper
          ref="cropper"
          :style="cropperStyle"
          :img="options.img"
          :info="options.info"
          :outputSize="options.outputSize"
          :outputType="options.outputType"
          :full="options.full"
          :canMove="options.canMove"
          :original="options.original"
          :canMoveBox="options.canMoveBox"
          :autoCrop="options.autoCrop"
          :centerBox="options.centerBox"
          :autoCropWidth="options.autoCropWidth"
          :autoCropHeight="options.autoCropHeight"
          :fixedBox="options.fixedBox"
          :fixedNumber="options.fixedNumber"
        ></vueCropper>
      </div>
      <div class="cropper-title">裁剪图片</div>
      <div class="opeartion-btn">
        <button @click.stop="toclose">取消</button>
        <button class="ok" @click.stop="getImageData">确定</button>
      </div>
    </div>
  </transition>
</template>

<script>
  import { VueCropper }  from 'vue-cropper';
  import { mapActions } from 'vuex';
  export default {
    name: "CropperBox",
    components: {
      VueCropper,
    },
    data() {
      return {
        options: {
          img: '',
          info: false,
          outputSize: 1, // 剪切后的图片质量（0.1-1）
          full: false, // 输出原图比例截图 props名full
          outputType: 'jpg',
          canMove: false,
          original: true,
          canMoveBox: true,
          autoCrop: true,
          centerBox: true,
          autoCropWidth: 375,
          autoCropHeight: 375,
          fixedBox: true,
          maxImgSize: 3000, // 图片最大像素
          fixedNumber: [1, 1]
        }
      }
    },
    computed: {
      cropperStyle() {
        return {
          backgroundColor: '#000',
          backgroundImage: 'none'
        }
      },
    },
    props: {
      value: Boolean,
    },
    methods: {
      ...mapActions(['uploadImg']),
      toBase64Image(image) {
        let canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        let ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, image.width, image.height);
        return canvas.toDataURL('image/png');
      },
      setImg(url) {
        let image = new Image();
        image.src = url;
        image.crossOrigin = 'anonymous';
        image.onload = () => {
          let base64 = this.toBase64Image(image);
          this.options.img = base64;
        }
      },
      toclose() {
        this.$emit('input', false);
      },
      getImageData() {
        this.$refs.cropper.getCropBlob(async (data) => {
          let file = new File([data], encodeURI('老地方树结构.png'), { type: data.type })
          let res = await this.uploadImg(file);
          console.log(res);
        })
      },
    },
    created() {
      this.setImg('https://avatars2.githubusercontent.com/u/15681693?s=460&v=4');
    }
  }
</script>

<style scoped lang="scss">
  .cropper-box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 100;
    background-color: #fff;
    .content {
      height: 100%;
    }
    .cropper-title {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #fff;
      font-size: 16px;
    }
    .opeartion-btn {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      box-sizing: border-box;
      height: 40px;
      padding: 0 10px;
      overflow: hidden;
      button {
        float: left;
        padding: 4px 10px;
        font-size: 13px;
        border-radius: 20px;
        color: #fff;
        background-color: #000;
        &.ok {
          float: right;
          background-color: #5754fd;
        }
      }
    }
    &.cropper-enter, &.cropper-leave-to {
      top: 60px;
      opacity: 0;
    }
    &.cropper-enter-active, &.cropper-leave-active {
      transition: all .3s;
    }
  }
</style>