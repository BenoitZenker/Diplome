<template>
  <div id="DB">

    <button type="button"  @click="close" >X</button>

    <div v-if="!$subReady.LSystems">Loading...</div>

    <div v-else>
      <ul>
        <li v-for="elem in DBCursor" :key="elem._id" @click="$emit('set-lsystem', elem)">
          <p>{{elem.expr}}, {{elem.rules.length}} règles, {{elem.nb}} itérations</p>
        </li>
      </ul>
    </div>

  </div>
</template>


<script>

  import '/imports/api/LSystems/LSystems.js';

  export default {

    methods:{
      close(){
        this.$emit("close");
      },
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
    width:600px;
    height:500px;
    top:200px;
    right:200px;
    background-color: white;
    border:solid;
  }

  button {
    float:right;
  }

</style>