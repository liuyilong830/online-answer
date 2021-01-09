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
    updateZIndex(i = 0) {
      this.zIndex = index += 1 + i;
    },
  }
}

export default onlyZIndex;