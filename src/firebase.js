import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
const auth = firebase.auth();

export { firebase, storage, auth };

export const uploadProductImages = async (images) => {
  try {
    const getDownloadURLs = [];
    const promises = [];
    images.forEach((image, index) => {
      const uploadTask = firebase.storage().ref().child(`/product-images/${image.name}`).put(image.file);
      promises.push(uploadTask);
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload image ${index} is ${progress}% done`);
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log(`Upload image ${index} is paused`);
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log(`Upload image ${index} is running`);
              break;
            default:
              break;
          }
        },
        (error) => {
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;
            case 'storage/canceled':
              // User canceled the upload
              break;

              // ...

            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
            default:
              break;
          }
          throw error;
        },
        () => {
          getDownloadURLs[index] = uploadTask.snapshot.ref.getDownloadURL();
        }
      );
    });
    await Promise.all(promises);
    const downloadURLs = await Promise.all(getDownloadURLs);
    return downloadURLs;
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};
