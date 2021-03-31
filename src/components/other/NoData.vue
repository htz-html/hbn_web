<template>
  <div v-if="noData">
    <img :src="noDataImg" />
  </div>
</template>

<script>
export default {
  props: {
    noData: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      noDataImg: require("@/assets/Nodata.png")
    };
  }
};
</script>

<style lang="scss" scoped>
div {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  img {
    width: 40vw;
  }

  span {
    margin: 20px;

    font-size: 16px;
  }
}
</style>
