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
import { DocumentPicker, ImagePicker, takeSnapshotAsync } from 'expo';
import firebase from 'firebase';
import Firebase from '../constants/Firebase';
import locktonLogo from '../assets/images/locktonLogo.png';
import hercLogo from '../assets/images/hercLogo.png';
import QRCode from 'react-native-qrcode';

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
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.CAMERA);
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
      console.log("making it here")
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

  _uploadFile = () => {
    const doc = this.state.document;
    let docName = doc.name;
    let filename = this.state.document.name;
    let storageRef = firebase.storage().ref();
    let testTextRef = storageRef.child(docName);
    let testTextDocRef = storageRef.child('documents/' + docName);
    var bindedThis = this;

    //****this is where the file needs to be converted and push to storage */

    const newFile = new File([this.state.contents], "testText.txt");

    var uploadTask = testTextDocRef.put(newFile);

    //****this is the false push to storage***
    // var message = 'This is my message.';
    // var uploadTask = testTextDocRef.putString(message);

    uploadTask.on('state_changed', function (snapshot) {
      //onserve state change events such as progress, pause, and resume
    }, function (error) {
      //Handle unsuccessful uploads
    }, function () {
      //handle successful oploads on complete
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        bindedThis.setState({ downloadURL }, () => bindedThis._updateWallet())
      })
    })
  }

  _updateWallet = () => {
    let currentWallet = this.state.wallet;
    let currentPrice = this.state.cost;
    let newWallet = currentWallet - currentPrice;
    this.setState({ wallet: newWallet })


  }

  _saveToCameraRollAsync = async () => {

    let result = await takeSnapshotAsync(this._container, {
      format: 'png',
      result: 'file',
    });

    let saveResult = await CameraRoll.saveToCameraRoll(result, 'photo');
    this.setState({ cameraRollUri: saveResult });

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
      <View
        style={styles.container}
      >

        {this.state.hasCameraRollPermission === null ? (
          <Text>Requesting for camera permission</Text>
        ) : this.state.hasCameraPermission === false ? (
          <Text>Camera permission is not granted</Text>
        ) : (
              <Text>line 186</Text>
            )}
        <View>
          <Image source={locktonLogo} style={{ marginTop: 50, }} />
        </View>
        <View style={{ marginTop: 50, alignContent: "center", alignItems: "center" }}>

          <Button
            title="Select Document"
            onPress={this._selectDocument}
          />
          <View style={{ marginBottom: 5 }}>
            {this.state.document ? <Text> file name: {this.state.document.name} </Text> : null}
            {this.state.document ? <Text> file size: {this.state.docSizekb} kB </Text> : null}
            {this.state.cost ? <Text> upload cost: {this.state.cost} Hercs </Text> : null}
            {this.state.document ? <Button title="upload" onPress={this._uploadFile} /> : null}
          </View>

          <View style={{ width: 150, marginTop: "5%", alignContent: "center", alignItems: "center" }}>
            <View style={{ flexDirection: "column", justifyContent: "center", alignContent: "center", alignItems: "center" }} collapsable={false} ref={view => {
              this._container = view;
            }}>
              {this.state.downloadURL ?
                <QRCode
                  value={this.state.downloadURL}
                  size={140}
                  bgColor='black'
                  fgColor='white'
                /> : null}

              {this.state.downloadURL ? <Text style={{ color: "white" }}> {this.state.document.name} </Text> : null}
            </View>

            {this.state.downloadURL ? <Button title="Save QR" onPress={this._saveToCameraRollAsync} /> : null}

          </View>
        </View>
        <View style={{ width: "100%", flex: 1, justifyContent: "space-between", flexDirection: "row", alignItems: "flex-end" }}>

          <View style={{ flexDirection: "row", alignContent: "flex-end", margin: 2 }}>
            <Text style={{ fontSize: 12, color: "black", margin: 1, marginBottom: 20, alignSelf: "center" }}>Wallet: {this.state.wallet} Hercs
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
    // justifyContent: 'center',
  },
});