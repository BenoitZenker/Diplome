<template>
  <div>
    <TraductionMap></TraductionMap>
    <NavLeft></NavLeft>
    <NavRight></NavRight>
    <LSystemToBitmap></LSystemToBitmap>
  </div>
</template>




<script>
import NavLeft from '/imports/ui/NavLeft.vue'
import NavRight from '/imports/ui/NavRight.vue'
import TraductionMap from '/imports/ui/TraductionMap.vue'
import LSystemToBitmap from '/imports/ui/LSystemToBitmap/LSystemToBitmap.vue'

export default {

  components: {
    TraductionMap : TraductionMap,
    NavLeft : NavLeft,
    NavRight : NavRight,
    LSystemToBitmap : LSystemToBitmap,
  },
}


</script>



<style scoped>

</style>