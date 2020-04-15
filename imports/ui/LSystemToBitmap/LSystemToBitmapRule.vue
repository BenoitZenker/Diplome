<template>
  <div id="rule" ref="rule">
    <textarea v-model="target" @input="changeRule"></textarea>
    = 
    <textarea v-model="rule" @input="changeRule"></textarea>
    <input type="button" name="delete" @click="deleteRule">
  </div>
</template>

<script>

  export default {
    
    data() {
      return {
        rule:'F',
        target:'F',
      }
    },

    props:{
      id:Number,
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
    resize:none;
  }
</style>