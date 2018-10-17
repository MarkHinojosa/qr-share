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
  PixelRatio
} from 'react-native';
import { WebBrowser } from 'expo';
import { DocumentPicker, ImagePicker, takeSnapshotAsync } from 'expo';
import firebase from 'firebase';
import Firebase from '../constants/Firebase';
import locktonLogo from '../assets/images/locktonLogo.png';
import hercLogo from '../assets/images/hercLogo.png';
import QRCode from 'react-native-qrcode';
import { __await } from 'tslib';

console.disableYellowBox = true;

export default class HomeScreen extends React.Component {

  static navigationOptions = {
    header: null,
  };

  state = {
    hasCameraRollPermission: null,
    image: null,
    document: null,
    downloadURL: null,
    wallet: 10,
    cost: null,
    docSizekb: null
  };



  async componentDidMount() {
    // await Permissions.askAsync(Permissions.CAMERA_ROLL);
    // await Permissions.askAsync(Permissions.CAMERA);
  }

  _requestCameraRollPermission = async () => {

    const { Permissions } = Expo;
    const { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL);

    // const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({
      hasCameraRollPermission: status === "granted"
    });
  };

  _selectDocument = async () => {
    console.log('cache directory', Expo.FileSystem)
    let result = await DocumentPicker.getDocumentAsync({
      // copyToCacheDirectory: true
    });
    alert("file path: " + result.uri);

    this.setState(
      {
        document: result
      }, () => this._setDetails()
    )

    let fileUri = result.uri;

    let contents = Expo.FileSystem.readAsStringAsync(fileUri).then(res =>
      this._contents(res)
    );
  }

  _contents = (cont) => {
    this.setState({ contents: cont });
  }

  _setDetails = () => {
    if (this.state.document) {
      let docSizeBytes = this.state.document.size;
      let docSizeKilobytes = docSizeBytes * .001;
      let docSizeKB2Decimals = docSizeKilobytes.toFixed(2);
      this.setState({ docSizekb: docSizeKB2Decimals });
      let calculatedCost = (docSizeKB2Decimals * .001) / .4;
      let calculatedCost2Fixed = calculatedCost.toFixed(7);
      this.setState({ cost: calculatedCost2Fixed })
    }
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

  _executeUpload = async () => {
    let blah = this.state.document.uri;
    uploadURL = await this._uploadFile(blah);
    // this.setState({ downloadURL: uploadURL }, () => console.log("state", this.state))
  }

  _uploadFile = async (uri) => {

    console.log("in upload file", uri)

    const doc = this.state.document;
    let docName = doc.name;
    let filename = this.state.document.name;
    let storageRef = firebase.storage().ref();
    let testTextRef = storageRef.child(docName);
    let testTextDocRef = storageRef.child('documents/' + docName);
    var bindedThis = this;

    //****this is where the file needs to be converted and push to storage */


    const response = await fetch(uri);
    const blob = await response.blob();
    const snapshot = await testTextDocRef.put(blob).then(snapshot => {
      return snapshot.ref.getDownloadURL();
    }).then(downloadURL => {
      // console.log(`Successfully uploaded file and got download link` + downloadURL);
      bindedThis.setState({ downloadURL }, () => console.log("returning line 140", bindedThis.state))
      // return downloadURL;
    }).catch(error => {
      // Use to signal error if something goes wrong.
      console.log(`Failed to upload file and get link - ${error}`);
    });


    // const newFile = new File([this.state.contents], docName);

    // var uploadTask = testTextDocRef.put(newFile);

    //****this is the false push to storage***
    // var message = 'This is my message.';
    // var uploadTask = testTextDocRef.putString(message);

    // snapshot.on('state_changed', function (snapshot) {
    //   //onserve state change events such as progress, pause, and resume
    // }, function (error) {
    //   //Handle unsuccessful uploads
    // }, function () {
    //   //handle successful oploads on complete
    //   uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
    //     bindedThis.setState({ downloadURL }, () => bindedThis._updateWallet())
    //   })
    // })
    // console.log(snapshot.downloadURL);
    // return snapshot.downloadURL, console.log("returning upload file", snapshot)

  }

  _updateWallet = () => {
    let currentWallet = this.state.wallet;
    let currentPrice = this.state.cost;
    let newWallet = currentWallet - currentPrice;
    this.setState({ wallet: newWallet })
  }

  _saveToCameraRollAsync = async () => {
    const targetPixelCount = 1080; // If you want full HD pictures
    const pixelRatio = PixelRatio.get(); // The pixel ratio of the device
    // pixels * pixelratio = targetPixelCount, so pixels = targetPixelCount / pixelRatio
    const pixels = targetPixelCount / pixelRatio;
    const result = await takeSnapshotAsync(this._container, {
      result: 'file',
      height: 120,
      width: 120,
      quality: 1,
      format: 'jpg',
    });

    let saveResult = await CameraRoll.saveToCameraRoll(result, 'photo');
    this.setState({ cameraRollUri: saveResult }, alert("saved to " + saveResult));
  };

  render() {
    let { image } = this.state;

    return (
      <View
        style={styles.container}
      >
        <View>
          <Image source={locktonLogo} style={{ marginTop: 50, }} />
        </View>
        <View style={{ marginTop: "10%", alignContent: "center", alignItems: "center" }}>

          <Button
            title="Select Document"
            onPress={this._selectDocument}
          />
          <View style={{ marginBottom: 5, alignContent: "center", maxWidth: "70%" }}>
            {this.state.document ? <Text style={{flexWrap:'wrap'}}> file name: {this.state.document.name} </Text> : null}
            {this.state.document ? <Text> file size: {this.state.docSizekb} kB </Text> : null}
            {this.state.cost ? <Text> upload cost: {this.state.cost} Hercs </Text> : null}
            {this.state.document ? <Button title="upload" onPress={this._executeUpload} /> : null}
          </View>

          <View style={{ marginTop: "5%", alignContent: "center", alignItems: "center" }}>
            <View style={{ padding: 10, flexDirection: "column", justifyContent: "center", alignContent: "center", alignItems: "center" }} collapsable={false} ref={view => {
              this._container = view;
            }}>
              {this.state.downloadURL ?
                <QRCode
                  value={this.state.downloadURL}
                  size={150}
                  bgColor='black'
                  fgColor='white'
                /> : null}

              {/* {this.state.downloadURL ? <Text style={{ color: "white" }}> {this.state.document.name} </Text> : null} */}
            </View>

            {this.state.downloadURL ? <Button title="Save QR" onPress={this._saveToCameraRollAsync} /> : null}

          </View>
        </View>
        <View style={{ width: "100%", flex: 1, justifyContent: "space-between", flexDirection: "row", alignItems: "flex-end" }}>
          <View style={{ flexDirection: "row", alignContent: "flex-end", margin: 2 }}>
            <Text style={{ fontSize: 12, color: "black", margin: 1, marginBottom: "10%", alignSelf: "center" }}>Wallet: {this.state.wallet} Hercs
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignContent: "flex-end", margin: 2 }}>
            <Text style={{ fontSize: 7, color: "black", margin: 1, alignSelf: "center" }}>Secured by
          </Text>
            <Image source={hercLogo} style={{ margin: 1, resizeMode: "contain", width: 60, height: 60 }} />
          </View>
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
  },
});