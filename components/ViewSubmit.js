//
//ViewSubmit.js
//
//enter credentials and upload to datastore


'use strict';

var React = require('react-native');
var RNFS = require('react-native-fs');
var Button = require('./Button');
var TextInputRegular = require('./input/TextInputRegular');
var DATASTORE = require('../assets/metadata/Datastore.json');

var {
    StyleSheet,
    View,
    TouchableHighlight,
    Text,
    ScrollView,
    LinkingIOS,
    ProgressViewIOS,
    AlertIOS,
    Component
} = React;


var styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 65,
        flexDirection: 'column',
        alignItems: 'stretch',
        backgroundColor: '#222222'
    },
    rowContainer: {
        paddingHorizontal: 30,
        paddingTop: 20,
        paddingBottom: 10
    },
    mainText: {
        fontSize: 24,
        textAlign: 'center',
        color: '#dddddd'
    },
    separator: {
        height: 1,
        backgroundColor: '#222222'
    },
    summary: {
        fontSize: 20,
        textAlign: 'center',
        color: '#e65c5c',
        paddingHorizontal: 10,
        paddingBottom: 5
    }
});

//2 Options:
// 1 - figure out how to format the body without formdata
// 2 - bypass fetch and use a direct xhr request


class ViewSubmit extends Component {
    constructor(props) {
        super(props);

        //this.props.data: array of entity objects

        this.state = {
            postURL: DATASTORE.url,
            postTarget: DATASTORE.postTarget,
            requestTarget: DATASTORE.requestTarget,
            requestRedirect: DATASTORE.requestRedirect,
            name: '',
            email: '',
            isVerifiedUser: false,
            isBadCredentials: false,
            isUploading: false,
            isSuccess: false,
            progress: 0.0,
            images: null,
            imagesLoaded: false
        };
    }

    _goHome() {
        this.props.navigator.popToTop();
    }

    _padNumber(num) {
        if(num < 10 && num >= 0) {
            return "0" + num;
        }
        else {
            return num;
        }
    }

    _padText(text, totalLength) {
        var newText = text;

        while(newText.length < totalLength) {
            newText = newText + ' ';
        }

        return newText;
    }

    _isEmpty(object) {
        return Object.getOwnPropertyNames(object).length === 0;
    }

    _verifyUser() {
        var name = this.state.name;
        var email = this.state.email;
        var regex = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$");

        //confirm that name and email aren't null or formatted incorrectly
        if(!name || !email || !regex.test(email)) {
            this.setState({ isBadCredentials: true });
            return false;
        }

        return true;
    }

    _frogCallStopsToString(list) {

        var value = '';
        var tableSpacing = {};

        if(list.length) {
            //get last element, which contains ALL headers
            var item = list[list.length-1];
            value += 'Stops     ';

            //loop through fields
            for(var field in item) {
                if(item.hasOwnProperty(field)) {
                    //add length to spacing object; used later to align field values properly
                    var fieldWidth = (field == "gps" || field == "Location") ? 28 : Math.max(field.length, 12) + 2;
                    tableSpacing[field] = fieldWidth;

                    //add text and spacing to header row
                    value += this._padText(field, fieldWidth);
                }
            }
        }

        //loop through each stop record
        for(var i=0; i < list.length; i++) {
            var item = list[i];
            value += '\n' + this._padText('Stop ' + parseInt(i+1), 10);

            for(var field in item) {
                if(item.hasOwnProperty(field)) {
                    value += this._padText(item[field], tableSpacing[field]);
                }
            }
        }

        return value;
    }

    _speciesListToString(list) {
        var value = '';

        for(var i=0; i < list.length; i++) {
            var item = list[i];
            value = (value == '') ? '' : value + '\n';

            for(var field in item) {
                if(item.hasOwnProperty(field) && item[field].store != '') {
                    value += field.toLowerCase() + ' ' + item[field].store + '; ';
                }
            }
        }

        return value;
    }

