<template>
  <div id="App" ref="App" :style="AppStyle">

  <div v-if="isAdmin()">
    <button class="adminButton" type="button"  @click="toAdmin" >admin</button>
  </div>

  <div v-if="!isLogged()">
    <Login :baseDimension="baseDimension" >Login</Login>
  </div>



  <div id="boutons" v-else-if="globalState == 'start'">
    <Login :baseDimension="baseDimension">Login</Login>
    <button class="menuButton" type="button"  @click="toModule1">image 🡒 3D</button>
    <button class="menuButton" type="button"  @click="toModule2">3D 🡒 image (aplatir)</button>
    <button class="menuButton" type="button"  @click="toModule3">texte 🡒 image</button>
    <button class="menuButton" type="button"  @click="toModule4">3D 🡒 image (exploser)</button>
    <button class="menuButton" type="button"  @click="toModule5">image 🡒 texte</button>
  </div>


    <div v-if="globalState == 'module1'">
      <Module1 :baseDimension="baseDimension" @toStart="toStart" @toModule2="toModule2" @toModule4="toModule4"></Module1>
    </div>

    <div v-else-if="globalState == 'module2'">
      <Module2 :baseDimension="baseDimension" @toStart="toStart" @toModule1="toModule1" @toModule5="toModule5"></Module2>
    </div>

  <div v-else-if="globalState == 'module3'">
    <Module3 :baseDimension="baseDimension" @toStart="toStart" @toModule1="toModule1"  @toModule5="toModule5"></Module3>
  </div>

  <div v-else-if="globalState == 'module4'">
    <Module4 :baseDimension="baseDimension" @toStart="toStart" @toModule1="toModule1" @toModule2="toModule2" @toModule5="toModule5"></Module4>
  </div>

  <div v-else-if="globalState == 'module5'">
    <Module5 :baseDimension="baseDimension" @toStart="toStart" @toModule3="toModule3" ></Module5>
  </div>


  <div v-else-if="globalState == 'admin'">
     <Admin></Admin>
    <button class="navRight" type="button"  @click="toStart" >Menu</button>
  </div>  


  </div>
</template>




<script>

import Module1 from '/imports/ui/Module1/Module1.vue'
import Module2 from '/imports/ui/Module2/Module2.vue'
import Module3 from '/imports/ui/Module3/Module3.vue'
import Module4 from '/imports/ui/Module4/Module4.vue'
import Module5 from '/imports/ui/Module5/Module5.vue'


import Login from '/imports/ui/Users/Login.vue'
import Admin from '/imports/ui/Admin/Admin.vue'


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

    isAdmin(){
      return this.currentUser && this.currentUser.profile && this.currentUser.profile.role === "admin"
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

    toAdmin(){
      this.globalState = "admin"
    },


    toStart(){
      this.destroyAllChildren();
      this.pixels =null;
      this.scene = null;
      this.globalState = "start"
    },

    toModule1(pixels){
      this.destroyAllChildren();
      this.globalState = "module1";
    },

    toModule2(scene){
      this.destroyAllChildren();
      this.globalState = "module2";
    },

    toModule3(){
      this.destroyAllChildren();
      this.globalState = "module3";
    },

    toModule4(scene){
      this.destroyAllChildren();
      this.globalState = "module4";
    },

    toModule5(pixels){
      this.destroyAllChildren();
      this.globalState = "module5";
    },

  },

  meteor:{
    //pas besoin de suscribe pour user et userid
    currentUser() {
      return Meteor.user();
    }
  },

  mounted:function(){
    this.handleResize();  //init les dimensions
    this.pixels =null;
    this.scene = null;
    window.addEventListener('resize', this.handleResize);
  },


  components: {

    Login : Login,
    Admin : Admin,

    Module1:Module1,
    Module2:Module2,
    Module3:Module3,
    Module4:Module4,
    Module5:Module5,
  },
}


</script>



<style scoped>

#App {
  /*background-color: rgba(220, 220, 220, 1);*/
  background-color:white;
  background-image: linear-gradient(rgba(0, 0, 0, .1) 2px, transparent 2px), linear-gradient(90deg,rgba(0, 0, 0, .1) .2px, transparent 2px);
  background-size: 12.5% 25%;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}



#boutons{
  margin-top:200px;
}

.menuButton {
  margin-top: 10px;

  text-align: center;
  display: block;
  margin-left:auto;
  margin-right:auto;

}

.menuButton:hover {
  background-color: white;
}


</style>