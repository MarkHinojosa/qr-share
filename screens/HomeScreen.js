import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  CameraRoll,
} from 'react-native';
import { WebBrowser } from 'expo';
import { DocumentPicker, ImagePicker, takeSnapshotAsync, Permissions } from 'expo';

import { MonoText } from '../components/StyledText';

import firebase from 'firebase';
import Firebase from '../constants/Firebase';
import locktonLogo from '../assets/images/locktonLogo.png';
import hercLogo from '../assets/images/hercLogo.png';
import QRCode from 'react-native-qrcode';

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

  static navigationOptions = {
    header: null,
  };

  state = {
    image: null,
    document: null,
    downloadURL: null,
    cameraRollUri: null
  };


  componentDidMount() {
    this.getCameraPermission();
    console.log('document directory', Expo.FileSystem.documentDirectory);
  }

  async getCameraPermission() {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return
    } else if (finalStatus === 'granted') {
      
    }
  }

  _selectDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    alert("file path: " + result.uri);

    this.setState(
      {
        document: result
      }, () => console.log('document directory', Expo.FileSystem.documentDirectory + 'DocumentPicker/')
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

    alert("file path: ", result.uri);
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
    var bindedThis = this;
    let fileUri = this.state.document.uri;

    console.log("file uri" + fileUri);

    //****this is where the file needs to be converted and push to storage */

    // const blah = Expo.FileSystem.cacheDirectory;
    // const newFile = new File(this.state.document, "textText.txt");
    // const response = await fetch(fileUri);
    // let file = "..."; //use blob or file API

    // var uploadTask = testTextDocRef.put(file);

    //****this is the false push to storage***

    var message = 'This is my message.';
    var uploadTask = testTextDocRef.putString(message);

    uploadTask.on('state_changed', function (snapshot) {
      //onserve state change events such as progress, pause, and resume
    }, function (error) {
      //Handle unsuccessful uploads
    }, function () {
      //handle successful oploads on complete
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        // console.log('File available at', downloadURL),
        bindedThis.setState({ downloadURL }, () => console.log(bindedThis.state))
      });
    })
  }


  _saveToCameraRollAsync = async () => {


    let result = await takeSnapshotAsync(this._container, {
      format: 'png',
      result: 'file',
    });

    let saveResult = await CameraRoll.saveToCameraRoll(result, 'photo');
    this.setState({ cameraRollUri: saveResult }, () => console.log(this.state));

    // const result = await takeSnapshotAsync(this.pageView, {
    //   result: 'file',
    //   height: 1080,
    //   width: 1080,
    //   quality: 1,
    //   format: 'png',
    // });

    // const rslt = await takeSnapshotAsync(this.pageView, {
    //   result: 'file',
    //   height: 1080,
    //   width: 1080,
    //   quality: 1,
    //   format: 'png',
    // }).then(
    //   screenshotURI => console.log("screen shot saved to ", screenshotURI),
    //   error => console.error("oops, snapshot failed", error) 
    // )
    //   return rslt

    // let saveResult = await CameraRoll.saveToCameraRoll(rslt, 'base64');
    // this.setState({ cameraRollUri: saveResult });
  };

  render() {
    let { image } = this.state;
    return (
      <View style={styles.container}>
        <View>
          <Image source={locktonLogo} style={{ marginTop: 30, }} />
        </View>
        <View style={{ marginTop: 50 }}>

          <Button
            title="Select Document"
            onPress={this._selectDocument}
          />

          {this.state.document ? <Text> file name: {this.state.document.name} </Text> : null}
          {this.state.document ? <Text> file size: {this.state.document.size}b </Text> : null}
          {this.state.document ? <Button title="upload" onPress={this._uploadFile} /> : null}

          <View collapsable={false} style={{ width: 150, marginTop: "10%", marginBottom: "10%", alignContent: "center", alignItems: "center" }}
           ref = { view => { this._container = view; }} >
          {this.state.downloadURL ?


            <QRCode
              value={this.state.downloadURL}
              size={140}
              bgColor='black'
              fgColor='white'
            /> : null}

        </View>

        {this.state.downloadURL ? <Button style={{marginTop: 10 }} title="save QR" onPress={this._saveToCameraRollAsync} /> : null}

      </View>
      <View style={{ width: "100%", flex: 1, justifyContent: "flex-end", flexDirection: "row", alignItems: "flex-end" }}>
        <View style={{ flexDirection: "row", alignContent: "flex-end", margin: 2 }}>
          <Text style={{ fontSize: 7, color: "black", margin: 1, alignSelf: "center" }}>Secured by
          </Text>
          <Image source={hercLogo} style={{ margin: 1, resizeMode: "contain", width: 60, height: 60 }} />
        </View>
      </View>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
  },
});


