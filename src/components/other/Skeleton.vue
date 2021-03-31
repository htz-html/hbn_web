<template>
  <div :style="style"></div>
</template>

<script>
export default {
  props: {
    circle: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "1em"
    },
    position: {
      type: String,
      default: "left"
    },
    square: {
      type: Boolean,
      default: false
    },
    background: {
      type: String,
      default: "#eeeeee80"
    }
  },
  computed: {
    style() {
      let height = this.square ? this.width : this.height;
      let style = `width:${this.width};height:${height};background: ${this.background}`;
      if (this.circle) {
        style += "borderRadius:50%;";
      }
      return style;
    }
  }
};
</script>

<style lang="scss" scoped>
div {
  display: inline-block;

  vertical-align: middle;
}
</style>
