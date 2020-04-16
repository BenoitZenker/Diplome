<template>
  <div id="DisplaySave">
    <p @click="$emit('setLSystem', expr, rules, nb)" >{{displayExpr}} {{rules}}</p>
  </div>
</template>


<script>


  export default {
    
    data() {
      return {
        displayExpr:this.expr?this.expr:"..."
      }
    },

    props:{
      expr:String,
      nb:Number,
      rules:Array,
      id:String,
    },
  }

</script>




<style scoped>

</style>