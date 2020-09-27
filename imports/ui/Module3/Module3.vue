<template>
  <div id="Module3" ref="Module3">

    <div v-if="isMenu" id="menu" :style="menuStyle">
      <h1>texte 🡒 image</h1>
      <div class="navLeftContainer">
        <button class="navLeft" type="button"  @click="toStart" >Retour au menu</button>
      </div>
      <div class="navRightContainer">
        <button class="navRight" type="button"  @click="toModule1" >image 🡒 3D</button>
        <button class="navRight" type="button"  @click="toModule5" >image 🡒 texte</button>
      </div>
    </div>

    <Canvas id="Canvas" ref="Canvas" :text="text"  :width="canvasWidth" :height="canvasHeight" :style="canvasStyle" :res="16"></Canvas>

    <textarea v-model="text" placeholder="Saisir un texte..." :style="textAreaStyle"></textarea>
  
  </div>
</template>




<script>

  import GLOBAL from '/imports/ui/GLOBAL.js';
  import Canvas from '/imports/ui/Module3/Canvas.vue'

  import '/imports/api/Texts/Texts.js'

  export default {

    data(){
      return {
        isMenu:false,
        text: '',
        rules:[],
        nextRuleId: 0,
        nb: 1,
      }
    },

    props: {
      baseDimension:Number,
    },

    mounted:function() {
      console.log("monting module3")

    //subscribe
    Meteor.subscribe('Texts', Meteor.userId(), ()=>{
      let txt = Texts.findOne({}, {sort:{created_at:-1, limit:1}}).txt;
      console.log("latest txt", txt)
      if (txt)
        this.text = txt;
    })

     //observe changes
    var now = new Date();
    Texts.find({created_at : {$gt:now}}).observe({
      added:(txt)=>{
        console.log("text added", txt.txt);
        this.text = txt.txt; 
      },
    })


      //listener du clavier
      this.isMenu = false;
      document.addEventListener('keyup', (evt)=> {
        if(evt.keyCode == 27 || evt.keyCode == 13)
          this.isMenu = !this.isMenu;
      });
    },

    destroyed: function() {
      console.log("LSYSTEM destroyed");
      window.removeEventListener('resize', this.handleResize);
    },

    // Vue Methods
    methods: {  

      //*******************************************************************
      //Changement de composant
      //*******************************************************************
      toModule1:function(){
        this.saveImageToDB();
        this.$emit('toModule1', this.$refs.Canvas.pixels);
      },

      toModule5:function(){
        this.saveImageToDB();
        this.$emit('toModule5', this.$refs.Canvas.pixels);
      },

      toStart:function(){
        this.$emit('toStart')
      },

      saveImageToDB:function(){
        console.log("saving px", this.$refs.Canvas.pixels)
        Meteor.call('insertImage', {
          pixels:this.$refs.Canvas.pixels,
          dim: this.imgDim,
      });
    }

    },


    computed: {

      canvasWidth(){
        return this.baseDimension*2 - GLOBAL.MARGIN*2;
      },
      canvasHeight(){
        return this.baseDimension*2 - GLOBAL.MARGIN*2;
      },
      textAreaWidth(){
        return this.baseDimension*2 - GLOBAL.MARGIN*2;
      },
      textAreaHeight(){
        return this.baseDimension*2 - GLOBAL.MARGIN*2;
      },

      canvasStyle(){
        return{
          'right': GLOBAL.MARGIN+'px',
          'width': this.canvasWidth+'px',
          'height': this.canvasHeight+'px',
          'top':GLOBAL.MARGIN+'px',
          'position':'absolute',
        }
      },

      textAreaStyle(){
        return{
          'margin-left': GLOBAL.MARGIN+'px',
          'width': this.textAreaWidth+'px',
          'height': this.textAreaHeight+'px',
          'top':GLOBAL.MARGIN+'px',
          'position':'absolute',
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
    },

    
    components: {
      Canvas : Canvas,
    },
  }

</script>




<style scoped>

  textarea {
    width:99%;
    height:160px;
    font-size: 22px;
    margin-bottom: 8px;
    padding:4px;
    background-color: rgba(255, 255, 255, .5);  
  }




</style>