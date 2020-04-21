<template>
  <div>
    <TraductionMap></TraductionMap>
    <NavLeft></NavLeft>
    <NavRight></NavRight>
    <BitmapTo3D></BitmapTo3D>
    <!--
    <LSystemToBitmap></LSystemToBitmap>
  -->
  </div>
</template>




<script>
import NavLeft from '/imports/ui/NavLeft.vue'
import NavRight from '/imports/ui/NavRight.vue'
import TraductionMap from '/imports/ui/TraductionMap.vue'
import LSystemToBitmap from '/imports/ui/LSystemToBitmap/LSystemToBitmap.vue'
import BitmapTo3D from '/imports/ui/BitmapTo3D/BitmapTo3D.vue'

export default {

  components: {
    TraductionMap : TraductionMap,
    NavLeft : NavLeft,
    NavRight : NavRight,
    LSystemToBitmap : LSystemToBitmap,
    BitmapTo3D : BitmapTo3D,
  },
}


</script>



<style scoped>

</style>