<template>
  <p>
    <span class="label" :style="{ width: labelWidth, height: labelHeight }">{{
      label
    }}</span>
    <span>：</span>
    <span v-if="content">{{ content }}</span>
    <slot name="content"></slot>
  </p>
</template>

<script>
export default {
  props: {
    label: {
      type: [String, Number]
    },
    content: {
      type: [String, Number]
    },
    labelWidth: {
      type: String,
      default: "4.4em"
    },
    labelHeight: {
      type: String,
      default: "1.5em"
    }
  }
};
</script>

<style lang="scss" scoped>
p {
  font-size: 14px;
}

.label {
  display: inline-block;

  text-align: justify;
  vertical-align: top;

  &::after {
    content: "";

    display: inline-block;

    width: 100%;
  }
}
</style>
