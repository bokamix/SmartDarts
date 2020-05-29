<template>
  <div class="home">
    <DartsBoard />
  </div>
</template>

<script>
// @ is an alias to /src
import DartsBoard from '@/components/darts/DartsBoard.vue';

export default {
  name: 'Home',
  components: {
    DartsBoard,
  },
};
</script>
