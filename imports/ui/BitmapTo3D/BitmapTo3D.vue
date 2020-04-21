<template>
  <div id="BitmapTo3D" ref="BitmapTo3D">
   
    <vgl-renderer ref="renderer" class="vgl-renderer" camera="camera" scene="scene" >
      <vgl-box-geometry name="box"></vgl-box-geometry>
      <vgl-scene name="scene">
        <vgl-mesh geometry="box"></vgl-mesh>
      </vgl-scene>
      <vgl-perspective-camera name="camera" orbit-position="3 1 0.5"></vgl-perspective-camera>
      <orbit-controls camera="camera" @camera-change="cameraChange"></orbit-controls> 
    </vgl-renderer>


    
  </div>
</template>


<script>
  import VueGL from 'vue-gl';
  import Vue from 'vue';
  import OrbitControls from 'orbit-controls-es6';

  //TODO faire les imports localement, ou les faire ailleurs  
  Object.keys(VueGL).forEach((name) => Vue.component(name, VueGL[name]));




  //création d'un composant orbitcontrol pour gérer la caméra avec la souris
  Vue.component('OrbitControls', {
    inject: ['vglNamespace'],

    props: ['camera'],

    computed: {
      cmr () {
        return this.vglNamespace.cameras.get("camera");
      }
    },

    mounted() {
      console.log(this.$el)

      this.mounted = true;
    },


    watch: {
      cmr: {

        //TODO:::
        //créer un event et lancer l'event à la création du canvas, depuis le parent
        handler(cmr) {
          console.log("changed");
          console.log(this.mounted)
          
          const controls = new OrbitControls(cmr)
          controls.addEventListener('change', () => {
            this.$emit('camera-change')
          })
          

        },
        immediate: true,
      }
    },

    render(h) {
      return h('div');
    },
  });



  

export default {

  data() {
    return {

    }
  },


  // Vue Methods
  methods: {  
    cameraChange(){
      this.$refs.renderer.requestRender();
    }
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