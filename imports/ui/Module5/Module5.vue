<template>
  <div id="Module5" ref="Module5">

    <div v-if="isMenu" id="menu" :style="menuStyle">
      <div class="navLeftContainer">
        <button class="navLeft" type="button"  @click="toStart" >Retour au menu</button>
      </div>
      <div class="navRightContainer">
        <button class="navRight" type="button"  @click="toModule1" >Image -> 3D</button>
      </div>
    </div>


    <button class="decaler" type="button" @click="plusUn" :style="plusStyle">Décaler</button>

    <P5Sketch id ="sketch" ref ="sketch" :imgDim="imgDim" :width="sketchWidth" :height="sketchHeight" :pixels="pixels" :style="sketchStyle" ></P5Sketch>

    <button class="decaler" type="button" @click="moinsUn" :style="moinsStyle">Décaler</button>

  </div>
</template>


<script>

  import GLOBAL from '/imports/ui/GLOBAL.js';
  import THREE from 'three';
  import OrbitControls from 'orbit-controls-es6';
  import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

  import P5Sketch from '/imports/ui/Module5/P5Sketch.vue'


export default {

  data() {
    return {
      isMenu:false,
      imgDim: 16,
    }
  },

  props: {
    pixels:Array,
    baseDimension:Number,
  },


  // Vue Methods
  methods: {  

    //*******************************************************************
    //Changement de composant
    //******************************************************************
    toStart:function(){
      this.$emit('toStart')
    },

    toModule1:function(){
      this.$emit('toModule1', this.pixels)
    },

    plusUn(){
      let copie = new Array(this.imgDim);
      for (let y=0; y<this.imgDim; y++) {
        copie[y] = new Array(this.imgDim);

        //remplissage
        for (let x=0; x<this.imgDim;x++) {
          //boucle en x
          if (x==this.imgDim-1) {
            //boucle en y
            if (y == this.imgDim-1)
              copie[y][x] = this.pixels[0][0]
            else
              copie[y][x] = this.pixels[y+1][0]
          }
          else
            copie[y][x] = this.pixels[y][x+1]
        }
      }

      this.pixels = copie;
    },

    moinsUn(){
      let copie = new Array(this.imgDim);
      for (let y=0; y<this.imgDim; y++) {
        copie[y] = new Array(this.imgDim);

        //remplissage
        for (let x=0; x<this.imgDim;x++) {
          //boucle en x
          if (x==0) {
            //boucle en y
            if (y == 0)
              copie[y][x] = this.pixels[this.imgDim-1][this.imgDim-1]
            else
              copie[y][x] = this.pixels[y-1][this.imgDim-1]
          }
          else
            copie[y][x] = this.pixels[y][x-1]
        }
      }

      this.pixels = copie;
    },

  },


  mounted:function() {
    console.log("mounting module5")

    //key event pour le menu
    this.isMenu = false;
    document.addEventListener('keyup', (evt)=> {
      console.log(evt.keyCode);
      if(evt.keyCode == 27)
        this.isMenu = !this.isMenu;
    });
  },


  destroyed() {
    console.log("module5 destroyed");
  },



  computed:{

    menuStyle:function(){
      return {
        'right': '0px',
        'top':'0px',
        'height': this.baseDimension*2+'px',
        'width': this.baseDimension*4+'px',
      }
    },

    plusStyle:function(){
      return{
        'top':this.baseDimension+'px',
        'left':this.baseDimension/2+'px',
        '-ms-transform': 'translate(-50%,-50%)',
        'transform': 'translate(-50%,-50%)',
      }
    },
    moinsStyle:function(){
      return{
        'top':this.baseDimension+'px',
        'right':this.baseDimension/2+'px',
        '-ms-transform': 'translate(50%, -50%)',
        'transform': 'translate(50%,-50%)',
      }
    },

    sketchWidth:function(){
      return this.baseDimension*2- GLOBAL.MARGIN*2;
    },

    sketchHeight:function(){
      return this.baseDimension*2- GLOBAL.MARGIN*2;
    },
    sketchStyle:function(){
      return{
        'position':'absolute',
        'left':GLOBAL.MARGIN + this.baseDimension +'px',
        'top':GLOBAL.MARGIN + 'px',
        'width': this.sketchWidth +'px',
        'height': this.sketchHeight +'px',
      }
    },
  },


  components: {
    P5Sketch: P5Sketch,
  },
}

</script>


<style scoped>

  .decaler{
    position:absolute;
  }

</style>

