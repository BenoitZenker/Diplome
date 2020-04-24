<template>
  <div id="TextToBitmap" ref="TextToBitmap">


    <sketch  ref="sketch" :text="text" :rules="rules" :nb="parseInt(nb)" :parentWidth="getWidth" :parentHeight="getHeight"></sketch>

    <div id="interface">

      <textarea v-model="text" placeholder="Votre texte..."></textarea>

      <button type="button"  @click="addRule" >Ajouter une règle</button>

      <div id="block-iterations">
        <label for="iterations">Itérations = </label>
        <input type="number" value = "1" ref="nb" name="iterations" min="0" max="5" v-model="nb">
      </div>



      <ul id="rules">
        <li class="rule" v-for="(rule, index) in this.rules" :key="index" >
          <textarea v-model="rule.target"></textarea>
          <span>=</span>
          <textarea v-model="rule.rule"></textarea>
          <button type="button" name="delete" @click="deleteRule(index)">X</button>
        </li>
      </ul>


      <button type="button"  @click="handleSubmit" >save</button>
    </div>

      <DB v-if="showingDB" @set-lsystem="setLSystem" v-on:close="closeDB"></DB>
      <button v-else type="button"  @click="showDB" name="saves">saves</button>

  </div>
</template>




<script>
import Sketch from '/imports/ui/LSystemToBitmap/LSystemToBitmapSketch.vue'
import DB from '/imports/ui/LSystemToBitmap/LSystemToBitmapDB.vue'



export default {

  data() {
    //code here...
    return {
      showingDB: false,
      text: '',
      rules:[],
      nextRuleId: 0,
      nb: 1,

    }
  },


  // Vue Methods
  methods: {  

    showDB(){
      this.showingDB = true;
    },
    closeDB(){
      this.showingDB = false;
    },

    addRule(){
      this.rules.push({'rule':'', 'target':''});
      this.nextRuleId++;
    },

    deleteRule(id){
      this.rules.splice(id,1);
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

    setLSystem(elem){
      this.text = elem.expr;
      this.nb = elem.nb;
      this.rules = elem.rules.slice(0); //copie du tableau
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

    overflow: hidden;
    
  }

  #block-iterations {
    float:right;
  }
  #block-iterations input {
    width:40px;
  }

  textarea {
    width:99%;
    height:60px;
    font-size: 18px;
    margin-bottom: 8px;
  }

  canvas {
    width:400px;
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


  #interface {
    overflow: scroll;
    height:240px;
  }

  .rule textarea {
    font-size: 18px;
    line-height:32px;
    height:30px;
    width:200px;
    margin:0;
  }
  .rule button {
    vertical-align: top;
    margin:0;
  }

</style>