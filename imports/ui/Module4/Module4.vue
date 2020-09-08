<template>
  <div id="Module4" ref="Module4">

    <div v-if="isMenu" id="menu" :style="menuStyle">
      <div class="navLeftContainer">
        <button class="navLeft" type="button"  @click="toStart" >Retour au menu</button>
      </div>
      <div class="navRightContainer">
        <button class="navRight" type="button"  @click="toModule2" >3D -> Image</button>
        <button class="navRight" type="button"  @click="toModule1" >Image -> 3D</button>
        <button class="navRight" type="button"  @click="toModule5" >décaler l'image</button>
      </div>
    </div>

     <div ref="three" id="three" :style="threeStyle"></div>

     <P5Sketch id ="sketch" ref ="sketch" :imgDim="imgDim" :width="sketchWidth" :height="sketchHeight" :pixels="pixels" :style="sketchStyle" v-on:remove-pixel="removePixel" v-on:change-pixel="changePixel"></P5Sketch>


  </div>
</template>


<script>

  import GLOBAL from '/imports/ui/GLOBAL.js';
  import THREE from 'three';
  import OrbitControls from 'orbit-controls-es6';
  import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

  import P5Sketch from '/imports/ui/Module4/P5Sketch.vue'

  class HSLColor {
    constructor(h,s,l) {
      this.h = Math.floor(h);
      this.s = Math.floor(s);
      this.l = Math.floor(l);
    }
  }
  function rgbToHsl(r1, g1, b1){
    r1 /= 255;
    g1 /= 255;
    b1 /= 255;
 
    var maxColor = Math.max(r1,g1,b1);
    var minColor = Math.min(r1,g1,b1);
    //Calculate L:
    var L = (maxColor + minColor) / 2 ;
    var S = 0;
    var H = 0;
    if(maxColor != minColor){
        //Calculate S:
        if(L < 0.5){
            S = (maxColor - minColor) / (maxColor + minColor);
        }else{
            S = (maxColor - minColor) / (2.0 - maxColor - minColor);
        }
        //Calculate H:
        if(r1 == maxColor){
            H = (g1-b1) / (maxColor - minColor);
        }else if(g1 == maxColor){
            H = 2.0 + (b1 - r1) / (maxColor - minColor);
        }else{
            H = 4.0 + (r1 - g1) / (maxColor - minColor);
        }
    }
 
    L = L * 100;
    S = S * 100;
    H = H * 60;
    if(H<0){
        H += 360;
    }
    var result = [H, S, L];
    return result;
  }

export default {

  data() {
    return {

      isMenu:false,

      camera: Object,
      renderer: Object,
      controls: Object,

      id:undefined, //requestanimationframe

      imgDim: 16,
      pixels:Array,
    }
  },

  props: {
    scene:Object,
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
    toModule2:function(){
      this.$emit('toModule2', this.scene)
    },
    toModule1:function(){
      this.$emit('toModule1', this.pixels)
    },
    toModule5:function(){
      this.$emit('toModule5', this.pixels);
    },

    //*******************************************************************
    //emits
    //******************************************************************
    removePixel:function(x,y) {

      //si le pixel est déjà éteint on quitte
      if (this.pixels[y][x]==null)
        return;

      //remove cube
      this.scene.remove(this.scene.getObjectById(this.pixels[y][x].cubeID));
      //remove pixel
      this.pixels[y][x] = null;
    },

    changePixel:function(x,y,clr) {
      //si le pixel est déjà éteint on quitte
      if (this.pixels[y][x]==null)
        return;

      //le pixel
      this.pixels[y][x].h = clr.h;
      this.pixels[y][x].s = clr.s;
      this.pixels[y][x].l = clr.l;

      //le cube
      let cubeMaterial = new THREE.MeshLambertMaterial( { color: new THREE.Color('hsl('+clr.h+','+clr.s+'%,'+clr.l+'%)') } );
      let c = this.scene.getObjectById(this.pixels[y][x].cubeID);
      c.material = cubeMaterial;
      c.hslColors = [clr.h, clr.s, clr.l];

    },


    handleResize:function(){
      this.renderer.setSize(this.threeWidth, this.threeHeight);
    },

    animate:function(){
      this.controls.update();
      this.renderer.render( this.scene, this.camera );
      this.id = window.requestAnimationFrame(this.animate);
    },
  },


  mounted:function() {
    console.log("mounting module4")

    //key event pour le menu
    this.isMenu = false;
    document.addEventListener('keyup', (evt)=> {
      console.log(evt.keyCode);
      if(evt.keyCode == 27)
        this.isMenu = !this.isMenu;
    });


    //setup de l'image

    //le tableau de pixels
    this.pixels = new Array(this.imgDim);
    for (let i = 0; i<this.imgDim;i++)
      this.pixels[i] = new Array(this.imgDim);

    //remplissage en fonction des cubes
    let x=0;
    let y=0;
    this.scene.traverse( (node)=> {
      if ( node instanceof THREE.Mesh ) {
        this.pixels[y][x] = new HSLColor(node.hslColors[0], node.hslColors[1], node.hslColors[2]);
        //pointeur vers le cube correspondant
        this.pixels[y][x].cubeID = node.id;
        x++;
        if (x> this.imgDim) {
          x=0;
          y++;
        }
    }

} );


    //setup 3D three

    this.camera =  new THREE.PerspectiveCamera( 80, 1, 1, 1000 );
    this.camera.position.z = this.imgDim*1.2;
    this.controls = new OrbitControls(this.camera,this.$refs.three);

    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setClearColor( 0xffffff, 0.5 ); 
    this.$refs.three.appendChild( this.renderer.domElement );

    this.renderer.setSize(this.threeWidth, this.threeHeight);

    window.addEventListener('resize', this.handleResize);

    //lance l'animation 
    this.id = window.requestAnimationFrame( this.animate);
  },


  destroyed() {
    console.log("module4 destroyed");
    window.removeEventListener('resize', this.handleResize);
    window.cancelAnimationFrame(this.id);
    this.id = undefined;
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

    threeWidth:function(){
      return this.baseDimension*2- GLOBAL.MARGIN*2;
    },

    threeHeight:function(){
      return this.baseDimension*2- GLOBAL.MARGIN*2;
    },

    threeStyle:function(){
      return{
        margin:GLOBAL.MARGIN+'px'
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
        'left':GLOBAL.MARGIN + 'px',
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

  #three {
    position: absolute;
    top:0;
    right:0;
  }


</style>