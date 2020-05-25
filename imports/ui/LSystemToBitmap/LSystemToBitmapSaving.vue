<template>
  <div id="Saving" class="box">

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
    width:25%;
    height:80%;
    top:0;
    right:10px;
  }

  .closeButton {
    float:right;
  }

  textarea {
    display:block;
    width:100%;
  }

</style>