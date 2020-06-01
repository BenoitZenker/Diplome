<template>
  <div id="DB" class="box">

    <button type="button" class="closeButton" @click="closeDB" >X</button>

    <div v-if="!$subReady.LSystems">Loading...</div>

    <div v-else>
      <ul>
        <li v-for="elem in DBCursor" :key="elem._id" >
          <p @click="$emit('set-lsystem', elem)">{{elem.name}} par {{elem.author}} </p>
          <button v-if="elem.authorID == this.Meteor.userId() || this.Meteor.user().profile.role==='admin'" type="button" class="deleteButton" @click="deleteSave(elem)" >x</button>

        </li>
      </ul>
    </div>

  </div>
</template>


<script>

  import '/imports/api/LSystems/LSystems.js';

  export default {

    methods:{
      closeDB(){
          this.$emit("close");
      },
      deleteSave(elem){
        console.log("delete", elem._id);
        Meteor.call('removeLSystem', elem._id);
      }
    },
    
    meteor: {

      $subscribe: {
        'LSystems': [],
      },

      DBCursor () {
        return LSystems.find({}, {
          sort: {time: -1}
        })
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

  #DB {
    position:fixed;
    top:0;
    right:0;
  }

  ul {
    /*overflow-y: scroll;*/
    clear:both;
    margin:0;

  }

  p { 
    display:inline-block;
  }

  .closeButton {
    float:right;
  }



  .deleteButton {
    float:right;
    clear: both;
    margin-top: 10px;

  }

</style>