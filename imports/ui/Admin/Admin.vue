<template>
  <div id="Admin" ref="Admin" >
   
    <h1>USERS</h1>
    <ul>
      <li v-for="user in UsersCursor" :key="user._id" >
          {{user.username}}
          <button @click="removeUser(user._id)">X</button>
      </li>
    </ul>


    <h1>LSYSTEMS</h1>
    ...

    <h1>JSON</h1>
    <ul>
      <li v-for="elem in JSONCursor" :key="elem._id" >
          {{ getJSONLink(elem._id)}}
          <button @click="removeFile(elem._id)">X</button>
      </li>
    </ul>

    <h1>BITMAP</h1>
    <ul>
      <li v-for="elem in BitmapCursor" :key="elem._id" >
          <img class="bitmap16px" :src="getBitmapLink(elem._id)" >
          <button @click="removeBitmap(elem._id)">X</button>
      </li>
    </ul>

  </div>
</template>




<script>

  import { Meteor } from 'meteor/meteor';
  import '/imports/api/JSON/JSON.js';
  import '/imports/api/BitmapCollection.js'


  export default {

    data() {
      return {
      }
    },



    methods: {
      removeUser(id){
        console.log("suppression de l'utilisateur "+ id)
        Meteor.call('removeUser', {id:id})
      },

      removeFile(id){
        console.log('remove file'+id)
        Meteor.call('removeFile', id);
      },

      removeBitmap(id){
        console.log('remove bitmap'+id)
        Meteor.call('removeBitmap', id);
      },

      getJSONLink(id){
        return JSONCollection.findOne(id).link();
      },

      getBitmapLink(id){
        return BitmapCollection.findOne(id).link();
      },
    },



    meteor: {

        //les noms n'ont pas d'importance
        $subscribe: {
          'LSystems': [],
          'Users': [],
          'JSONCollection': [],
          'BitmapCollection': [],
        },

        LSystemsCursor () {
          return LSystems.find({}, {
            sort: {time: -1}
          })
        },

        UsersCursor(){
          return Meteor.users.find({}, {
            sort: {time: -1}
          })
        },

        JSONCursor () {

          return JSONCollection.find({}, {
            sort: {time: -1}
          })
        },

        BitmapCursor () {
          return BitmapCollection.find({}, {
            sort: {time: -1}
          })
        },
        

      },
  }


</script>



<style scoped>

  #Admin {
    overflow-y: scroll;
    height:100vh;
  }

  .bitmap16px {
    width:100px;
    height:100px;
  }
</style>