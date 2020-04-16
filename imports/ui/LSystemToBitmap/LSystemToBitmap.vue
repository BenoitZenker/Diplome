<template>
  <div id="TextToBitmap" ref="TextToBitmap">

    <div v-if="!$subReady.Texts">Loading...</div>

    <div v-else>

      <sketch ref="sketch" :text="text" :rules="rules" :nb="nb" :parentWidth="getWidth" :parentHeight="getHeight"></sketch>

     
      <form @submit.prevent="handleSubmit">
        

        <textarea v-model="text" placeholder="Votre texte..."></textarea>

        <button type="button"  @click="addRule" >Ajouter une règle</button>

        <div id="block-iterations">
          <label for="iterations">Itérations = </label>
          <input type="number" value = "0" ref="nb" name="iterations" min="0" max="5" v-model="nb">
        </div>

        <ul id="rules">
          <li v-for="rule in this.rules" :key="rule.id">
            <Rule @deleteRule ="deleteRule" @updateRule="updateRule" :id ="rule.id"></Rule>
          </li>
        </ul>

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
      rules: [],  //le v-for ne marche pas avec map, il faut une copie en array
      rulesMap: new Map(),
      nextRuleId: 0,
      nb: 0,
    }
  },


  // Vue Methods
  methods: {  
    updateRule(rule, target, id){

      this.rulesMap.get(id).rule = rule;
      this.rulesMap.get(id).target = target;
    },

    addRule(){
      this.rulesMap.set(this.nextRuleId, {'rule':'', 'target':'', 'id':this.nextRuleId})
      this.rules = Array.from(this.rulesMap.values());
      this.nextRuleId++;
    },

    deleteRule(id){
      this.rulesMap.delete(id);
      this.rules = Array.from(this.rulesMap.values());
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

    margin-left:250px;
    margin-top:40px;
    overflow:scroll;
  }

  #block-iterations {
    float:right;
  }
  #block-iterations input {
    width:40px;
  }

  textarea {
    width:100%;
    height:60px;
    font-size: 18px;
    margin-bottom: 8px;
  }

  canvas {
    width:500px;
  }

  ul {
    margin:0;
    padding:0;
  }
  li {
    margin-bottom:8px;
    padding:0;
    height:32px;
  }

</style>