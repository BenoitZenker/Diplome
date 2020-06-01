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


