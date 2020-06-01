<template>
  
  <div :style="styleLogin" id="Login" ref="Login">

    <div v-if="isLogged" class="box">
      <p>
        connecté sur : {{userName}}
      </p>
      <button class="buttonFaint" type="button"  @click="logout" >Se déconnecter</button>
    </div>

    <div v-else class="box">
          <form v-if="creatingAccount"> 
            <textarea v-model="createName" placeholder="compte"></textarea>
            <textarea v-model="createPassword" placeholder="mot de passe"></textarea>
            <textarea v-model="checkPassword" placeholder="mot de passe (vérification)"></textarea>
            <button type="button"  @click="createAccount" >Créer le compte</button>
            <button class="buttonFaint" type="button"  @click="switchCreatingAccount" >Se connecter</button>
          </form>

          <form v-else>
            <textarea v-model="name" placeholder="compte"></textarea>
            <textarea v-model="password" placeholder="mot de passe"></textarea>
            <button type="button"  @click="login" >Se connecter</button>
            <button class="buttonFaint" type="button"  @click="switchCreatingAccount" >Créer un compte</button>
          </form>
    </div>

  </div>
</template>




<script>

  import { Meteor } from 'meteor/meteor';
  import GLOBAL from '/imports/ui/GLOBAL.js';

  export default {

    data() {
      return {
        name:'',
        password:'',
        creatingAccount:false,
        createName:'',
        createPassword:'',
        checkPassword:'',
      }
    },

    props: {
      baseDimension:Number,
    },

    computed: {
      isLogged(){
        return !!this.currentUser
      },
      userName(){
        return this.currentUser.username;
      },
      styleLogin(){
        if (this.isLogged) {
          return {
            'top': '0px',
            'left': this.baseDimension*1.5 + 'px',
            'width': this.baseDimension + 'px',
            'height': this.baseDimension/2 + 'px',
            'padding':GLOBAL.MARGIN+'px',
          }
        }
        else {
          return {
          'top': this.baseDimension/2 + 'px',
          'left': this.baseDimension*1.5 + 'px',
          'width': this.baseDimension + 'px',
          'height': this.baseDimension + 'px',
          'padding':GLOBAL.MARGIN+'px',
        }
        }
      }
    },

    methods: {
      logout() {
        Meteor.logout();
      },
      login() {
        Meteor.loginWithPassword(this.name, this.password, function(error){
          if (error)
            alert(error);
        });
      },
      switchCreatingAccount(){
        this.creatingAccount = !this.creatingAccount;
      },
      createAccount() {
        //check password
        if (this.createPassword !== this.checkPassword)
          alert("les mots de passes sont différents")
        else if (this.createPassword === '')
          alert("le mot de passe est vide")
        //création du compte
        else {
          Meteor.call('callCreateUser', {name:this.createName, password:this.createPassword}, (error, result)=> {
            //callback : on se connecte au compté créé
            Meteor.loginWithPassword(this.createName, this.createPassword);
          });
        }
      },
    },

    meteor:{
      //pas besoin de suscribe pour user et userid
      currentUser() {
        return Meteor.user();
      },
    },

    mounted:function(){
    },

  }


</script>



<style scoped>
  #Login {
    position: absolute;
    box-sizing: border-box;
  }

  form {
    position: relative;
    top:50%;
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
  }

  p {
    text-align: center;
  }

  textarea, button {
    width:100%;
    text-align: center;
    height:30px;
    line-height: 30px;

    margin-bottom:5px;
  }

</style>