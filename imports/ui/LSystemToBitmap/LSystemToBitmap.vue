<template>
  <div id="TextToBitmap" ref="TextToBitmap">

    <div v-if="!$subReady.Texts">Loading...</div>

    <div v-else>


     <sketch ref="sketch" :text="text" :rules="rules" :nb="nb" :parentWidth="getWidth" :parentHeight="getHeight"></sketch>

      <form @submit.prevent="handleSubmit">
        <textarea ref ="text" @input="handleInputText" placeholder="Texte de départ"></textarea>
        <textarea ref ="rules" @input="handleInputRules" placeholder="Règles de transformation"></textarea>
        <input type="number" ref="nb" name="iterations" min="0" max="5" @input="handleSubmitNb">

        <input type="submit" value="valider">
      </form>

      <ul>
        <li v-for="t in TextsCursor" @click="setText">
          {{t.text}}  -  {{t._id}}
        </li>
      </ul>


    </div>


  </div>
</template>




<script>
import '/imports/api/texts.js';
import Sketch from '/imports/ui/LSystemToBitmap/LSystemToBitmapSketch.vue'


export default {

  data() {
    //code here...
    return {
      isShowingDB: false,
      text: '',
      rules: '',
      nb: 0,
    }
  },


  // Vue Methods
  methods: {  
    handleInputText(event) {
      this.text = event.target.value;
    },
    handleInputRules(event) {
      this.rules = event.target.value;
    },
    handleSubmitNb(event) {
      this.nb = parseInt(event.target.value);
    },



    handleSubmit(event) {
      //todo
      Meteor.call('insertText', {text : this.text}); 
    },


    setText(event){
      this.text = event.target.innerText;
      this.$refs.textInput.value = this.text;
    },
  },

  computed: {
    getWidth(){
      return this.$refs.TextToBitmap.clientWidth;
    },
    getHeight(){
      return this.$refs.TextToBitmap.clientHeight;
    }
  },

  components: {
    sketch : Sketch,
  },

  // Meteor reactivity
  meteor: {
    // Subscriptions - Errors not reported spelling and capitalization.
    $subscribe: {
      'Texts': [],
    },

    TextsCursor () {
      return Texts.find({}, {
        sort: {time: -1}
      })
    },
  }
}
</script>




<style scoped>

  #TextToBitmap {
    width: calc(100vw - 500px);
    height: calc(100vh - 50px);

    background-color:pink;

    margin-left:250px;
    margin-top:40px;
    overflow:scroll;
  }

  li {
    list-style-type: none;
  }
  textarea {
    width:100%;
    height:50px;
    resize:none;
  }
  canvas {
    width:500px;
  }
</style>