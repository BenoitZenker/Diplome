Meteor.methods({
	UpdateTime() {
		Time.upsert('currentTime', { $set: { time: new Date() } });
	},

	//*******************************************************************
	//BDD texts
	//*******************************************************************
	UpdateText(text) {
		Text.insert('text', text);
	}


});

