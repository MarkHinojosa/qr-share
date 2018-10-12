// import React, { Component } from "react";
// import { Text, View, StyleSheet, Alert } from "react-native";
// import { Constants, BarCodeScanner, Permissions } from "expo";
// import { Button } from "react-native";
// import { connect } from "react-redux";
// import { getQRData } from "../actions/AssetActions";

// //to test QR functionality without a camera do the following:
// // * comment out lines 40, and 78 - 87
// // * uncomment lines 42-53, and 88-95

// class QRCapture extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       hasCameraPermission: null
//     };
//   }

//   componentDidMount() {
//     this._requestCameraPermission();
//   }

//   _requestCameraPermission = async () => {
//     const { status } = await Permissions.askAsync(Permissions.CAMERA);
//     this.setState({
//       hasCameraPermission: status === "granted"
//     });
//   };

//   handleQRForward = () => {
//     // let checkForTimestamp = Object.keys(this.state).map((propName, idx) => {
//     //   if(propName === "timestamp"){
//     //     let dTime = transDat.dTime;
//     //     this.setState()
//     //   }
//     // })

//     const passStateToRedux = this.props.getQRData(this.state);

//     const { navigate } = this.props.navigation;
//     navigate("InputMan");
//   };

//   _handleBarCodeRead = data => {
//     const scanResult = data.data;
//     const splitScanResult = scanResult.split(", ");

//     // const splitScanResult = [
//     //   "0.9999 AU",
//     //   "AGLD-0002",
//     //   "072169",
//     //   "timestamp",
//     //   "LBMA",
//     //   "AmagiMetals",
//     //   "A-2",
//     //   "1kg"
//     // ];

//     splitScanResult.map((value, idx) => {
//       let timestamp = new Date().toLocaleString();

//       if (value === "timestamp") {
//         splitScanResult.splice(idx, 1, timestamp);
//       }
//     });

//     this.setState(
//       {
//         CorePropValues: splitScanResult
//       },
//       () => this.handleQRForward()
//     );
//   };

//   render() {
//     return (
//       <View style={styles.container}>
//         {this.state.hasCameraPermission === null ? (
//           <Text>Requesting for camera permission</Text>
//         ) : this.state.hasCameraPermission === false ? (
//           <Text>Camera permission is not granted</Text>
//         ) : (
//           <BarCodeScanner
//             onBarCodeRead={this._handleBarCodeRead}
//             style={{ height: 200, width: 200 }}
//           />
//         )}
//         {/* <Button
//           onPress={() => {
//             this._handleBarCodeRead();
//           }}
//           title="click to simulate scan"
//           color="#841584"
//           accessibilityLabel="click to simulate scan"
//         /> */}
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingTop: Constants.statusBarHeight,
//     backgroundColor: "#ecf0f1"
//   }
// });

// const mapDispatchToProps = dispatch => ({
//   getQRData: data => dispatch(getQRData(data))
// });

// export default connect(
//   null,
//   mapDispatchToProps
// )(QRCapture);



import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { Constants, BarCodeScanner, Permissions } from "expo";
export default class LinksScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasCameraPermission: null
        };
    }
    componentDidMount() {
        this._requestCameraPermission();
    }
    static navigationOptions = {
        title: null,
    };

    _requestCameraPermission = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermission: status === "granted"
        });
    };

    render() {
        return (
            <View style={styles.container}>
                {this.state.hasCameraPermission === null ? (
                    <Text>Requesting for camera permission</Text>
                ) : this.state.hasCameraPermission === false ? (
                    <Text>Camera permission is not granted</Text>
                ) : (
                            <BarCodeScanner
                                onBarCodeRead={this._handleBarCodeRead}
                                style={{ height: 200, width: 200 }}
                            />
                        )}
                {/* <Button
          onPress={() => {
            this._handleBarCodeRead();
          }}
          title="click to simulate scan"
          color="#841584"
          accessibilityLabel="click to simulate scan"
        /> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: '#fff',
        justifyContent: "center",
        alignItems: "center",
    },
});
