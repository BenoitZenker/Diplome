<template>
  <div id="DB">

    <div v-if="!$subReady.LSystems">Loading...</div>

    <div v-else>
      <ul>
        <li v-for="elem in DBCursor" >
          <DisplaySave :expr="elem.expr" :rules="elem.rules" :nb="parseInt(elem.nb)" :id="elem._id" @setLSystem="setLSystem"></DisplaySave>
        </li>
      </ul>
    </div>

  </div>
</template>


<script>

  import '/imports/api/LSystems/LSystems.js';
  import DisplaySave from '/imports/ui/LSystemToBitmap/LSystemToBitmapSave'

  export default {
    
    data() {
      return {
      }
    },

    components:{
      DisplaySave : DisplaySave,
    },
    
    methods: {
      setLSystem(expr, rules, nb){
        this.$emit('setLSystem', expr, rules, nb)
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

</style>