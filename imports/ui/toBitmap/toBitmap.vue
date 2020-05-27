<template>
  <div id="toBitmap" ref="toBitmap">

     <div ref="three" id="three"></div>
     <canvas id="image" ref="image" width="150" height="150"></canvas>
    <button class="navRight" type="button" @click="toBitmap" >3D vers Bitmap</button>

  </div>
</template>


<script>

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
  },


  // Vue Methods
  methods: {  

    toBitmap:function(){
      this.$emit('toBitmap')
    },


    handleResize:function(){
      console.log("resize from toBitmap")
      this.height = window.innerHeight;
      this.width = window.innerWidth;

      this.renderer.setSize(this.width/2, this.height);
      this.camera.aspect = (this.width/2)/this.height;
      this.camera.updateProjectionMatrix();
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

      //parcours des pixels du canvas three
      var pixels = new Uint8Array(4);

      for (let y=0; y<this.imgDim; y++)
        for(let x=0; x<this.imgDim; x++ ) {
          ctxThree.readPixels(x*threeCanvas.width/this.imgDim, y*threeCanvas.height/this.imgDim, 1, 1, ctxThree.RGBA, ctxThree.UNSIGNED_BYTE, pixels)
          
          ctxImage.fillStyle = 'rgb('+pixels[0]+', '+pixels[1]+', '+pixels[2]+')';
          ctxImage.fillRect(x*pxDim, canvasImage.height-y*pxDim, pxDim, pxDim);
        }

      

      this.id = window.requestAnimationFrame(this.animate);
    },


  },


  mounted:function() {

    console.log("mounting toBitmap")
    //les dimensions de la fenêtre
    this.width = window.innerWidth;
    this.height = window.innerHeight;



    //création de la scène
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor( 0xc8c8c8);

    this.$refs.three.appendChild( this.renderer.domElement );
    this.renderer.domElement.id ="threeCanvas";

    this.renderer.setSize(this.width/2, this.height);

    //camera
    this.camera =  new THREE.PerspectiveCamera( 80, 1, 1, 1000 );
    this.controls = new OrbitControls(this.camera,this.$refs.three);
    this.controls.enableZoom = false; //empêche le scroll
    this.camera.position.z = this.imgDim*1.2;
    this.camera.aspect = (this.width/2)/this.height;
    this.camera.updateProjectionMatrix();

    
    //creation des géométries
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
   
    
    //lance l'animation
    this.id = window.requestAnimationFrame( this.animate);

    window.addEventListener('resize', this.handleResize);
  },


  destroyed() {
    window.cancelAnimationFrame(this.id);
    this.id = undefined;
  },

  computed:{
  },

  components: {
  },

}
</script>




<style scoped>

  #BitmapTo3D {
    width: 100vw;
  }

  #sketch {
    position:fixed;
    top:20px;
    width:100%;
  }

  #three {
    margin-left:auto;
    margin-right: auto;
    width:50%;

    
  }
  #canvas {
    background-color: grey;
  }

</style>