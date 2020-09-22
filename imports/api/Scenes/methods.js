Meteor.methods({

	insertScene({scene}) {

		Scenes.insert({
			'scene': scene,			
		});

		console.log("insertion de la scène");
	},


});
