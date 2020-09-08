import { Meteor } from 'meteor/meteor';

import '/imports/api/server/publications.js';

import '/imports/api/Users/methods.js';

import '/imports/api/LSystems/LSystems.js';
import '/imports/api/LSystems/methods.js';

import '/imports/api/JSON/JSON.js';
import '/imports/api/JSON/methods.js';

import '/imports/api/BitmapCollection.js';



Meteor.startup(() => {

	console.log("Meteor.startup")

	//création d'un compte admin si besoin
	if(Meteor.users.find({'profile.role':'admin'}).count() === 0){
		// Création d'au moins un Admin !
		console.log("admina account created");
		Accounts.createUser({username : "admin", password : "diplomeBenoit", profile : {role: "admin"}})

	}

});