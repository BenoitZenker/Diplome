<template>
  <div id="TextToBitmap" ref="TextToBitmap">


    <sketch ref="sketch" :text="text" :rules="rules" :nb="parseInt(nb)" :parentWidth="getWidth" :parentHeight="getHeight"></sketch>

   

    <textarea v-model="text" placeholder="Votre texte..."></textarea>

    <button type="button"  @click="addRule" >Ajouter une règle</button>

    <div id="block-iterations">
      <label for="iterations">Itérations = </label>
      <input type="number" value = "1" ref="nb" name="iterations" min="0" max="5" v-model="nb">
    </div>

    <ul id="rules">
      <li v-for="rule in this.rules" :key="rule.id">
        <Rule @deleteRule ="deleteRule" @updateRule="updateRule" :id ="rule.id"></Rule>
      </li>
    </ul>


    <button type="button"  @click="handleSubmit" >save</button>

    <DB v-on:setLSystem="setLSystem"></DB>

  </div>
</template>




<script>
import Sketch from '/imports/ui/LSystemToBitmap/LSystemToBitmapSketch.vue'
import Rule from '/imports/ui/LSystemToBitmap/LSystemToBitmapRule.vue'
import DB from '/imports/ui/LSystemToBitmap/LSystemToBitmapDB.vue'



export default {

  data() {
    //code here...
    return {
      isShowingDB: false,
      text: '',
      rules: [],  //le v-for ne marche pas avec map, il faut une copie en array
      rulesMap: new Map(),
      nextRuleId: 0,
      nb: 1,
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

      //ajout à la bdd
      Meteor.call('insertLSystem', 
      {
        expr: this.text,
        rules: this.rules, //on envoie le tableau pas la map
        nb: this.nb,
      });

    },


    //*******************************************************************
    //TODO!!!!!! c'est bidon, mieux vaut calcuer la turtle ici
    //*******************************************************************
    setLSystem(expr, rules, nb){
      this.text = expr;
      this.nb = nb;

      //make new array of rules
      this.rulesMap = new Map();
      for (let i = 0; i<rules.length; i++){
        this.rulesMap.set(rules[i].id, {'target': rules[i].target, 'rule': rules[i].rule, 'id':rules[i].id});
      }

      this.rules = Array.from(this.rulesMap.values());
      //also change the rule array
      //this.rules.length=0;
      //this.rules.push(...Array.from(this.rulesMap.values()));
      this.rules.forEach(function (rule) {
        console.log(rule.target);
      });
    },
  },

  computed: {

    //*******************************************************************
    //TODO!!!!!! ref n'est pas réactif!!!!!
    //*******************************************************************
    getWidth(){
      if (this.$refs.TextToBitmap)
        return this.$refs.TextToBitmap.clientWidth;
      else
        return 1080;
    },
    getHeight(){
      if (this.$refs.TextToBitmap)
        return this.$refs.TextToBitmap.clientHeight;
      else
        return 1080;
    }
  },

  components: {
    Sketch : Sketch,
    Rule : Rule,
    DB : DB,
  },

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