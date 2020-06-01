Meteor.publish('LSystems', function () {
	return LSystems.find({});
});

Meteor.publish('Users', function() {
	if(Meteor.user().profile.role === 'admin')
		return Meteor.users.find({});
});

Meteor.publish('JSONCollection', function() {
	return JSONCollection.find().cursor;
});
