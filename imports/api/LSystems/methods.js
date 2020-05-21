Meteor.methods({

	insertLSystem({expr, rules, nb, name, authorID, author}) {

		LSystems.insert({
			'expr': expr,
			'rules': rules,
			'nb': nb,
			'name': name,
			'authorID': authorID,
			'author': author,
		});
		console.log("insertion lsystem");
	},

	removeLSystem(ID) {
        LSystems.remove(ID);
    },

	//utile pour le débug, dangereux en soit car accessible depuis le client
	removeAllLSystems(){
		LSystems.remove({});
	},


});

