<template>
  <div id="TextToBitmap" ref="TextToBitmap">

    <div v-if="!$subReady.Texts">Loading...</div>

    <div v-else>

      <sketch ref="sketch" :text="text" :rules="rules" :nb="nb" :parentWidth="getWidth" :parentHeight="getHeight"></sketch>

     
      <form @submit.prevent="handleSubmit">
        

        <textarea v-model="text" placeholder="Texte de départ"></textarea>

        <input type="button" name="nouvelle règle" @click="addRule">
        <ul id="rules">
          <li v-for="rule in this.rules" :key="rule.id">
            <Rule @deleteRule ="deleteRule" @updateRule="updateRule" :id ="rule.id"></Rule>
          </li>
        </ul>

        
        <input type="number" value = "0" ref="nb" name="iterations" min="0" max="5" v-model="nb">

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
import Rule from '/imports/ui/LSystemToBitmap/LSystemToBitmapRule.vue'


export default {

  data() {
    //code here...
    return {
      isShowingDB: false,
      text: '',
      rules:[],
      nb: 0,
    }
  },


  // Vue Methods
  methods: {  
    updateRule(rule, target, id){

      this.rules[id].rule = rule;
      this.rules[id].target = target;
    },

    addRule(){
      this.rules.push ({'rule':'', 'target':'', 'id':this.rules.length})
    },

    deleteRule(id){
      console.log("d")
      this.rules.splice(id, 1);
    },


    handleSubmit(event) {
      //todo
      /*
      Meteor.call('insertLSystem', 
      {
        expression: this.text;
        rules: this.rules;
        nb: this.nb;
      });
      */
      //Meteor.call('insertText', {text : this.text}); 
    },


    setText(event){
      this.text = event.target.innerText;
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
    Sketch : Sketch,
    Rule : Rule,
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

  textarea[name="ruleTarget"] {
    width:30px;
  }
  textarea[name="rule"] {
    width:300px;
  }

  canvas {
    width:500px;
  }
</style>