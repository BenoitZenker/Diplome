<template>
  <div id="Module4" ref="Module4">

    <div v-if="isMenu" id="menu" :style="menuStyle">
      <h1>3D 🡒 image (exploser)</h1>
      <div class="navLeftContainer">
        <button class="navLeft" type="button"  @click="toStart" >Retour au menu</button>
      </div>
      <div class="navRightContainer">
        <button class="navRight" type="button"  @click="toModule1" >image 🡒 3D</button>
        <button class="navRight" type="button"  @click="toModule5" >image 🡒 texte</button>
      </div>
    </div>

     <div ref="three" id="three" :style="threeStyle"></div>

     <P5Sketch id ="sketch" ref ="sketch" :imgDim="imgDim" :width="sketchWidth" :height="sketchHeight" :pixels="pixels" :style="sketchStyle" v-on:remove-pixel="removePixel" v-on:change-pixel="changePixel" v-on:shuffle-pixels="cubesToPixels"></P5Sketch>


  </div>
</template>


<script>

  import '/imports/api/Scenes/Scenes.js'

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
  function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
  }

export default {

  data() {
    return {

      isMenu:false,

      camera: Object,
      renderer: Object,
      controls: Object,
      scene: Object,

      id:undefined, //requestanimationframe

      imgDim: 16,
      pixels:Array,
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
    toModule1:function(){
      this.saveImageToDB();
      this.$emit('toModule1', this.pixels)
    },
    toModule5:function(){
      this.saveImageToDB();
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

    loadScene:function(jsonData){
      console.log("loading json", JSON.parse(jsonData));

      //clear previous cubes
      for (let i=0; i<this.previousCubes.length; i++) 
        this.scene.remove(this.scene.getObjectByName(this.previousCubes[i].id));
      


      //add cubes to three
      let cubes = JSON.parse(jsonData);
      for (var i = 0; i< cubes.length; i++) {
        let cube = this.cubeGeometry.clone();    
        cube.translate(cubes[i].x, cubes[i].y, cubes[i].z);
        let cubeMaterial = new THREE.MeshLambertMaterial( { color: new THREE.Color(cubes[i].color) } );
        let mesh = new THREE.Mesh( cube, cubeMaterial );
        mesh.name = cubes[i].id;
        mesh.hslColors = cubes[i].hslColors;
        this.scene.add(mesh);
      }

      //save new cubes
      this.previousCubes = Array.from(cubes);

      //add cubes to image
      //remplissage en fonction des cubes
      let x=0;
      let y=0;
      this.cubesToPixels();
    },

    cubesToPixels:function(){

      //vide les pixels existants
      this.pixels = new Array(this.imgDim);
      for (let i = 0; i<this.imgDim;i++)
        this.pixels[i] = new Array(this.imgDim);


      //stack of coordinates
      let stack = new Array();
      for (let i = 0; i<this.imgDim;i++) {
        for (let j = 0; j<this.imgDim;j++)
          stack.push({x:i, y:j});
      }

      for (var i=0; i<this.previousCubes.length; i++){
        let c = this.previousCubes[i];
        let index = Math.floor(Math.random()*stack.length-1);
        let crd = stack.splice(index,1)[0]
        this.pixels[crd.x][crd.y] = new HSLColor(c.hslColors[0], c.hslColors[1], c.hslColors[2]);
      }
    },

    saveImageToDB:function(){
      Meteor.call('insertImage', {
        pixels:this.pixels,
        dim: this.imgDim,
      });
    }
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


    //le tableau de pixels
    this.pixels = new Array(this.imgDim);
    for (let i = 0; i<this.imgDim;i++)
      this.pixels[i] = new Array(this.imgDim);

    
    //setup 3D three
    this.previousCubes = new Array();
    this.scene = new THREE.Scene();
    this.cubeGeometry = new THREE.BoxBufferGeometry();

    this.camera =  new THREE.PerspectiveCamera( 80, 1, 1, 1000 );
    this.camera.position.z = this.imgDim*1.2;
    this.controls = new OrbitControls(this.camera,this.$refs.three);

    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setClearColor( 0xffffff, 0.5 ); 
    this.$refs.three.appendChild( this.renderer.domElement );

    this.renderer.setSize(this.threeWidth, this.threeHeight);

    //lumières
    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( -10, 3, 30, 100 );
    this.scene.add(spotLight);

    var ambiantLight = new THREE.AmbientLight( 0x404040 );
    this.scene.add(ambiantLight);
     
    window.addEventListener('resize', this.handleResize);

    //lance l'animation 
    this.id = window.requestAnimationFrame( this.animate);



    //souscription à la base de données des scenes
    Meteor.subscribe('Scenes', Meteor.userId(), ()=>{
      let scene = Scenes.findOne({}, {sort:{created_at:-1, limit:1}}).scene
      if (scene)
        this.loadScene(scene);
    })

    //callback quand la scène est updatée
    var now = new Date();
    Scenes.find({created_at : {$gt:now}}).observe({
      added:(newScene)=>{
        console.log("nouvelle scène dans la bdd", this.scene)
        this.loadScene(newScene.scene);       
      },
    })

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
        'right':GLOBAL.MARGIN + 'px',
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
    left:0;
  }


</style>