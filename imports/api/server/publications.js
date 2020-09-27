Meteor.publish('Scenes', function(id) {
	//console.log("server subscribtion to scene", Scenes.findOne())
	return Scenes.find({created_by:id});
});

Meteor.publish('Images', function(id) {
	console.log("userID:", id);
	console.log("server subscribtion to image", Images.findOne({created_by:id}))
	return Images.find({created_by:id});
});


Meteor.publish('Texts', function(id) {
	//console.log("server subscribtion to texts", Texts.findOne())
	return Texts.find({created_by:id});
});

