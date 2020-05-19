<template>
  <div>
    

  <div v-if="!isLogged()">
    <Login></Login>
  </div>


  <div v-else-if="globalState == 'start'">
    <Login></Login>

    <button type="button"  @click="toLSystemToBitmap" >LSystemToBitmap</button>
    <button type="button"  @click="toBitmapTo3D" >BitmapTo3D</button>
  </div>


  <div v-else-if="globalState == 'lSystemToBitmap'">
    <button class="navLeft" type="button"  @click="toStart" >Retour au menu</button>
    <LSystemToBitmap></LSystemToBitmap>
    <button class="navRight" type="button"  @click="toBitmapTo3D" >BitmapTo3D</button>
  </div>


  <div v-else-if="globalState == 'BitmapTo3D'">
    <button class="navLeft" type="button"  @click="toLSystemToBitmap" >LSystemToBitmap</button>
    <BitmapTo3D></BitmapTo3D> 
    <button class="navRight" type="button" @click="toStart" >Retour au menu</button>
  </div>

    
    
  

      
    
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
    toStart(){
      this.globalState = "start"
    }

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
  .navLeft {
    position:absolute;
    top:50%;
    left:0;
  }

  .navRight{
    position:absolute;
    top:50%;
    right:0;
  }

</style>