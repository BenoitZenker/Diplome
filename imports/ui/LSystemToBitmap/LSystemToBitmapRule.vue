<template>
  <div id="rule" ref="rule">
    <textarea v-model="target" @input="changeRule"></textarea>
    = 
    <textarea v-model="rule" @input="changeRule"></textarea>
    <button type="button" name="delete" @click="deleteRule">X</button>
  </div>
</template>

<script>

  export default {
    

    props:{
      id:Number,
      rule:String,
      target:String,
    },
    
    methods: {
      changeRule(event) {
        this.$emit('updateRule', this.rule, this.target, this.id);
      },
      deleteRule(event) {
        this.$emit('deleteRule', this.id);
      },
    }
  }

</script>




<style scoped>

  textarea {
    font-size: 18px;
    line-height:32px;
    height:30px;
    margin:0;
  }
  button {
    vertical-align: top;
    margin:0;
  }


</style>