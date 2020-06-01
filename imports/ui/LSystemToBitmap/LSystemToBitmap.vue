<template>
  <div id="TextToBitmap" ref="TextToBitmap">

    <button class="navLeft" type="button"  @click="toStart" >Retour au menu</button>

  <LSCanvas  id="LSCanvas" v-if="docReady" ref="LSCanvas" :text="text" :rules="rules" :nb="parseInt(nb)" :baseDimension="baseDimension*2" :style="canvasStyle" :res="16"></LSCanvas>


    <div id="interface" class="box" :style="interfaceStyle">
      <div id="instructions">
          <p>Saisissez des caractères pour tracer des pixels.</p>
          <p>Les carcatères '+' et '-' changent de direction, les caractères '[' et ']' ouvrent et ferment des branches.</p>
          <p>Indiquez des règles de remplacement pour transformer le texte.</p>
          <p>Vous pouvez charger des modèles enregistrés, ou sauvegarder votre texte.</p>
      </div>
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

      <DB :style="DBStyle" v-if="showingDB" @set-lsystem="setLSystem" v-on:close="closeDB"></DB>
      <button v-else type="button"  @click="showDB" name="saves">Charger une formule enregistrée</button>

    </div>


    <!--
    <button class="navRight" type="button"  @click="toBitmapTo3D" >BitmapTo3D</button>
  -->
    <button class="navRight" type="button"  @click="saveToBitmap" >save bitmap</button>

      
  </div>
</template>




<script>
import LSCanvas from '/imports/ui/LSystemToBitmap/LSystemToBitmapCanvas.vue'
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
      docReady:false,

    }
  },

  props: {
    baseDimension:Number,
  },

  destroyed: function() {
    console.log("LSYSTEM destroyed");
    window.removeEventListener('resize', this.handleResize);
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

    saveToBitmap(){
      console.Log("save")
    },

    setLSystem(elem){
      this.text = elem.expr;
      this.nb = elem.nb;
      this.rules = elem.rules.slice(0); //copie du tableau
    },
  },


  computed: {

    interfaceStyle(){
      console.log(this.baseDimension);
      return {
        'width': this.baseDimension+'px',
        'height':this.baseDimension*1.5+'px',
      }
    },

    canvasStyle(){
      return{
        'margin-left': this.baseDimension+'px',
        'width': this.baseDimension*2+'px',
        'height': this.baseDimension*2+'px',
        'top':'0px',
        'position':'absolute',
      }
    },

    DBStyle(){
      return {
        'width': this.baseDimension+'px',
        'height':this.baseDimension*1.5+'px',
      }
    },
  },

  mounted:function() {
    console.log("monting LSystemToBitmap")
    this.docReady=true;
  },

  components: {
    DB : DB,
    Saving : Saving,
    LSCanvas : LSCanvas,
  },

}
</script>




<style scoped>

  #TextToBitmap {
    margin:0;
    padding:0;
  }

  #interface {
    position: absolute;
    top:0;
    overflow-y:scroll;
    overflow-x: hidden;
  }




  #block-iterations {
    float:right;
  }
  #block-iterations input {
    width:40px;
  }

  textarea {
    width:99%;
    height:160px;
    font-size: 14px;
    margin-bottom: 8px;
  }


  ul {
    margin:0;
  }

  li {
    display:inline-block;
    width:100%;
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

  #instructions {
    background-color: #faf6c0;
  }

</style>