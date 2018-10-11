import ApiKeys from './apiKeys';
import * as firebase from 'firebase'
import 'firebase/firestore';

// firebase.initializeApp(ApiKeys.FirebaseConfig);

export default !firebase.apps.length 
  ? firebase.initializeApp(ApiKeys.FirebaseConfig).firestore()
  : firebase.app().firestore();