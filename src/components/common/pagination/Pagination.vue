<template>
  <div class="pt-pagination">
    <ul class="pt-pagination-list">
      <li :class="prevBtnClass" @click="prevBtnClick">
        <slot name="prev-text">{{this.prevText}}</slot>
      </li>
      <li class="pt-pagination-item pt-pagination-simple" v-if="mode === 'simple'">{{value}} / {{pageCount}}</li>
      <li :class="getItemsClass(item)" v-else v-for="item in list" :key="item.key" @click="itemsClick(item)">
        <slot :active="item.key === value" :text="item.text">{{item.text}}</slot>
      </li>
      <li :class="nextBtnClass" @click="nextBtnClick">
        <slot name="next-text">{{this.nextText}}</slot>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "Pagination",
    data() {
      return {
        pageCount: 0,
        list: [],
      }
    },
    props: {
      value: Number,
      mode: {
        type: String,
        default: 'multi',
        vaildator(value) {
          return value === 'multi' || value === 'simple';
        }
      },
      prevText: { type: String, default: '上一页' },
      nextText: { type: String, default: '下一页' },
      totalItems: { type: [Number, String], default: 0 },
      itemsPerPage: { type: [Number, String], default: 10 },
      showPageSize: { type: [Number, String], default: 5 },
      forceEllipses: { type: Boolean, default: false },
    },
    computed: {
      formatTotalItems() {
        return parseInt(this.totalItems);
      },
      formatItemsPerPage() {
        return parseInt(this.itemsPerPage);
      },
      prevBtnClass() {
        let cls = ['pt-pagination-item', 'pt-pagination-btn'];
        if (this.value <= 1) {
          cls.push('btn-disable');
        }
        return cls;
      },
      nextBtnClass() {
        let cls = ['pt-pagination-item', 'pt-pagination-btn'];
        if (this.value >= this.pageCount) {
          cls.push('btn-disable');
        }
        return cls;
      },
    },
    methods: {
      setPageCount() {
        let num = this.formatTotalItems / this.formatItemsPerPage;
        if (num !== parseInt(num)) {
          num = Math.ceil(num);
        }
        this.pageCount = num;
      },
      getItemsClass(item) {
        let cls = ['pt-pagination-item', 'pt-pagination-page'];
        if (item.key === this.value) {
          cls.push('pt-pagination-active');
        }
        return cls;
      },
      prevBtnClick() {
        if (this.value <= 1) return;
        this.onChange(this.value-1);
      },
      itemsClick(item) {
        let num = item.key;
        if (num === this.value) {
          return;
        } else if (num === '-') {
          num = this.list[1].key - 1;
        } else if (num === '+') {
          num = this.list[this.list.length-2].key + 1;
        }
        this.onChange(num);
      },
      nextBtnClick() {
        if (this.value >= this.pageCount) return;
        this.onChange(this.value+1);
      },
      onChange(value) {
        this.$emit('input', value);
        this.$emit('change');
      },
      setList(val) {
        let arr = [];
        let start = val;
        let end = start;
        arr.push({ text: start.toString(), key: start });
        while (arr.length < this.showPageSize) {
          if (--start > 0) {
            arr.unshift({ text: start.toString(), key: start });
          }
          if (arr.length >= this.showPageSize) break;
          if (++end <= this.pageCount) {
            arr.push({ text: end.toString(), key: end });
          }
        }
        if (this.forceEllipses) {
          if (arr[0].key !== 1) arr.unshift({ text: '...', key: '-' });
          if (arr[arr.length-1].key !== this.pageCount) arr.push({ text: '...', key: '+' });
        }
        this.list = arr;
      },
    },
    created() {
      this.setPageCount();
      this.setList(1);
    },
    watch: {
      value(newVal) {
        this.setList(newVal);
      }
    }
  }
</script>

<style scoped lang="scss">
  .pt-pagination {
    padding: 10px 15px;
    .pt-pagination-list {
      height: 40px;
      display: flex;
      font-size: 14px;
      color: #5754fd;
      & .pt-pagination-item:nth-of-type(2) {
        border-left: solid 1px #f1f1f1;
      }
      .pt-pagination-item {
        height: 100%;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        &.pt-pagination-simple {
          background-color: transparent;
          border: none;
          color: #666;
        }
        &.pt-pagination-btn.btn-disable {
          color: #646566;
          background-color: #f7f8fa;
          opacity: 0.5;
        }
        &.pt-pagination-page {
          flex-grow: 0;
          min-width: 36px;
          border-right: solid 1px #f1f1f1;
        }
        &.pt-pagination-active {
          background-color: #5754fd;
          color: #fff;
        }
      }
    }
  }
</style>