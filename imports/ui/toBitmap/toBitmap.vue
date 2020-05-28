<template>
  <div id="toBitmap" ref="toBitmap">

     <div ref="three" id="three" :style="threeStyle"></div>
     <canvas id="image" ref="image" width="canvasDimensions" height="canvasDimensions" :style="canvasStyle"></canvas>
    <button class="navRight" type="button" @click="toBitmap" >3D vers Bitmap</button>

  </div>
</template>


<script>

  import GLOBAL from '/imports/ui/GLOBAL.js';
  import THREE from 'three';
  import OrbitControls from 'orbit-controls-es6';
  import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export default {

  data() {
    return {

      width:1600,
      height:800,

      scene:Object,
      camera: Object,
      renderer: Object,
      controls: Object,
      cubesArray:[], //les cubes dans un tableau à une seule dimension
      lines:[],

      cubeGeometry: Object,
      cubeMaterial: Object,
      geometry: Object, //tous les cubes mergés
      mesh: Object,

      id:undefined, //requestanimationframe

      imgDim: 16,
    }
  },

  props: {
    cubes:Array,
    baseDimension:Number,
  },


  // Vue Methods
  methods: {  

    toBitmap:function(){
      this.$emit('toBitmap')
    },


    handleResize:function(){
      console.log("resize from toBitmap")
      this.renderer.setSize(this.threeDimensions, this.threeDimensions);

      let canvasImage = this.$refs.image;
      canvasImage.width = this.canvasDimensions;
      canvasImage.height = this.canvasDimensions;

    },


    animate:function(){
      this.controls.update();
      this.renderer.render( this.scene, this.camera );



      //update image

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
            //console.log(pixels[3]);
            ctxImage.fillStyle = 'rgb('+pixels[0]+', '+pixels[1]+', '+pixels[2]+')';
            ctxImage.fillRect(x*pxDim, (canvasImage.height -pxDim)-y*pxDim, pxDim, pxDim);
          }
        }

      

      this.id = window.requestAnimationFrame(this.animate);
    },


  },


  mounted:function() {

    console.log("mounting toBitmap")
    console.log(GLOBAL.MARGIN);
    let canvasImage = this.$refs.image;
    canvasImage.width = this.canvasDimensions;
    canvasImage.height = this.canvasDimensions;


    this.scene = new THREE.Scene();

    this.camera =  new THREE.PerspectiveCamera( 80, 1, 1, 1000 );
    this.controls = new OrbitControls(this.camera,this.$refs.three);
    //empêche le scroll
    //this.controls.enableZoom = false;

    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    //this.renderer.setSize( this.$el.clientWidth, this.$el.clientHeight );
    this.renderer.setClearColor( 0xffffff, 0.5 ); 
    this.$refs.three.appendChild( this.renderer.domElement );

    //les dimensions sont bonnes car ce code est appelé après avoir chargé le fichier, il y a donc un délai qui assure que le css a été chargé. par contre c'est pas clair le setsize, à revoir
    this.renderer.setSize(this.threeDimensions, this.threeDimensions);


    window.addEventListener('resize', this.handleResize);



    //*******************************************************************
    //creation des géométries
    //*******************************************************************

    this.cubeGeometry = new THREE.BoxBufferGeometry();
    this.cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff } );
    this.geometry = null;

    //on merge les géométries
    this.geometry = BufferGeometryUtils.mergeBufferGeometries( this.cubes, true );
    this.geometry.translate(-this.imgDim/2,-this.imgDim/2,-this.imgDim/2);
    this.mesh = new THREE.Mesh( this.geometry, this.cubeMaterial );
    this.scene.add(this.mesh);

    //lumières
    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( -10, 3, 30, 100 );
    this.scene.add(spotLight);
   
    this.camera.position.z = this.imgDim*1.2;
    //this.camera.position.y = this.imgDim*0.6;
   

    //lance l'animation // est-ce qu'il y a vraiment besoin d'animer d'ailleurs??
    this.id = window.requestAnimationFrame( this.animate);
  },




  destroyed() {
    console.log("toBitmap destroyed");
    window.removeEventListener('resize', this.handleResize);
    window.cancelAnimationFrame(this.id);
    this.id = undefined;
  },

  computed:{
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
      return this.baseDimension*2 - GLOBAL.MARGIN*2;
    },

    threeDimensions:function(){
      return this.baseDimension*1.5 - GLOBAL.MARGIN*2;
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
  }

</style>