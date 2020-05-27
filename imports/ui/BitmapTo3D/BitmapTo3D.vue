<template>
  <div id="BitmapTo3D" ref="BitmapTo3D">
 
    <P5Sketch id ="sketch" ref ="p5" :pixelsOG="pixels" :imgDim="imgDim" v-on:update-p5-image="updateP5Image"></P5Sketch>
     <div :style="threeStyle" ref="three" id="three"></div>
    <button type ="button" ref="clear" @click="clearAllPixels">effacer</button>

    <button class="navRight" type="button" @click="toBitmap" >3D vers Bitmap</button>

  </div>
</template>


<script>

  import THREE from 'three';
  import OrbitControls from 'orbit-controls-es6';
  import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

  import P5Sketch from '/imports/ui/BitmapTo3D/BitmapTo3DSketch.vue'

  import '/imports/api/JSON/JSON.js';



export default {

  data() {
    return {

      scene:Object,
      camera: Object,
      renderer: Object,
      controls: Object,
      cubes:[], //les cubes dans un tableau à 3 dimensions
      cubesArray:[], //les cubes dans un tableau à une seule dimension
      lines:[],

      cubeGeometry: Object,
      cubeMaterial: Object,
      geometry: Object, //tous les cubes mergés
      mesh: Object,

      id:undefined, //requestanimationframe

      imgDim: 16,
      pixels:[],
      pixelsP5:[],
    }
  },

  props: {
    bitmapID: String,
    baseDimension:Number,
  },


  // Vue Methods
  methods: {  

    toBitmap:function(){
      this.$emit('toBitmap', this.cubesArray);
    },

    //rajout d'un pixel aux coordonnées x, y
    updateP5Image:function(x,y){

      //update the image
      this.pixelsP5[y][x] = true;

      //update de la 3D
      for (let z=0; z<this.imgDim; z++) {

        if (this.pixels[y][z]) {
          //on crée un cube
          let cube = this.cubeGeometry.clone();
          cube.translate(x, y, z);
          this.cubesArray.push(cube);
        }
      }

      //on supprime la géo précédente
      this.scene.remove(this.mesh);
      if (this.geometry)
        this.geometry.dispose();
      this.renderer.renderLists.dispose();
      console.log("dispose")

      //on merge les géométries
      this.geometry = BufferGeometryUtils.mergeBufferGeometries( this.cubesArray, true );
      this.geometry.translate(-this.imgDim/2,-this.imgDim/2,-this.imgDim/2);
      this.mesh = new THREE.Mesh( this.geometry, this.cubeMaterial );
      this.scene.add(this.mesh);

    },


    handleResize:function(){

      console.log("resize, ", this.baseDimension);
      this.renderer.setSize(this.baseDimension*2, this.baseDimension*2);


    },

    //TODO: NÉCESSAIRE?
    animate:function(){
      this.controls.update();

      this.renderer.render( this.scene, this.camera );
      this.id = window.requestAnimationFrame(this.animate);
    },

    clearAllPixels:function(){

      this.$refs.p5.clearAllPixels();

      for (let y=0; y< this.imgDim; y++) 
        for (let z=0; z< this.imgDim; z++) 
          for (let x=0; x< this.imgDim; x++) {
            this.cubes[y][z][x].visible = false;
            this.lines[y][z][x].visible = false;
          }
    },

    setup3D:function() {
       //*******************************************************************
    //création de la scène
    //*******************************************************************
    this.scene = new THREE.Scene();

    this.camera =  new THREE.PerspectiveCamera( 80, 1, 1, 1000 );
    this.controls = new OrbitControls(this.camera,this.$refs.three);
    //empêche le scroll
    this.controls.enableZoom = false;

    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    //this.renderer.setSize( this.$el.clientWidth, this.$el.clientHeight );
    this.renderer.setClearColor( 0xffffff, 0.5 ); 
    this.$refs.three.appendChild( this.renderer.domElement );

    //les dimensions sont bonnes car ce code est appelé après avoir chargé le fichier, il y a donc un délai qui assure que le css a été chargé. par contre c'est pas clair le setsize, à revoir
    this.renderer.setSize(this.baseDimension*2, this.baseDimension*2);
    window.addEventListener('resize', this.handleResize);
    //this.handleResize();



    //*******************************************************************
    //creation des géométries
    //*******************************************************************

    this.cubeGeometry = new THREE.BoxBufferGeometry();
    this.cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff } );
    this.geometry = null;

    //lumières
    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( -10, 3, 30, 100 );
    this.scene.add(spotLight);
   
    this.camera.position.z = this.imgDim*1.2;
    //this.camera.position.y = this.imgDim*0.6;
   

    //lance l'animation // est-ce qu'il y a vraiment besoin d'animer d'ailleurs??
    this.id = window.requestAnimationFrame( this.animate);

    }

  },


  mounted:function() {

    console.log("mounting bitmapTo3D");

    //wait for db to be loaded
    Meteor.subscribe("files.JSONCollection.all", ()=>{

      //création de l'image à partir de l'id du json fournie
      let myJSON = JSONCollection.findOne({_id:this.bitmapID});
      var req = new XMLHttpRequest();
      req.onreadystatechange = ()=> { //calllback, une fois que le fichier est chargé
          if (req.readyState == XMLHttpRequest.DONE) {
              //alert(req.responseText);
              let data = JSON.parse(req.responseText);
              console.log(data);


              //création de l'image
              for (let y=0; y<data.height; y++) {
                this.pixels[y] = [];
                this.pixelsP5[y] = [];
                for (let x=0; x<data.width; x++) {
                  this.pixelsP5[y][x] = false;
                  //on inverse le Y
                  this.pixels[y][x] = data.pixels[(data.height -(y+1))*data.width+x];

                }
              }

            //création de la scène 3D
            this.setup3D();

          }
      }

      //open file
      //ça devrait être fait sur le serveur peut-être?
      //ou bien directement stocké en json sans passer par ostrio
      req.open("get", myJSON.link(), true);
      req.send();

    });
  },

  destroyed() {
    window.cancelAnimationFrame(this.id);
    this.id = undefined;
  },


  computed:{
    threeStyle:function(){
      return{
        'margin-left': this.baseDimension+'px',
      }
    },
  },

  components: {
    P5Sketch: P5Sketch,
  },

}
</script>




<style scoped>

  #BitmapTo3D {
  }

  #sketch {
    position:fixed;
    top:20px;
    width:100%;
  }


  #canvas {
    background-color: grey;
  }

</style>