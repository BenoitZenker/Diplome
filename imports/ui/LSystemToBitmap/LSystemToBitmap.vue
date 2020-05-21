<template>
  <div id="TextToBitmap" ref="TextToBitmap">

    <button class="navLeft" type="button"  @click="toStart" >Retour au menu</button>


    <sketch  ref="sketch" :text="text" :rules="rules" :nb="parseInt(nb)" :parentWidth="getWidth" :parentHeight="getHeight"></sketch>


    <div id="interface" class="box">
      <textarea v-model="text" placeholder="Votre texte..."></textarea>
      <button type="button"  @click="addRule" >Ajouter une règle</button>
      <div id="block-iterations">
        <label for="iterations">Itérations = </label>
        <input type="number" value = "1" ref="nb" name="iterations" min="0" max="16" v-model="nb">
      </div>
      <ul id="rules">
        <li class="rule" v-for="(rule, index) in this.rules" :key="index" >
          <textarea v-model="rule.target"></textarea>
          <span>=</span>
          <textarea v-model="rule.rule"></textarea>
          <button type="button" name="delete" @click="deleteRule(index)">X</button>
        </li>
      </ul>
      <Saving v-if="showingSaving" @save="save" v-on:close="closeSaving"></Saving>
      <button v-else type="button"  @click="showSaving" name="enregister">Enregistrer la formule</button>
      <DB v-if="showingDB" @set-lsystem="setLSystem" v-on:close="closeDB"></DB>
      <button v-else type="button"  @click="showDB" name="saves">Charger une formule enregistrée</button>
    </div>


    <button class="navRight" type="button"  @click="toBitmapTo3D" >BitmapTo3D</button>

      
  </div>
</template>




<script>
import Sketch from '/imports/ui/LSystemToBitmap/LSystemToBitmapSketch.vue'
import DB from '/imports/ui/LSystemToBitmap/LSystemToBitmapDB.vue'
import Saving from '/imports/ui/LSystemToBitmap/LSystemToBitmapSaving.vue'

import '/imports/api/JSON/JSON.js';


export default {

  data() {
    //code here...
    return {
      showingDB: false,
      showingSaving: false,
      text: '',
      rules:[],
      nextRuleId: 0,
      nb: 1,

    }
  },



  // Vue Methods
  methods: {  

    //NAVIGATION
    toStart(){
      this.$emit('toStart');
    },

    toBitmapTo3D(){

      //création du JSON
      let sketch = this.$refs.sketch.sketch;
      let myObj = {
        width: sketch.res, 
        height: sketch.res,
        pixels: sketch.pixels,
      };

      let myJSON = JSON.stringify(myObj);

      //création du fichier
      var f = new File([myJSON], "fromLSystem", {type:"json"});

      

      //préparation de l'upload
      let upload = JSONCollection.insert({
        file: f,
        streams: 'dynamic',
        chunkSize: 'dynamic',
      }, false);

      upload.on('start', function() {
          console.log("start upload");
        });



      //le callback après l'upload
      let afterUpload =(id)=>{  
        console.log("in lsystem before emit");
        console.log(JSONCollection.find({}).fetch());
        this.$emit('toBitmapTo3D',id);
      }
      upload.on('uploaded', function(error, fileObj) {
        if (error) {
          window.alert('Error during upload: ' + error.reason);
        } else {
          afterUpload(fileObj._id); //appel de la fonction après upload
          console.log("end upload")
        }
      });


      //lancement de l'upload
      upload.start();



    },



    showDB(){
      this.showingDB = true;
    },
    closeDB(){
      this.showingDB = false;
    },

    showSaving(){
      this.showingSaving = true;
    },

    closeSaving(){
      this.showingSaving = false;
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

    save(name) {
      console.log("saving", name, Meteor.user().username);

      Meteor.call('insertLSystem', 
      {
        expr: this.text,
        rules: this.rules, //on envoie le tableau pas la map
        nb: this.nb,
        name: name,
        authorID: Meteor.userId(),
        author: Meteor.user().username,
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
    Saving : Saving,
  },

}
</script>




<style scoped>

  #TextToBitmap {
    width: 100%;
    height: 100%;
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
    width:100%;
  }

  ul {
    margin:0;
  }

  li {
    display:inline-block;
    width:100%;
  }



  #interface {
    overflow: scroll;
    width: 25%;
    position:absolute;
    left:50%;
    top:50%;
  }

  #rules {
    margin-bottom:40px;
  }
  .rule textarea {
    font-size: 18px;
    line-height:32px;
    height:30px;
    width:160px;
    margin:0;
  }
  .rule button {
    float:right;
    clear:both;
  }


</style>