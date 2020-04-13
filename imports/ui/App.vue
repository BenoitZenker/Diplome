<template>
  <div>


    <div v-if="!$subReady.Texts">Loading...</div>

    <div v-else>


     <sketch :text="text"></sketch>

      <p>Message is: {{ text }}</p>

      <form @submit.prevent="handleSubmit">
        <textarea ref ="textInput" @input="handleInput" placeholder="edit me"></textarea>
        <input type="submit" value="valider">
      </form>

      <ul>
        <li v-for="t in TextsCursor" @click="setText">
          {{t.text}}  -  {{t._id}}
        </li>
      </ul>


    </div>

  </div>
</template>




<script>
import '/imports/api/texts.js';
import Sketch from '/imports/ui/sketch.vue'

export default {

  data() {
    //code here...
    return {
      isShowingDB: false,
      text: '',
    }
  },


  // Vue Methods
  methods: {  
    handleInput(event) {
      this.text = event.target.value;
    },

    handleSubmit(event) {
      Meteor.call('insertText', {text : this.text}); 
    },

    setText(event){
      this.text = event.target.innerText;
      this.$refs.textInput.value = this.text;
    },


  },

  components: {
    sketch : Sketch,
  },

  // Meteor reactivity
  meteor: {
    // Subscriptions - Errors not reported spelling and capitalization.
    $subscribe: {
      'Texts': [],
    },

    TextsCursor () {
      return Texts.find({}, {
        sort: {time: -1}
      })
    },
  }
}
</script>




<style scoped>
  p {
    font-size: 2em;
  }
  li {
    list-style-type: none;
  }
  textarea {
    width:800px;
    height:200px;
    resize:none;
  }
</style>