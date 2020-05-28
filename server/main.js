import { Meteor } from 'meteor/meteor';

import '/imports/api/server/publications.js';

import '/imports/api/LSystems/LSystems.js';
import '/imports/api/LSystems/methods.js';

import '/imports/api/JSON/JSON.js';
import '/imports/api/JSON/methods.js';



Meteor.startup(() => {

	console.log("Meteor.startup")

	//création d'un compte admin si besoin
	if(Meteor.users.find().count() === 0){
		// Création d'au moins un Admin !
		Accounts.createUser({username : "admin", password : "vesvsve", profile : {role: "admin"}})
	
		Accounts.createUser({username : "fab", password : "vrevrever", profile : {role: "redacteur"}})
	}
});