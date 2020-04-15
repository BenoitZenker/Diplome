<template>
  <div id="rule" ref="rule">
    <textarea v-model="target" @input="changeRule"></textarea>
    = 
    <textarea v-model="rule" @input="changeRule"></textarea>
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
    }
  }

</script>




<style scoped>
  textarea {
    resize:none;
  }
</style>