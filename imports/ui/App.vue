<template>
  <div>
    

  <div v-if="!isLogged()">
    <Login></Login>
  </div>


  <div v-else-if="globalState == 'start'">
    <Login></Login>

    <button class="menuButton" type="button"  @click="toLSystemToBitmap" >LSystemToBitmap</button>
    <!--
    <button type="button"  @click="toBitmapTo3D('')" >BitmapTo3D</button>
    -->
  </div>



  <div v-else-if="globalState == 'lSystemToBitmap'">
    <LSystemToBitmap @toStart="toStart" @toBitmapTo3D="toBitmapTo3D"></LSystemToBitmap>
  </div>


  <div v-else-if="globalState == 'BitmapTo3D'">
    <button class="navLeft" type="button"  @click="toLSystemToBitmap" >LSystemToBitmap</button>
    <BitmapTo3D :bitmapID="bitmapID"></BitmapTo3D> 
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

      bitmapID:"jvE65ssMb67cnwyij",
    }
  },

  methods: {
    isLogged(){
      return !!this.currentUser
    },

    //gestion des changements d'états
    toBitmapTo3D(id){
      if (id)
        this.bitmapID = id;
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

.menuButton {

  margin-top: 40px;

  text-align: center;
  position: absolute;
  left:50%;
  -ms-transform: translate(-50%, 0);
  transform: translate(-50%, 0);

  background-color: #c5e6f0;
}
.menuButton:hover {
  background-color: white;
}

</style>