    _fieldName(field, submitRecord) {
        var fieldName = field;
        //var fieldName = field.replace(/ /g, '-');
        var i = 1;

        while(submitRecord.hasOwnProperty(fieldName)) {
            fieldName = field + ' (' + (++i) + ')';
            //fieldName = field.replace(/ /g, '-') + '-(' + (++i) + ')';
        }

        return fieldName;
    }

    _addFieldsToRecord(existing, source) {
        var target = existing;

        for(var field in source) {
            if(source.hasOwnProperty(field)) {
                if(field == 'salamanders' || field == 'Frogs' || field == 'Macroinvertebrates') {
                    target['List of ' + field + ':'] = this._speciesListToString(source[field]);
                }
                else {
                    var fieldName = this._fieldName(field, target);
                    target[fieldName] = source[field].store ? source[field].store : '';
                }
            }
        }

        return target;
    }

    //converts form data into a json record for uploading; standard forms always return an array of 1 record
    _recordsFromStandard(data) {
        var submitData = [];

        var submitRecord = this._addFieldsToRecord({}, data);

        if(!this._isEmpty(submitRecord)) {
            submitData.push(submitRecord);
        }

        return submitData;
    }

    //converts form data into a json record for uploading; returns as many records as there are items in the 'records' array of the data
    _recordsFromFieldData(data) {
        var start = data.start;
        var records = data.records;
        var end = data.end;

        var submitData = [];

        if(records) {
            for(var i=0; i < records.length; i++) {
                var submitRecord = {};

                if(start) {
                    submitRecord = this._addFieldsToRecord(submitRecord, start);
                }

                submitRecord = this._addFieldsToRecord(submitRecord, records[i]);

                if(end) {
                    submitRecord = this._addFieldsToRecord(submitRecord, end);
                }

                if(!this._isEmpty(submitRecord)) {
                    submitData.push(submitRecord);
                }
            }
        }

        return submitData;
    }

    //converts form data into a json record for uploading; always returns an array of 1 record, with stops converting into a single string record
    _recordsFromFrogCall(data) {
        var start = data.start;
        var records = data.records;
        var end = data.end;

        var submitData = [];
        var submitRecord = {};

        if(start) {
            //add start params to record
            submitRecord = this._addFieldsToRecord(submitRecord, start);
        }

        if(records) {
            //parse list of stops into single field table with each species as a column
            var stops = [];
            var stopHeaders = [];
            var sounds = [];

            for(var i=0; i < records.length; i++) {

                var record = records[i];
                var stop = {};

                //this for loop converts
                for(var field in record) {
                    if(record.hasOwnProperty(field)) {
                        if(field == 'Species' && record['Species'].constructor === Array) {
                            for(var j=0; j < record['Species'].length; j++) {
                                var r = record['Species'][j];
                                if(r.hasOwnProperty('Common Name:') && r.hasOwnProperty('Scientific Name:') && r.hasOwnProperty('Calling Index:')) {
                                    var name = '[' + r['Common Name:'].store + ' (' + r['Scientific Name:'].store + ')]';
                                    stop[name] = r['Calling Index:'].store;
                                }
                            }
                        }
                        else if(field == 'Recording') {
                            //add recording to array and skip til after stops before adding to record
                            sounds.push(record[field]);
                        }
                        else {
                            stop[field] = record[field].store ? record[field].store : '';
                        }
                    }
                }

                stops.push(stop);
            }

            submitRecord['Stops'] = this._frogCallStopsToString(stops);

            //create a column for each recording and populate it from the sounds array
            for(var i=0; i < sounds.length; i++) {
                var fieldName = this._fieldName("Recording:", submitRecord);
                submitRecord[fieldName] = sounds[i].store ? sounds[i].store : '';
            }
        }

        if(end) {
            //add end params to record
            submitRecord = this._addFieldsToRecord(submitRecord, end);
        }

        if(!this._isEmpty(submitRecord)) {
            submitData.push(submitRecord);
        }

        return submitData;
    }

