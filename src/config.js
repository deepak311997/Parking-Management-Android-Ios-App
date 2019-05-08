import Firebase from 'firebase';
let config = {
    apiKey: 'AIzaSyCzbpQTPVQznBN5oZkyQN55XlMtUl7rH9U',
    authDomain: 'https://parking-management-4f63f.firebaseio.com/',
    databaseURL: 'https://parking-management-4f63f.firebaseio.com/',
    projectId: 'parking-management-4f63f',
    storageBucket: 'parking-management-4f63f.appspot.com',
    messagingSenderId: '391613310418'
};
let app = Firebase.initializeApp(config);
export const db = app.database();
