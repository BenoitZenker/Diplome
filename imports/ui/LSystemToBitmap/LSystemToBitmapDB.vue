<template>
  <div id="DB">

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
    cursor:help;
  }

</style>