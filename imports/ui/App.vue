<template>
  <div>
    

  <div v-if="!isLogged()">
    LOGIN 
    <Login></Login>
  </div>


  <div v-else-if="globalState == 'start'">
    START
    <Login></Login>

    <button type="button"  @click="toLSystemToBitmap" >LSystemToBitmap</button>
    <button type="button"  @click="toBitmapTo3D" >BitmapTo3D</button>
  </div>


  <div v-else-if="globalState == 'lSystemToBitmap'">
    
    <Login></Login>

    <LSystemToBitmap></LSystemToBitmap>

    <NavLeft></NavLeft>
    <NavRight></NavRight>
  </div>


  <div v-else-if="globalState == 'BitmapTo3D'">
    
    <Login></Login>

    <BitmapTo3D></BitmapTo3D> 

    <NavLeft></NavLeft>
    <NavRight></NavRight>
  </div>

    
    
  
    
    <!--
      <BitmapTo3D></BitmapTo3D> 
    -->
   
  
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
import Login from '/imports/ui/Login.vue'





export default {

  data() {
    return {
      globalState:"start",
      //etats : start, lSystemToBitmap, BitmapTo3D
    }
  },

  methods: {
    isLogged(){
      return !!this.currentUser
    },

    //gestion des changements d'états
    toBitmapTo3D(){
      this.globalState = "BitmapTo3D"
    },

    toLSystemToBitmap(){
      this.globalState = "lSystemToBitmap"
    },

  },

  meteor:{
    //pas besoin de suscribe pour user et userid
    currentUser() {
      return Meteor.user();
    }
  },


  components: {
    TraductionMap : TraductionMap,
    NavLeft : NavLeft,
    NavRight : NavRight,
    LSystemToBitmap : LSystemToBitmap,
    BitmapTo3D : BitmapTo3D,
    Login : Login,
  },
}


</script>



<style scoped>

</style>