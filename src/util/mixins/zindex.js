let index = 100;
const onlyZIndex = {
  data() {
    return {
      zIndex: index++
    }
  },
  computed: {
    zindexStyle() {
      return {
        zIndex: this.zIndex,
      }
    }
  },
  methods: {
    updateZIndex(index = 0) {
      this.zIndex += 1 + index;
    },
  }
}

export default onlyZIndex;