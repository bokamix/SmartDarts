<template>
  <div class="wrapper">
    <div id="dartboard" style="width: 400px; height: 400px;"></div>
    Punkty Dawida: {{ punktyDawida }}
  </div>
</template>
<script>
import Dartboard from './src/dartboard';
/* eslint-disable */

export default {
  data() {
    return {
      punktyDawida: 0,
    };
  },
  mounted() {
    this.createDash();
  },
  methods: {
    createDash() {
      const dartboard = new Dartboard('#dartboard');
      dartboard.render();
      document.querySelector('#dartboard').addEventListener('throw', (d) => {
        console.log(d.detail);
        this.punktyDawida = this.punktyDawida + d.detail.score;
      });
    },
  },
};
</script>

<style lang='scss' scoped>
.wrapper {
  width: 1000px;
  height: 1000px;
}
</style>
