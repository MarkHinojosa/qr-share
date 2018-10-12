import React from 'react';
import { ScrollView, StyleSheet, View, Text, Button } from 'react-native';
import { Constants, BarCodeScanner, Permissions, FileSystem } from "expo";
export default class LinksScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasCameraPermission: null,
            url: ""
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

    _handleBarCodeRead = payload => {
        console.log("read QR")
        // const scanResult = payload.data;
        // this.setState(
        //     {
        //         url: scanResult
        //     }, () => this._downloadFromURL()
        // )
        this._downloadFromURL()
    };

    _downloadFromURL = remoteUrl => {
        console.log("running download from url")
        FileSystem.downloadAsync(
            'https://firebasestorage.googleapis.com/v0/b/doc-qr-share.appspot.com/o/documents%2FtestText.txt?alt=media&token=3b2d8653-79f6-4f36-afed-2aa69de2b597',
            FileSystem.documentDirectory + 'thisIsAFolder' + 'testText.txt'
        )
            .then(({ uri }) => {
                console.log('Finished downloading to ', uri);
            })
            .catch(error => {
                console.error(error);
            });
    }

    render() {
        return (
            <View style={styles.container}>
                {/* {this.state.hasCameraPermission === null ? (
                    <Text>Requesting for camera permission</Text>
                ) : this.state.hasCameraPermission === false ? (
                    <Text>Camera permission is not granted</Text>
                ) : (
                            <BarCodeScanner
                                onBarCodeRead={this._handleBarCodeRead}
                                style={{ height: 200, width: 200 }}
                            />
                        )} */}
                <Button
          onPress={() => {
            this._handleBarCodeRead();
          }}
          title="click to simulate scan"
          color="#841584"
          accessibilityLabel="click to simulate scan"
        />
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
