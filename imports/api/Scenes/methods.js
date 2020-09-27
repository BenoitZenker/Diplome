
Meteor.methods({

	insertScene(scene) {

		Scenes.insert({
			scene: scene,	
			created_at: new Date(),	
			created_by: Meteor.userId(),	
		});

		console.log("insertion de la scène", scene);
		console.log(Scenes.findOne().scene)
	},

	deleteAllScenes(){
		Scenes.remove({})
	}


});
