import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button
} from 'react-native';
import { WebBrowser } from 'expo';
import { DocumentPicker, ImagePicker } from 'expo';

import { MonoText } from '../components/StyledText';

import firebase from 'firebase';
import Firebase from '../constants/Firebase';

// service firebase.storage {
//   match /b/{bucket}/o {
//     match /{allPaths=**} {
//       allow read, write: if request.auth != null;
//     }
//   }
// }

// var app = firebase.initializeApp(myFirebase);



// Create a reference to 'mountains.jpg'
// var mountainsRef = storageRef.child('testText.txt');
// var testTextRef = storageRef.child('testText.txt');

// Create a reference to 'images/mountains.jpg'
// var mountainImagesRef = storageRef.child('images/mountains.jpg');
// var testTextDocumentsRef = storageRef.child('documents/testText.txt');

// While the file names are the same, the references point to different files
// mountainsRef.name === mountainImagesRef.name            // true
// mountainsRef.fullPath === mountainImagesRef.fullPath    // false
// testTextRef.name === testTextRef.name             // true
// testTextDocumentsRef.fullPath === testTextDocumentsRef.fullPath    // false

export default class HomeScreen extends React.Component {
  state = {
    image: null,
    document: null
  };


  componentDidMount() {

    console.log('document directory',Expo.FileSystem.documentDirectory);
  }


  _pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    alert(result.uri);

    this.setState(
      {
        document: result
      }, () => console.log('document directory',Expo.FileSystem.documentDirectory + 'DocumentPicker/' )
    );



  }

  _pickImage = async () => {
    const Blob = RNFetchBlob.polyfill.Blob;
    const fs = RNFetchBlob.fs;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    alert(result.uri);
    console.log(result)

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };


  _uploadFile = () => {
    const doc = this.state.document;
    let docName = doc.name;
    let filename = this.state.document.name;
    let storageRef = firebase.storage().ref();
    let testTextRef = storageRef.child(docName);
    let testTextDocRef = storageRef.child('documents/' + docName);
    let file = "..."; //use blob or file API

    // ref.put(file).then(function (snapshot) {
    //   console.log('uploaded a blog or file!');
    // })

    var message = 'This is my message.';
    var uploadTask = testTextDocRef.putString(message);

    uploadTask.on('state_changed', function (snapshot) {
      //onserve state change events such as progress, pause, and resume
    }, function (error) {
      //Handle unsuccessful uploads
    }, function () {
      //handle successful oploads on complete
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        console.log('File available at', downloadURL);
      });
    
    })

    // const blah = Expo.FileSystem.cacheDirectory;
    // const newFile = new File(this.state.document, "textText.txt");

    // const response = await fetch(fileUri);
    // const blob = await response.blob();

  }


  static navigationOptions = {
    header: null,
  };

  render() {
    let { image } = this.state;
    return (
      <View style={styles.container}>
        <View>
          <Button
            title="Select Document"
            onPress={this._pickDocument}
          />
          {this.state.document ? <Text> file name: {this.state.document.name} </Text> : null}
          {this.state.document ? <Text> file size: {this.state.document.size}b </Text> : null}
          {this.state.document ? <Button title="upload" onPress={this._uploadFile} /> : null}
        </View>

        <View style={{ 'marginTop': 20 }}>
          <Button
            title="Select Image"
            onPress={this._pickImage}
          />
          {image &&
            <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


//firebase stuff

