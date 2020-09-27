<template>
  <div id="Module1" ref="Module1">
 



    <div v-if="isMenu" id="menu" :style="menuStyle">
      <h1>image 🡒 3D</h1>
      <div class="navLeftContainer">
        <button class="navLeft" type="button"  @click="toStart" >Retour au menu</button>
      </div>
      <div class="navRightContainer">
        <button class="navRight" type="button"  @click="toModule2" >3D 🡒 image (aplatir)</button>
        <button class="navRight" type="button"  @click="toModule4" >3D 🡒 image (exploser)</button>
      </div>
    </div>

    <P5Sketch id ="sketch" ref ="sketch" :imgDim="imgDim" :width="sketchWidth" :height="sketchHeight" v-on:add-cubes="addCubes" :style="imageStyle"></P5Sketch>
    <div :style="threeStyle" ref="three" id="three"></div>


    
    
  </div>
</template>


<script>


  /*
  observe image
  save scene
  */

  import GLOBAL from '/imports/ui/GLOBAL.js';
  import THREE from 'three';
  import OrbitControls from 'orbit-controls-es6';

  import P5Sketch from '/imports/ui/Module1/P5Sketch.vue'

  import '/imports/api/Images/Images.js' 



export default {

  data() {
    return {

      isMenu:false,

      scene:Object,
      camera: Object,
      renderer: Object,
      controls: Object,
      cubes: Map,   //une map pour retrouver les cubes facilement
      saveScene:Array,



      id:undefined, //requestanimationframe

      imgDim: 16,

      pixels:Array,

    }
  },

  props: {
    baseDimension:Number,  
  },

  meteor:{
  },


  // Vue Methods
  methods: {  

    //*******************************************************************
    //Changement de composant
    //*******************************************************************
    toModule2:function(){
      this.saveSceneToDB();
      this.$emit('toModule2', this.scene);
    },

    toModule4:function(){
      this.saveSceneToDB();
      this.$emit('toModule4', this.scene);
    },

    toStart:function(){
      this.$emit('toStart')
    },


    //********************************************************************
    //BDD
    //********************************************************************
    saveSceneToDB:function(){
      console.log("insert scene in db from module 1", this.scene)
      console.log("saveScene", this.saveScene)
      Meteor.call('insertScene', JSON.stringify(this.saveScene));
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

        //sauvegarde du cube pour l'envoi dans la db
        this.saveScene.push({
          x:x-this.imgDim/2,
          y:y-this.imgDim/2,
          z:z-this.imgDim/2,
          color:'hsl('+h+','+s+'%,'+l+'%)',
          id:id,
          hslColors:[h,s,l],
        })
      }   
    },
  
    clearCubes:function(){

      //if (this.cubes.size > 0)
        for (const [key, value] of this.cubes) {
          this.scene.remove(this.scene.getObjectByName(key));
        }
      //clear cubes map
      this.cubes.clear();
      //clear sceneDB
      this.saveScene = new Array();
      
    },


    handleResize:function(){
      this.renderer.setSize(this.threeWidth, this.threeHeight);
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

    loadPixels:function(px){
      this.pixels = px;

      //empty p5
      this.$refs.sketch.clearAllPixels();


      //empty cubes and save
      this.clearCubes();

      //ajout des cubes
      for (let y =0; y< this.imgDim; y++){
          for (let x=0; x<this.imgDim; x++) {
            let c = this.pixels[y][x] 

            if (c) {
              //ajout à P5
              this.$refs.sketch.addPixel(x,y,c)
              
              //ajout à three et à la bdd scenes
              this.addCubes(x, this.imgDim-(y+1),c.h, c.s, c.l);
            }
          }
        }
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

    this.saveScene = new Array();
    this.cubes = new Map();


    //subscribe
    Meteor.subscribe('Images', Meteor.userId(), ()=>{
      let px = Images.findOne({}, {sort:{created_at:-1, limit:1}}).img.pixels
      if (px)
        this.loadPixels(px);
    })

     //observe changes
    var now = new Date();
    Images.find({created_at : {$gt:now}}).observe({
      added:(img)=>{
        console.log("image added", img.img);
        this.loadPixels(img.img.pixels);          
      },
    })


    //le tableau de pixels
    this.pixels = new Array(this.imgDim);
    for (let i = 0; i<this.imgDim;i++)
      this.pixels[i] = new Array(this.imgDim);

    //création de la scène 3D
    this.setup3D();


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
        'right':GLOBAL.MARGIN + 'px',
        'top': GLOBAL.MARGIN + 'px',
        'width': this.threeWidth +'px',
        'height': this.threeHeight +'px',
      }
    },

    imageStyle:function(){
      return{
        //'margin':GLOBAL.MARGIN + 'px',
        
        'left': GLOBAL.MARGIN +'px',
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