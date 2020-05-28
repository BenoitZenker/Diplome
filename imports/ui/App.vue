<template>
  <div id="App" ref="App" :style="AppStyle">

    

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
    <LSystemToBitmap :baseDimension="baseDimension" @toStart="toStart" @toBitmapTo3D="toBitmapTo3D" ref="lSystemToBitmap"></LSystemToBitmap>
  </div>


  <div v-else-if="globalState == 'BitmapTo3D'">
    <button class="navLeft" type="button"  @click="toLSystemToBitmap" >LSystemToBitmap</button>
    <BitmapTo3D ref="bitmapTo3D" :baseDimension="baseDimension" :bitmapID="bitmapID" @toBitmap="toBitmap" ></BitmapTo3D> 

  </div>

  <div v-else-if="globalState == 'toBitmap'">
    <button class="navLeft" type="button"  @click="toBitmapTo3D" >BitmapTo3D</button>
    <toBitmap ref="toBitmap" :cubes="this.cubes" :baseDimension="baseDimension"></toBitmap> 
    <button class="navRIght" type="button"  @click="toStart" >Menu</button>
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
import toBitmap from '/imports/ui/toBitmap/toBitmap.vue'





export default {

  data() {
    return {
      name:"mon nom",
      width:Number,
      height:Number,
      baseDimension:Number,
      appWidth:Number,
      appHeight:Number,

      globalState:"start",
      //etats : start, lSystemToBitmap, BitmapTo3D

      bitmapID:"jvE65ssMb67cnwyij",

      cubes:[],

    }
  },
  computed: {
    //le style css
    AppStyle:function() {
      return {
        'width': this.appWidth + 'px',
        'height':this.appHeight+'px',
      }
    },
  },

  methods: {

    handleResize(){
      console.log("handleResize from App")
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      

      if (this.height < this.width/2) {
        this.baseDimension = this.height/2;
      }
      else {
        this.baseDimension = this.width/4;
      }

      this.appWidth = this.baseDimension*4;
      this.appHeight = this.baseDimension*2;

 

    },


    isLogged(){
      return !!this.currentUser
    },

    //destruction des composants
    destroyAllChildren(){
      console.log("App destroying all children");

      for (key in this.$refs) 
        if (key !== "App")
          if (this.$refs[key] !== undefined) {
            console.log("destroying", key, this.$refs[key]);
            this.$refs[key].$destroy();
          }
    },

    //gestion des changements d'états
    toBitmapTo3D(id){
      if (id)
        this.bitmapID = id;

      this.destroyAllChildren();
      this.globalState = "BitmapTo3D"
    },

    toLSystemToBitmap(){
      this.destroyAllChildren();
      this.globalState = "lSystemToBitmap"
    },

    toBitmap(cubes){
      this.destroyAllChildren();
      this.globalState = "toBitmap";
      this.cubes = cubes;
    },

    toStart(){
      this.destroyAllChildren();
      this.globalState = "start"
    }

  },

  meteor:{
    //pas besoin de suscribe pour user et userid
    currentUser() {
      return Meteor.user();
    }
  },

  mounted:function(){
    this.handleResize();  //init les dimensions
    window.addEventListener('resize', this.handleResize);
  },


  components: {
    TraductionMap : TraductionMap,
    NavLeft : NavLeft,
    NavRight : NavRight,
    LSystemToBitmap : LSystemToBitmap,
    BitmapTo3D : BitmapTo3D,
    Login : Login,
    toBitmap : toBitmap,
  },
}


</script>



<style scoped>

#App {
  background-color: rgba(220, 220, 220, 1);
  background-image: linear-gradient(rgba(0, 0, 0, .1) 2px, transparent 2px), linear-gradient(90deg,rgba(0, 0, 0, .1) .2px, transparent 2px);
  background-size: 12.5% 25%;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}




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