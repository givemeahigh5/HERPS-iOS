
//SoundInputDetail.js
//
//Record a frogcall and save its path as a field value
//Automatically increments new files to 'frogcall_#'
//Sounds are saves in .caf
//


'use strict';

var React = require('react-native');
var RNFS = require('react-native-fs');
var Button = require('../Button');
var {AudioRecorder, AudioPlayer} = require('react-native-audio');

var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Component
} = React;


var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: 64,
        justifyContent: 'space-between',
        alignItems: 'stretch',
        backgroundColor: '#222222'
    },
    progressText: {
        padding: 15,
        fontSize: 24,
        color: '#dddddd',
        alignSelf: 'center'
    }
});



class SoundInput extends Component {

    constructor(props) {
        super(props);

        this.state = {
            file: this.props.defaultValue,
            newFilename: this.props.defaultValue,
            currentTime: 0.00,
            recording: false,
            playing: false,
            finished: false
        };
    }

    componentDidMount() {
        if(!this.state.file) {
            //sets filename, only if no file exists and has been passed down
            this._setFilename();
        }

        AudioRecorder.onProgress = (data) => this.setState({currentTime: Math.floor(data.currentTime * 100)/100});
        AudioRecorder.onFinished = (data) => this.setState({finished: data.finished});
    }

    value() {
        return {
            working: this.state.file,
            store: RNFS.DocumentDirectoryPath + this.state.file
        };
    }

    _setFilename() {
        //get all files in app document directory
        RNFS.readDir(RNFS.DocumentDirectoryPath)
        .then((result) => {
            var num = 1;

            //search from end for 'frogcall_' file with highest number; set num to highest + 1
            for(var i=result.length-1; i >= 0; i--) {
                if((result[i].name).indexOf('frogcall_') >= 0) {
                    num = 1 + parseInt(result[i].name.slice(9, result[i].name.indexOf('.')));
                    break;
                }
            }

            //set filename for next (this) recording
            var filename = '/frogcall_' + num + '.caf';
            this.setState({ newFilename: filename });
            AudioRecorder.prepareRecordingAtPath(filename);
        });
    }

    _renderButton(title) {
        var onPress;

        switch(title) {
            case 'Play':    onPress = () => this._play();
            break;
            case 'Stop':    onPress = () => this._stop();
            break;
            case 'Pause':   onPress = () => this._pause();
            break;
            case 'Record':  onPress = () => this._record();
            break;
            default:
        }

        return (
            <View>
                <Button view='high' text={title} onPress={onPress} />
            </View>
        );
    }

    _deleteRecording() {
        if(this.state.playing) {
            AudioRecorder.stopPlaying();
            this.setState({
                playing: false
            });
        }

        //ask are you sure?
        this.setState({
            file: '',
            currentTime: 0.0
        });
    }

    _pause() {
        if(this.state.recording) {
            AudioRecorder.pauseRecording();
        }
        else if(this.state.playing) {
            AudioRecorder.pausePlaying();
        }
    }

    _stop() {
        if(this.state.recording) {
            AudioRecorder.stopRecording();
            this.setState({
                file: this.state.newFilename,
                recording: false
            });
        }
        else if(this.state.playing) {
            AudioRecorder.stopPlaying();
            this.setState({
                playing: false
            });
        }
    }

    _record() {
        AudioRecorder.startRecording();
        this.setState({
            recording: true
        });
    }

    _play() {
        AudioRecorder.playRecording();
        this.setState({
            playing: true
        });
    }


    render() {
        var activityButton, deleteButton;

        if(this.state.file) {
            deleteButton = <Button view='low' text='Delete and Try Again' onPress={() => this._deleteRecording()} />;

            if(this.state.playing && !this.state.finished) {
                activityButton = this._renderButton('Stop');
            }
            else {
                activityButton = this._renderButton('Play');
            }
        }
        else {
            deleteButton = <Button view='low' text='' />;

            if(this.state.recording) {
                activityButton = this._renderButton('Stop');
            }
            else {
                activityButton = this._renderButton('Record');
            }
        }


        return (
            <View style={styles.container}>
                <View>
                    <Text style={styles.progressText}>{this.state.currentTime}</Text>
                    {activityButton}
                    {deleteButton}
                </View>
            </View>
        );

        //
    }
}

module.exports = SoundInput;
