<template>
  <div id="Module5" ref="Module5">

    <div v-if="isMenu" id="menu" :style="menuStyle">
      <h1>image 🡒 texte</h1>
      <div class="navLeftContainer">
        <button class="navLeft" type="button"  @click="toStart" >Retour au menu</button>
      </div>
      <div class="navRightContainer">
        <button class="navRight" type="button"  @click="toModule3" >texte 🡒 image</button>
      </div>
    </div>

    <div id="text" ref="text" :style="textStyle">
      {{txt}}
    </div>

    <button class="decaler" type="button" @click="plusUn" :style="plusStyle">Décaler</button>

    <P5Sketch id ="sketch" ref ="sketch" :imgDim="imgDim" :width="sketchWidth" :height="sketchHeight" :pixels="pixels" :style="sketchStyle" ></P5Sketch>

    <button class="decaler" type="button" @click="moinsUn" :style="moinsStyle">Décaler</button>

  </div>
</template>


<script>

  /*watch Images
  updates txt?
  */

  import GLOBAL from '/imports/ui/GLOBAL.js';
  import THREE from 'three';
  import OrbitControls from 'orbit-controls-es6';
  import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

  import P5Sketch from '/imports/ui/Module5/P5Sketch.vue'

  import '/imports/api/Images/Images.js'


export default {

  data() {
    return {
      isMenu:false,
      imgDim: 16,
      pixels:Array,

      txt:String,
    }
  },

  props: {
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

    toModule3:function(){
      this.saveTextToDB()
      this.$emit('toModule3')
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
      this.pixelsToText();
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
      this.pixelsToText();
    },


    pixelsToText(){
      let txt = ""
      let previous = false;
      for (let y = 0; y<this.imgDim;y++)
        for (let x = 0; x<this.imgDim;x++) {
          let p = this.pixels[y][x];

          //pixel coloré
          if (p){
            //ouverture de balise
            if (!previous)
              txt += "<";

            //remplissage
            //txt += p.h +"N"+ p.s +"N"+ p.l;
            txt += p.h;

            previous = true;
            
          }
          //pixel vide
          else {
            if (previous)
              txt += ">";
            else
                txt += ".";
            previous = false;
          }
        }

        this.txt = txt;
    },

    saveTextToDB(){
      Meteor.call('insertText', this.txt)
    }

  },


  mounted:function() {
    console.log("mounting module5")
    this.txt = "";

    //le tableau de pixels
    this.pixels = new Array(this.imgDim);
    for (let i = 0; i<this.imgDim;i++)
      this.pixels[i] = new Array(this.imgDim);
    console.log(this.pixels)

    //subscribe
    Meteor.subscribe('Images', Meteor.userId(), ()=>{
      let px = Images.findOne({}, {sort:{created_at:-1, limit:1}}).img.pixels
      if (px){
        this.pixels = px;
        this.pixelsToText();   
      }
    })

     //observe changes
    var now = new Date();
    Images.find({created_at : {$gt:now}}).observe({
      added:(img)=>{
        console.log("image added", img.img);
        this.pixels = img.img.pixels;  
        this.pixelsToText();   
      },
    })


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
        'top':this.baseDimension*1.75+'px',
        'left':this.baseDimension/2+'px',
        '-ms-transform': 'translate(-50%,-50%)',
        'transform': 'translate(-50%,-50%)',
      }
    },
    moinsStyle:function(){
      return{
        'top':this.baseDimension*1.75+'px',
        'left':this.baseDimension*2+'px',
        '-ms-transform': 'translate(50%, -50%)',
        'transform': 'translate(-50%,-50%)',
      }
    },

    sketchWidth:function(){
      return this.baseDimension*1.5- GLOBAL.MARGIN*2;
    },

    sketchHeight:function(){
      return this.baseDimension*1.5- GLOBAL.MARGIN*2;
    },
    sketchStyle:function(){
      return{
        'position':'absolute',
        'left':GLOBAL.MARGIN + this.baseDimension*0.5 +'px',
        'top':GLOBAL.MARGIN + 'px',
        'width': this.sketchWidth +'px',
        'height': this.sketchHeight +'px',
      }
    },

    textWidth:function(){
      return this.baseDimension - GLOBAL.MARGIN*2;
    },

    textHeight:function(){
      return this.baseDimension*2 - GLOBAL.MARGIN*2;
    },

    textStyle:function(){
      return{
        'position':'absolute',
        'right': this.baseDimension*0.5 + GLOBAL.MARGIN +'px',
        'top':GLOBAL.MARGIN + 'px',
        'width': this.textWidth +'px',
        'height': this.textHeight +'px',
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

  #text{
    font-size:16px;
     word-wrap: break-word;
  }

</style>

