<template>
  <div class="home main-content">
    <div class="container">
      <new-patch></new-patch>
  </div>
    </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';
import NewPatch from '@/components/NewPatch.vue'

@Component({
  name: 'Home',
  components: {
    NewPatch
  }
})
export default class Index extends Vue {
}
</script>
