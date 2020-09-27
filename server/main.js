import { Meteor } from 'meteor/meteor';


import '/imports/api/Scenes/Scenes.js';
import '/imports/api/Scenes/methods.js';

import '/imports/api/Images/Images.js';
import '/imports/api/Images/methods.js';

import '/imports/api/Texts/Texts.js';
import '/imports/api/Texts/methods.js';

import '/imports/api/server/publications.js';

import '/imports/api/Users/methods.js';



Meteor.startup(() => {

	console.log("Meteor.startup")

	//création d'un compte admin si besoin
	if(Meteor.users.find({'profile.role':'admin'}).count() === 0){
		// Création d'au moins un Admin !
		console.log("admina account created");
		Accounts.createUser({username : "admin", password : "diplomeBenoit", profile : {role: "admin"}})

	}

});