    _fileURIs(record, fileType) {
        var imageURIs = [];

        for(var field in record) {
            if(record.hasOwnProperty(field)) {
                var value = record[field];

                if(value.indexOf(fileType) >= 0) {
                    imageURIs.push(value);
                }
            }
        }

        return imageURIs;
    }

    _updateProgress(addition) {
        var currentProgress = Number(parseFloat(this.state.progress).toFixed(4));
        var totalRecords = parseFloat(this.state.records);

        var progress = Number(((currentProgress * totalRecords + addition) / totalRecords).toFixed(4));
        return progress;
    }

    _doPostFiles(data) {
        this.setState({ progress: this._updateProgress(.25)});

        //set formdata for initial url request
        var requestData = new FormData();
        requestData.append('target', this.state.requestRedirect);

        //post to server
        return fetch(this.state.postURL + this.state.requestTarget, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data; boundary=---------------------------7da24f2e50046'
            },
            body: requestData
        })
        .then((response) => {
            //if response contains a valid blobstore upload url, post the formdata to that url
            if(response._bodyText != null && response._bodyText != 'fail') {
                return fetch(response._bodyText, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data; boundary=---------------------------7da24f2e50046'
                    },
                    body: data
                });
            }
            else {
                //console.log('something went wrong');
                this.setState({ isUploading: false });
                return;
            }
        })
        .then((response) => {
            //this should be json data
            if(response._bodyText != 'fail') {
                this.setState({ progress: this._updateProgress(.25)});

                return response;
            }
            else {
                this.setState({ isUploading: false });
            }
        })
        .catch((err) => {
            this.setState({ isUploading: false });
            //console.log(err);
        });

    }

    _doPost(data) {
        this.setState({ progress: this._updateProgress(.25)});

        return fetch(this.state.postURL + this.state.postTarget, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data; boundary=---------------------------7da24f2e50046'
            },
            body: data
        })
        .then((response) => {
            //update the component state and progress bar
            if(response._bodyText == 'success') {
                this.setState({ progress: this._updateProgress(.25)});
            }
            else {
                this.setState({ isUploading: false });
            }

            return;
        })
        .catch((err) => {
            this.setState({ isUploading: false });
            //console.log(err);
        });
    }

    _formatData(form, rawData) {
        var formattedData = [];

        switch(form) {
            case 'Field Data':
            case 'Aquatic Habitat Data':
                formattedData = this._recordsFromFieldData(rawData);
                break;
            case 'Frog Call':
                formattedData = this._recordsFromFrogCall(rawData);
                break;
            default:
                formattedData = this._recordsFromStandard(rawData);
        }

        return formattedData;
    }

    _uploadRecord(form, record) {

        var fileData = new FormData();

        var imageURIs = this._fileURIs(record, '.jpg');
        for(var i=0; i < imageURIs.length; i++) {
            fileData.append(imageURIs[i], {uri: imageURIs[i], name: imageURIs[i], type: 'image/jpg'});
        }

        var soundURIs = this._fileURIs(record, '.caf');
        for(var i=0; i < soundURIs.length; i++) {
            fileData.append(soundURIs[i], {uri: soundURIs[i], name: soundURIs[i], type: 'audio/aiff'});
        }

        this._doPostFiles(fileData)
        .then((response) => {
            var fileKeys = response.status == 200 ? JSON.parse(response._bodyText) : {};

            var data = new FormData();

            //set category and user for entity
            data.append('form', form);
            data.append('Uploader Email', this.state.email);
            data.append('Uploader Name', this.state.name);

            //loop through records; append each as key/value pair (files use path as value)
            for(var key in record) {
                if(record[key].contains('.jpg') || record[key].contains('.caf')) {
                    data.append(key, "BlobKey:" + fileKeys[record[key]]);
                }
                else {
                    data.append(key, record[key]);
                }
            }

            return this._doPost(data);
        })
        .then((response) => {
            var isSuccess = (this.state.progress >= .99);

            this.setState({
                isUploading: !isSuccess,
                isSuccess: isSuccess
            });
        });
    }

    _uploadForm(form, rawData) {
        if(this._verifyUser()) {
            //get formatted data records
            var formattedData = this._formatData(form, rawData);

            //update state to show progress on screen
            this.setState({
                isVerifiedUser: true,
                isUploading: true,
                progress: 0,
                records: formattedData.length
            });

            //loop through each and upload with separate posts
            for(var i=0; i < formattedData.length; i ++) {
                this._uploadRecord(form, formattedData[i]);
            }

            //remaining updates are handled elsewhere
        }
    }

    _cancelUpload() {
        //interrupt somehow -- what about partial data??
        this.setState({ isUploading: false });
    }

    _flushFiles() {
        //delete .jpgs and .cafs
        RNFS.readDir(RNFS.DocumentDirectoryPath)
        .then((result) => {
            for(var i=0; i < result.length; i++) {
                if((result[i].name).indexOf('.caf') >= 0 || (result[i].name).indexOf('.jpg') >= 0) {
                    RNFS.unlink(result[i].path);
                }
            }
        });
    }


    // Render Functions

    renderCredentials() {
        var errorMessage = this.state.isBadCredentials ? 'Name and valid email required' : ' ';

        return (
            <View>
                <Text style={styles.summary}>{errorMessage}</Text>
                <TextInputRegular
                    defaultValue={this.state.name}
                    placeholder='Name'
                    onChangeText={(text) => this.setState({ name: text })} />
                <View style={styles.separator} />
                <TextInputRegular
                    defaultValue={this.state.email}
                    placeholder='Email'
                    onChangeText={(text) => this.setState({ email: text })}
                    keyboardType='email-address'
                    autoCapitalize='none' />
                <View style={styles.separator} />
                <Button view='high' text='Upload' onPress={() => this._uploadForm(this.props.form, this.props.data)} />
            </View>
        );
    }

    renderUploadStatus() {
        return (
            <View>
                <Button view='low' text='Cancel Upload' onPress={() => this._cancelUpload()} />
            </View>
        );
    }

    renderFailed() {
        return (
            <View style={styles.rowContainer}>
                <Button view='low' text='Try Again' onPress={() => this._uploadForm(this.props.form, this.props.data)} />
            </View>
        );
    }

    renderComplete() {
        var plural = this.state.records > 1 ? 's' : '';

        return (
            <View>
                <View style={styles.rowContainer}>
                    <Text style={styles.summary}>{this.state.records} Record{plural} Added</Text>
                    <Text style={styles.summary}>to '{this.props.form}'</Text>
                </View>
                <Button view='low' text='Return to Home Screen' onPress={() => this._goHome()} />
            </View>
        );
    }

    _renderProgressBar() {
        var color;

        if(this.state.isSuccess || this.state.isUploading) {
            color = '#8bc740';
        }
        else if(!this.state.isVerifiedUser) {
            color = '#000000';
        }
        else {
            color = '#e65c5c';
        }

        return (
            <View>
                <ProgressViewIOS
                    progressViewStyle='bar'
                    progressTintColor={color}
                    trackTintColor='#444444'
                    progress={this.state.progress} />
            </View>
        );
    }

    render() {
        var statusText, component, progressBar;

        if(this.state.isSuccess) {
            //form has completed uploading (all records)
            this._flushFiles();
            statusText = 'Upload Complete';
            component = this.renderComplete();
        }
        else if(this.state.isUploading) {
            //actively uploading
            statusText = 'Uploading...';
            component = this.renderUploadStatus();
        }
        else if(!this.state.isVerifiedUser) {
            //pre-upload; credentials still needed and upload yet to be initiated by user
            statusText = 'Enter Credentials';
            component = this.renderCredentials();
        }
        else {
            //user is verified, but it's not uploading and not complete; implication is failure
            statusText = 'Upload Failed';
            component = this.renderFailed();
        }

        var progressBar = this._renderProgressBar();


        return (
            <View style={styles.container}>
                {progressBar}
                <View style={styles.rowContainer}>
                    <Text style={styles.mainText}>{statusText}</Text>
                </View>
                {component}
            </View>
        );
    }
}


module.exports = ViewSubmit;
