Meteor.methods({

	insertText({text}) {
		Texts.insert({'text': text});
	}

});

