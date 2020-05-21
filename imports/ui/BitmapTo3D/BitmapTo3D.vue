<template>
  <div id="BitmapTo3D" ref="BitmapTo3D">
  <div ref="three" id="three"></div>
  <P5Sketch id ="sketch" ref ="p5" :pixelsOG="pixels" :imgDim="imgDim" v-on:update-p5-image="updateP5Image"></P5Sketch>
  <button type ="button" ref="clear" @click="clearAllPixels">effacer</button>
  </div>
</template>


<script>

  import THREE from 'three';
  import OrbitControls from 'orbit-controls-es6';

  import P5Sketch from '/imports/ui/BitmapTo3D/BitmapTo3DSketch.vue'

  import '/imports/api/JSON/JSON.js';



export default {

  data() {
    return {

      width:1600,
      height:800,

      scene:Object,
      camera: Object,
      renderer: Object,
      controls: Object,
      cubes:[],
      lines:[],

      id:undefined, //requestanimationframe

      imgDim: 8,
      pixels:[],
      pixelsP5:[],
    }
  },

  props: {
    bitmapID: String,
  },


  // Vue Methods
  methods: {  

    updateP5Image:function(x,y){

      //update the image
      this.pixelsP5[y][x] = true;

      //change 3D
      for (let z=0; z< this.imgDim; z++) {
        this.cubes[y][z][x].visible = this.pixels[z][x];
        this.lines[y][z][x].visible = this.pixels[z][x];
      }
    },


    handleResize:function(){
      this.height = this.$el.clientHeight;
      this.width = this.$el.clientWidth;

      console.log("resize, ", this.width,this.height)
      this.renderer.setSize(this.width, this.height);
      this.camera.aspect = this.width/this.height;
      this.camera.updateProjectionMatrix();

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

    this.renderer = new THREE.WebGLRenderer();
    //this.renderer.setSize( this.$el.clientWidth, this.$el.clientHeight );
    this.renderer.setClearColor( 0xffffff);
    this.$refs.three.appendChild( this.renderer.domElement );

    //les dimensions sont bonnes car ce code est appelé après avoir chargé le fichier, il y a donc un délai qui assure que le css a été chargé. par contre c'est pas clair le setsize, à revoir
    this.renderer.setSize(this.width, this.height);
    window.addEventListener('resize', this.handleResize);
    this.handleResize();



    //*******************************************************************
    //creation des géométries
    //*******************************************************************
    //crée tous les cubes
    let group = new THREE.Group();
    group.position.x = -this.imgDim/2 + 0.5;
    group.position.y = -this.imgDim/2 + 0.5;
    group.position.z = -this.imgDim/2 + 0.5;
    //group.rotateY(0.2);


    let geometry = new THREE.BoxGeometry();
    let edges = new THREE.EdgesGeometry( geometry );
    let meshMaterial = new THREE.MeshBasicMaterial( { color: 0x000000 } );
    let lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } );

    for (let y=0; y< this.imgDim; y++) {
      this.cubes[y] = [];
      this.lines[y] = [];
      for (let z=0; z< this.imgDim; z++) {
        this.cubes[y][z] = []
        this.lines[y][z] = []
        for (let x=0; x< this.imgDim; x++) {


          //le mesh
          let cube = new THREE.Mesh( geometry, meshMaterial );

          cube.position.x = x;
          cube.position.y = y;
          cube.position.z = z;

          cube.visible = false;

          group.add(cube);
          this.cubes[y][z][x] = cube;


          //les aretes
          let wireframe = new THREE.LineSegments( edges, lineMaterial );

          wireframe.position.x = x;
          wireframe.position.y = y;
          wireframe.position.z = z;

          wireframe.visible = false;

          group.add(wireframe);
          this.lines[y][z][x] = wireframe;
        }
      }
    }


    this.scene.add(group);



    this.camera.position.z = -this.imgDim;
    this.camera.position.y = this.imgDim/2;


    //lance l'animation // est-ce qu'il y a vraiment besoin d'animer d'ailleurs??
    this.id = window.requestAnimationFrame( this.animate);

    }

  },


  mounted:function() {

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
              for (let i = data.width-1; i>=0; i--) {
              this.pixels[i] = [];
              this.pixelsP5[i] = [];
               for (let j = data.height-1; j>=0; j--) {
                this.pixelsP5[i][j] = false;
                this.pixels[i][j] = data.pixels[j*data.width+i];
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
  },
  components: {
    P5Sketch: P5Sketch,
  },

}
</script>




<style scoped>

  #BitmapTo3D {
    width: 100vw;
  }

  #sketch {
    position:fixed;
    bottom:20px;
  }

</style>