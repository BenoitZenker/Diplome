<template>
  <div id="Module2" ref="Module2">


    <div v-if="isMenu" id="menu" :style="menuStyle">
      <h1>3D 🡒 image (aplatir)</h1>
      <div class="navLeftContainer">
        <button class="navLeft" type="button"  @click="toStart" >Retour au menu</button>
      </div>
      <div class="navRightContainer">
        <button class="navRight" type="button"  @click="toModule1" >image 🡒 3D</button>
        <button class="navRight" type="button"  @click="toModule5" >image 🡒 texte</button>
      </div>
    </div>

     <div ref="three" id="three" :style="threeStyle"></div>
     <canvas  id="image" ref="image" width="canvasDimensions" height="canvasDimensions" :style="canvasStyle"></canvas>


  </div>
</template>


<script>

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

  class Color{
    constructor(r,g,b,a) {
      this.r = r;
      this.g = g;
      this.b = b;
      this.a = a;
    }
  }
  class HSLColor {
    constructor(h,s,l) {
      this.h = h;
      this.s = s;
      this.l = l;
    }
  }

  import '/imports/api/Scenes/Scenes.js' 


  import GLOBAL from '/imports/ui/GLOBAL.js';
  import THREE from 'three';
  import Exporter from 'three/examples/jsm/exporters/GLTFExporter.js'
  import Loader from 'three/examples/jsm/loaders/GLTFLoader.js'
  import OrbitControls from 'orbit-controls-es6';


  

export default {

  data() {
    return {

      isMenu:false,

      scene:Object,
      camera: Object,
      renderer: Object,
      controls: Object,

      id:undefined, //requestanimationframe

      imgDim: 16,
      pixels:Array,

      previousCubes:Array,

    }
  },

  props: {
    baseDimension:Number,
  },


  // Vue Methods
  methods: {  

    //*******************************************************************
    //Changement de composant
    //*******************************************************************
    toModule1:function(){
      this.saveImageToDB();
      this.$emit('toModule1');
    },

    toModule5:function(){
      this.saveImageToDB();
      this.$emit('toModule5');
    },

    toStart:function(){
      this.$emit('toStart')
    },

    saveImageToDB:function(){
      Meteor.call('insertImage', {
        pixels:this.pixels,
        dim: this.imgDim,
      });
    },


    handleResize:function(){

      this.renderer.setSize(this.threeDimensions, this.threeDimensions);

      let canvasImage = this.$refs.image;
      canvasImage.width = this.canvasDimensions;
      canvasImage.height = this.canvasDimensions;
    },


    animate:function(){
      

      //update image
      this.controls.update();
      this.renderer.render( this.scene, this.camera );

       //le canvas de l'image
      let canvasImage = this.$refs.image;
      var ctxImage = canvasImage.getContext('2d');
      let pxDim = canvasImage.width/this.imgDim;
      
      //le canvas de three
      let threeCanvas = this.$refs.three.firstChild;
      let ctxThree = threeCanvas.getContext("webgl", {preserveDrawingBuffer: true});

      //clear canvas
      ctxImage.clearRect(0, 0, canvasImage.width, canvasImage.height);
      ctxImage. fillStyle = '#ffffff7f';
      ctxImage.fillRect(0, 0, canvasImage.width, canvasImage.height);

      //parcours des pixels du canvas three
      var pixels = new Uint8Array(4);

      for (let y=0; y<this.imgDim; y++)
        for(let x=0; x<this.imgDim; x++ ) {
          ctxThree.readPixels(x*threeCanvas.width/this.imgDim, y*threeCanvas.height/this.imgDim, 1, 1, ctxThree.RGBA, ctxThree.UNSIGNED_BYTE, pixels)

          if (pixels[3] == 255) {
            ctxImage.fillStyle = 'rgb('+pixels[0]+', '+pixels[1]+', '+pixels[2]+')';
            ctxImage.fillRect(x*pxDim, (canvasImage.height -pxDim)-y*pxDim, pxDim, pxDim);

            //sauvegarde du pixel dans le tableau
            //this.pixels[this.imgDim-(y+1)][x] = new Color(pixels[0], pixels[1], pixels[2], 1)
            let hsl = rgbToHsl(pixels[0], pixels[1], pixels[2]);
            this.pixels[this.imgDim-(y+1)][x] = new HSLColor(Math.floor(hsl[0]), Math.floor(hsl[1]), Math.floor(hsl[2]));
          
          }
          else {
            this.pixels[this.imgDim-(y+1)][x] = null;
          }
        }    



      this.id = window.requestAnimationFrame(this.animate);
    },


    loadScene:function(jsonData){
      console.log("loading json", JSON.parse(jsonData));

      //clear previous cubes
      for (let i=0; i<this.previousCubes.length; i++) {
        console.log("id",this.previousCubes)
        this.scene.remove(this.scene.getObjectByName(this.previousCubes[i].id));
      }


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
    },


  },

  

  mounted:function() {
    console.log("mounting module2")

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

    //le canvas de pixels
    let canvasImage = this.$refs.image;
    canvasImage.width = this.canvasDimensions;
    canvasImage.height = this.canvasDimensions;



    //setup 3D three
    this.previousCubes = new Array();
    this.scene = new THREE.Scene();
    this.cubeGeometry = new THREE.BoxBufferGeometry();

    this.camera =  new THREE.PerspectiveCamera( 80, 1, 1, 1000 );
    this.camera.aspect=1;
    this.controls = new OrbitControls(this.camera,this.$refs.three);

    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setClearColor( 0xffffff, 0.5 ); 
    this.$refs.three.appendChild( this.renderer.domElement );

    this.renderer.setSize(this.threeDimensions, this.threeDimensions);
    window.addEventListener('resize', this.handleResize);

    //lumières
    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( -10, 3, 30, 100 );
    this.scene.add(spotLight);

    var ambiantLight = new THREE.AmbientLight( 0x404040 );
    this.scene.add(ambiantLight);
     
    this.camera.position.z = this.imgDim*1.2;
     
    //lance l'animation // est-ce qu'il y a vraiment besoin d'animer d'ailleurs??
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
    console.log("toBitmap destroyed");
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

    threeStyle:function(){
      return{
        margin:GLOBAL.MARGIN+'px',
      }
    },

    canvasStyle:function(){
      return{
        margin:GLOBAL.MARGIN+'px',

      }
    },

    canvasDimensions:function(){
      //return this.baseDimension*2 - GLOBAL.MARGIN*2;
      return this.baseDimension*2- GLOBAL.MARGIN*2;
    },

    threeDimensions:function(){
      return this.baseDimension*2 - GLOBAL.MARGIN*2;
    },
  },


}
</script>




<style scoped>

  #three {
    position: absolute;
    top:0;
  }

  #image {
    position:absolute;
    top:0;
    right:0;
    background-color: rgba(240, 240, 240, 1);
  }

</style>