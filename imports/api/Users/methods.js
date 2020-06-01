import { Meteor } from 'meteor/meteor';

Meteor.methods({

	callCreateUser({name, password}){
		console.log("creating user ", name);
		try{
			Accounts.createUser({username:name, password:password});
		} catch (error) {
			console.log(error);
		} 
	},

	removeUser({id}){
		console.log("removing user", id);
		if (Meteor.user().profile.role === 'admin') {
			try {
				Meteor.users.remove(id)
			} catch (error) {
				console.log(error);
			} 
		}
	},


});