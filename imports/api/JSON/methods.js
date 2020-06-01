
//todo : ifserver
Meteor.methods({

	removeFile(id){

		console.log("server, removing file", id)

		JSONCollection.remove(id, (error) => {
          if (error) {
            console.error(`File wasn't removed, error:  ${error.reason}`);
          } else {
            console.info('File successfully removed');
          }
        });
	}


});

