<template>
  <div>
    <TraductionMap></TraductionMap>
    <NavLeft></NavLeft>
    <NavRight></NavRight>
    <TextToBitmap></TextToBitmap>
  </div>
</template>




<script>
import '/imports/api/texts.js';
import NavLeft from '/imports/ui/NavLeft.vue'
import NavRight from '/imports/ui/NavRight.vue'
import TraductionMap from '/imports/ui/TraductionMap.vue'
import TextToBitmap from '/imports/ui/TextToBitmap'

export default {

  components: {
    TraductionMap : TraductionMap,
    NavLeft : NavLeft,
    NavRight : NavRight,
    TextToBitmap : TextToBitmap,
  },
}


</script>



<style scoped>

</style>