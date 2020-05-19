<template>
  <div id="Saving">

    <button class= "closeButton" type="button"  @click="close" >X</button>

    <textarea v-model="text" placeholder="Rentrez un nom pour votre formule"></textarea>
    <button type="button"  @click="save" >enregistrer</button>


  </div>
</template>


<script>

  import '/imports/api/LSystems/LSystems.js';

  export default {

    data() {
    //code here...
    return {
      text: '',
    }
  },

    methods:{
      close(){
          this.$emit("close");
      },
      save() {
        this.$emit("save", this.text);
        this.close();
      },
    },
    
  }

</script>




<style scoped>

  li:hover {
    cursor:pointer;
  }

  li {
    margin-left:10px;
  }
  #Saving {
    position:fixed;
    width:600px;
    height:300px;
    top:200px;
    left:400px;
    background-color: white;
    border:solid;
  }

  .closeButton {
    float:right;
  }

  textarea {
    display:block;
    width:100%;
  }

</style>