<template>
  <div>
    <div v-if="!$subReady.Texts">Loading...</div>

    <div v-else>


      <form @submit.prevent="handleSubmit">
        <input v-model="text" placeholder="edit me">
      </form>
      <p>Message is: {{ text }}</p>


      <p>Textes existants dans la BDD:</p>
      <ul>
        <li v-for="t in TextsCursor">
          {{t.text}}  -  {{t._id}}
        </li>
      </ul>

    </div>

  </div>
</template>




<script>
import '/imports/api/texts.js';

export default {
  data() {
    //code here...
    return {
      text: '',
    }
  },

  // Vue Methods
  methods: {  
    handleSubmit(event) {
      console.log("submit", this.text);
      Meteor.call('insertText', {text : this.text}); 
    }
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
</style>