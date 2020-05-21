import { FilesCollection } from 'meteor/ostrio:files';


JSONCollection = new FilesCollection({
  collectionName: 'JSONCollection',
  allowClientCode: true, // Disallow remove files from Client
  onBeforeUpload(file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 10485760 && /json/i.test(file.type)) {
      return true;
    }
    return "fichier trop petit ou pas json";
  }
});



if (Meteor.isClient) {
  Meteor.subscribe('files.JSONCollection.all');	//le nom n'a pas d'importance il faut juset que ce soit le même dans publish et subscribe
}

if (Meteor.isServer) {
  Meteor.publish('files.JSONCollection.all', function () {
    return JSONCollection.find().cursor;
  });

}

