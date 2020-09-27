Meteor.methods({

	insertText(txt) {


		Texts.insert({
			txt:txt,
			created_at: new Date(),
			created_by: Meteor.userId(),
		})
		console.log("insertion du texte", txt);
		console.log(Texts.findOne())
	},

	deleteAllTexts(){
		Texts.remove({})
	}


});
