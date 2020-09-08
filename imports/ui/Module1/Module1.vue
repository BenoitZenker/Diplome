<template>
  <div id="Module1" ref="Module1">
 


    <div v-if="isMenu" id="menu" :style="menuStyle">
      <div class="navLeftContainer">
        <button class="navLeft" type="button"  @click="toStart" >Retour au menu</button>
      </div>
      <div class="navRightContainer">
        <button class="navRight" type="button"  @click="toModule2" >3D -> Image</button>
        <button class="navRight" type="button"  @click="toModule4" >éclater la 3D</button>
      </div>
    </div>

    <P5Sketch id ="sketch" ref ="sketch" :imgDim="imgDim" :width="sketchWidth" :height="sketchHeight" :pixelsProps ="pixels" v-on:add-cubes="addCubes" :style="imageStyle"></P5Sketch>
    <div :style="threeStyle" ref="three" id="three"></div>


    
    
  </div>
</template>


<script>

  import GLOBAL from '/imports/ui/GLOBAL.js';
  import THREE from 'three';
  import OrbitControls from 'orbit-controls-es6';
  import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

  import P5Sketch from '/imports/ui/Module1/P5Sketch.vue'



export default {

  data() {
    return {

      isMenu:false,

      scene:Object,
      camera: Object,
      renderer: Object,
      controls: Object,
      cubes: Map,   //une map pour retrouver les cubes facilement


      id:undefined, //requestanimationframe

      imgDim: 16,

    }
  },

  props: {
    baseDimension:Number,
    pixels:Array,
  },

  meteor:{
  },


  // Vue Methods
  methods: {  

    //*******************************************************************
    //Changement de composant
    //*******************************************************************
    toModule2:function(){
      this.$emit('toModule2', this.scene);
    },

    toModule4:function(){
      this.$emit('toModule4', this.scene);
    },

    toStart:function(){
      this.$emit('toStart')
    },


    addCubes:function(x,y,h, s, l){

      //on nettoie la colonne
      for (let z=0;z<this.imgDim;z++) {
          let id = x.toString()+y.toString()+z.toString();
          this.cubes.delete(id);
          this.scene.remove(this.scene.getObjectByName(id));
        }

      //si pas blanc, on crée un cube
      if (l!=100) {
        //calcul de z en fonction de alpha
        let z =  Math.floor((this.imgDim-1) * (100-l)/100);
        let id = x.toString()+y.toString()+z.toString();

        let cube = this.cubeGeometry.clone();    
        cube.translate(x, y, z);
        this.cubes.set(id, cube);


        //ajout du cube à la scène
        cube.translate(-this.imgDim/2,-this.imgDim/2,-this.imgDim/2);
        let cubeMaterial = new THREE.MeshLambertMaterial( { color: new THREE.Color('hsl('+h+','+s+'%,'+l+'%)') } );
        let mesh = new THREE.Mesh( cube, cubeMaterial );
        mesh.name = id;
        mesh.hslColors = [h,s,l];
        this.scene.add(mesh);
      }   
    },
  



    handleResize:function(){
      this.renderer.setSize(this.threeWidth, this.threeHeight);
      //this.camera.aspect=this.threeWidth/this.threeHeight;    //useless
    },

    animate:function(){
      this.controls.update();
      this.renderer.render( this.scene, this.camera );
      this.id = window.requestAnimationFrame(this.animate);
    },

    setup3D:function() {
      //*******************************************************************
      //création de la scène
      //*******************************************************************
      this.scene = new THREE.Scene();

      this.camera =  new THREE.PerspectiveCamera( 80, this.threeWidth/this.threeHeight, 1, 1000 );
      this.camera.aspect=this.threeWidth/this.threeHeight;
      this.controls = new OrbitControls(this.camera,this.$refs.three);

      this.renderer = new THREE.WebGLRenderer({ alpha: true });
      //this.renderer.setSize( this.$el.clientWidth, this.$el.clientHeight );
      this.renderer.setClearColor( 0xffffff, 0.5 ); 
      this.$refs.three.appendChild( this.renderer.domElement );

      this.renderer.setSize(this.threeWidth, this.threeHeight);
      window.addEventListener('resize', this.handleResize);

      //géométries
      this.cubeGeometry = new THREE.BoxBufferGeometry();


      //lumières
      var spotLight = new THREE.SpotLight( 0xffffff );
      spotLight.position.set( -10, 3, 30, 100 );
      this.scene.add(spotLight);

      var ambiantLight = new THREE.AmbientLight( 0x404040 );
      this.scene.add(ambiantLight);
     
      this.camera.position.z = this.imgDim*1.2;
     
      //lance l'animation // est-ce qu'il y a vraiment besoin d'animer d'ailleurs??
      this.id = window.requestAnimationFrame( this.animate);

      console.log("three js settings done");
    },
  },

  destroyed: function() {
    console.log("Module 1 destroyed");
    window.removeEventListener('resize', this.handleResize);
    window.cancelAnimationFrame(this.id);
    this.id = undefined;
  },

  mounted:function() {
    console.log("mounting module 1");
  
    this.cubes = new Map();

    //création de la scène 3D
    this.setup3D();

    //si on a des pixels de base on pose les cubes correspondants
    if (this.pixels){
      for (let y =0; y< this.imgDim; y++){
        for (let x=0; x<this.imgDim; x++) {
          let c = this.pixels[y][x] 

          if (c) {
            this.addCubes(x, this.imgDim-(y+1),c.h, c.s, c.l);
          }
        }
      }
    }


    //listener du clavier
    this.isMenu = false;
    document.addEventListener('keyup', (evt)=> {
      console.log(evt.keyCode);
      if(evt.keyCode == 27 || evt.keyCode == 13)
        this.isMenu = !this.isMenu;
    });
  },

  
  computed:{
    threeStyle:function(){
      return{
        'left': GLOBAL.MARGIN +'px',
        'top': GLOBAL.MARGIN + 'px',
        'width': this.threeWidth +'px',
        'height': this.threeHeight +'px',
      }
    },

    imageStyle:function(){
      return{
        //'margin':GLOBAL.MARGIN + 'px',
        'right':GLOBAL.MARGIN + 'px',
        'top':GLOBAL.MARGIN + 'px',
        'width': this.imageDimensions +'px',
        'height': this.imageDimensions +'px',
      }
    },

    menuStyle:function(){
      return {
        'right': '0px',
        'top':'0px',
        'height': this.baseDimension*2+'px',
        'width': this.baseDimension*4+'px',
      }
    },



    threeWidth:function(){
      return this.baseDimension*3 - GLOBAL.MARGIN*2;
    },

    threeHeight:function(){
      return this.baseDimension*2 - GLOBAL.MARGIN*2;
    },

    sketchWidth:function(){
      return this.baseDimension- GLOBAL.MARGIN*2;
    },
    sketchHeight:function(){
      return this.baseDimension*2- GLOBAL.MARGIN*2;
    },
  },

  components: {
    P5Sketch: P5Sketch,
  },

}
</script>




<style scoped>

  #sketch {
    position:absolute;
    top:0;
    right:0;
  }

  #three {
    position: absolute;
  }

</style>