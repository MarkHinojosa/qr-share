import React from 'react';
import { ScrollView, StyleSheet, View, Text, Button } from 'react-native';
import { Constants, BarCodeScanner, Permissions, FileSystem, WebBrowser } from "expo";


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
            'http://techslides.com/demos/sample-videos/small.mp4',
            FileSystem.documentDirectory + 'sample-video/' + 'small.mp4'
        )
            .then(({ uri }) => {
                // let direct = FileSystem.documentDirectory + 'sample-video/';
                // console.log('Finished downloading to ', uri);
                Expo.FileSystem.getInfoAsync(uri, contents)
            })
            .catch(error => {
                console.error(error);
            });

        // WebBrowser.openBrowserAsync('gs://doc-qr-share.appspot.com/documents/testText.txt')
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
