Meteor.methods({

	insertLSystem({expr, rules, nb}) {

		console.log("inserting ", expr, rules, nb);
		LSystems.insert({
			'expr': expr,
			'rules': rules,
			'nb': nb,
		});
	},

	removeAllLSystems(){
		LSystems.remove({});
	},

});

