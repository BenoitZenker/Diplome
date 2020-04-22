<template>
  <div id="BitmapTo3D" ref="BitmapTo3D">
  </div>
</template>


<script>

  import THREE from 'three';
  import OrbitControls from 'orbit-controls-es6';


export default {

  data() {
    return {

      width:800,
      height:400,

      scene:Object,
      camera: Object,
      renderer: Object,
      controls: Object,

      id:undefined, //requestanimationframe
    }
  },


  // Vue Methods
  methods: {  
    handleResize:function(){
      this.height = this.$el.clientHeight;
      this.width = this.$el.clientWidth;

      this.renderer.setSize(this.width, this.height);
    },

    animate:function(){
      this.controls.update();
      this.renderer.render( this.scene, this.camera );
      this.id = window.requestAnimationFrame(this.animate);
    },
  },


  mounted:function() {

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.controls = new OrbitControls(this.camera,this.$el)

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( this.$el.clientWidth, this.$el.clientHeight );
    this.$el.appendChild( this.renderer.domElement );

    //TODO dans mounted() le css n'est pas prêt, et les dimensions du canvas sont mauvaises.
    this.renderer.setSize(this.width, this.height);
    window.addEventListener('resize', this.handleResize);


    var geometry = new THREE.BoxGeometry();
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    this.scene.add( cube );

    this.camera.position.z = 5;


    //lance l'animation // est-ce qu'il y a vraiment besoin d'animer d'ailleurs??
    this.id = window.requestAnimationFrame( this.animate);
    
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
    width: calc(100vw - 500px);
    height: calc(100vh - 50px);
    margin-left:250px;
    top:40px;
    overflow:scroll;
  }


</style>