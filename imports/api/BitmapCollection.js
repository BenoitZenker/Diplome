//*******************************************************************
//Collection d'images au format Bitmap
//*******************************************************************
import { FilesCollection } from 'meteor/ostrio:files';

BitmapCollection = new FilesCollection({
  collectionName: 'BitmapCollection',
  //path relatif : les fichiers seront supprimés à chaque déploiement
  storagePath: './data/',
  allowClientCode: true, // Disallow remove files from Client
  onBeforeUpload(file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 10485760 && /bmp/i.test(file.type)) {
      return true;
    }
    return "fichier trop grand ou pas bmp";
  }
});



//*******************************************************************
//Méthodes
//*******************************************************************

//todo : ifserver
Meteor.methods({

	removeBitmap(id){
		console.log("server, removing file from bitmap", id)

		BitmapCollection.remove(id, (error) => {
          if (error) {
            console.error(`File wasn't removed, error:  ${error.reason}`);
          } else {
            console.info('File successfully removed');
          }
        });
	}

});




