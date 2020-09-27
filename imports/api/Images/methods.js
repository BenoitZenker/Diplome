
Meteor.methods({

	insertImage(img) {

		Images.insert({
			img: img,	
			created_at: new Date(),		
			created_by: Meteor.userId(),
		});

		console.log("insertion de l'image'", img);
		console.log(Scenes.findOne().img)
	},

	deleteAllImages(){
		Images.remove({})
	}


});
