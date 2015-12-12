
//TurtleIdInputMap.js
//
//Component implemntation for turtle id picker


'use strict';

var React = require('react-native');
var Button = require('../Button');

var {
    StyleSheet,
    View,
    TouchableHighlight,
    Text,
    TextInput,
    Component
} = React;


var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        backgroundColor: '#222222'
    },
    coordinatesContainer: {
        padding: 20
    },
    rowContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    fieldContainer: {
        flex: 3,
        flexDirection: 'row',
        padding: 5
    },
    fieldContainer2: {
        flex: 2,
        padding: 5
    },
    symbol: {
        color: '#dddddd'
    },
    textInput: {
        height: 36,
        flex: 1,
        padding: 10,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#dddddd',
        alignSelf: 'stretch',
        fontSize: 18,
        color: '#dddddd',
        textAlign: 'center'
    }
});



class GPSInput extends Component {
    constructor(props) {
        super(props);


        if(this.props.defaultValue != '') {
            var fields = this._stringToFields(this.props.defaultValue);

            this.state = {
                latDeg: fields.latDeg,
                latMin: fields.latMin,
                latSec: fields.latSec,
                latDir: fields.latDir,
                lonDeg: fields.lonDeg,
                lonMin: fields.lonMin,
                lonSec: fields.lonSec,
                lonDir: fields.lonDir
            }
        }
        else {
            this.state = {
                latDeg: '', latMin: '', latSec: '', latDir: '',
                lonDeg: '', lonMin: '', lonSec: '', lonDir: ''
            }
        }
    }

    value() {
        return this._fieldsToString();
    }

    onSetLocationPressed() {
        navigator.geolocation.getCurrentPosition(
            //(position) => console.log(position),
            (position) => this._setGPSCoordinates(position),
            (error) => console.log(error)
        );
    }

    _setGPSCoordinates(position) {
        if(position.coords) {
            var latFields = this._decimalToFields(position.coords.latitude, {pos: 'N', neg: 'S'});
            var lonFields = this._decimalToFields(position.coords.longitude, {pos: 'E', neg: 'W'});

            this.setState({
                latDeg: latFields.degrees,
                latMin: latFields.minutes,
                latSec: latFields.seconds,
                latDir: latFields.direction,
                lonDeg: lonFields.degrees,
                lonMin: lonFields.minutes,
                lonSec: lonFields.seconds,
                lonDir: lonFields.direction
            });
        }
        else {
            AlertIOS.alert(
                'Location Not Found!',
                'An error occured and your location couldn\'t be set. Check that you are able to send and receive data.');
        }
    }

    render() {

        return (
            <View style={styles.container}>
                <View style={styles.coordinatesContainer}>

                    <View style={styles.rowContainer}>
                        <View style={styles.fieldContainer}>
                            <TextInput style={styles.textInput} defaultValue={this.state.latDeg} editable={false} />
                            <Text style={styles.symbol}>&deg;</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <TextInput style={styles.textInput} defaultValue={this.state.latMin} editable={false} />
                            <Text style={styles.symbol}>&#39;</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <TextInput style={styles.textInput} defaultValue={this.state.latSec} editable={false} />
                            <Text style={styles.symbol}>&quot;</Text>
                        </View>
                        <View style={styles.fieldContainer2}>
                            <TextInput style={styles.textInput} defaultValue={this.state.latDir} editable={false} />
                        </View>
                    </View>

                    <View style={styles.rowContainer}>
                        <View style={styles.fieldContainer}>
                            <TextInput style={styles.textInput} defaultValue={this.state.lonDeg} editable={false} />
                            <Text style={styles.symbol}>&deg;</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <TextInput style={styles.textInput} defaultValue={this.state.lonMin} editable={false} />
                            <Text style={styles.symbol}>&#39;</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <TextInput style={styles.textInput} defaultValue={this.state.lonSec} editable={false} />
                            <Text style={styles.symbol}>&quot;</Text>
                        </View>
                        <View style={styles.fieldContainer2}>
                            <TextInput style={styles.textInput} defaultValue={this.state.lonDir} editable={false} />
                        </View>
                    </View>
                    <Button view='low' text='Set Location' onPress={() => this.onSetLocationPressed()} />

                </View>
            </View>
        );
    }

    //used to convert string (passed down from form) to display fields; includes both measurements in 1 string
    _stringToFields(string) {
        var fields = {
            latDeg: '', latMin: '', latSec: '', latDir: '',
            lonDeg: '', lonMin: '', lonSec: '', lonDir: ''
        };
        var s = string.replace(' ', '');

        var signIndex = s.search('°');
        if(signIndex) {
            fields.latDeg = s.slice(0, signIndex);
            s = s.slice(signIndex + 1);

            signIndex = s.search('\'');
            if(signIndex) {
                fields.latMin = s.slice(0, signIndex);
                s = s.slice(signIndex + 1);

                signIndex = s.search('\"');
                if(signIndex) {
                    fields.latSec = s.slice(0, signIndex);
                    s = s.slice(signIndex + 1);

                    if(s.length) {
                        fields.latDir = s.slice(0, 1);
                        s = s.slice(1);

                        signIndex = s.search('°');
                        if(signIndex) {
                            fields.lonDeg = s.slice(0, signIndex);
                            s = s.slice(signIndex + 1);

                            signIndex = s.search('\'');
                            if(signIndex) {
                                fields.lonMin = s.slice(0, signIndex);
                                s = s.slice(signIndex + 1);

                                signIndex = s.search('\"');
                                if(signIndex) {
                                    fields.lonSec = s.slice(0, signIndex);
                                    s = s.slice(signIndex + 1);

                                    if(s.length) {
                                        fields.lonDir = s.slice(0, 1);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return fields;
    }

    //used to convert decimal (obtained from location/relocation by native module) to display fields; only includes 1 measurement
    _decimalToFields(decimal, directions) {
        var fields = {};

        fields.direction = decimal < 0 ? directions.neg : directions.pos;
        var remainder = Math.abs(decimal);

        fields.degrees = Math.floor(remainder).toString();
        remainder = (remainder - Math.floor(remainder)) * 60;

        fields.minutes = Math.floor(remainder).toString();
        remainder = (remainder - Math.floor(remainder)) * 60;

        fields.seconds = Math.round(remainder).toString();

        return fields;
    }

    //used to convert display field values to string for passing up to form state; includes both measurements
    _fieldsToString() {
        if(!this._isEmptyLocation()) {
            return (
                this.state.latDeg + '°'
                + this.state.latMin + '\''
                + this.state.latSec + '\"'
                + this.state.latDir + ' '
                + this.state.lonDeg + '°'
                + this.state.lonMin + '\''
                + this.state.lonSec + '\"'
                + this.state.lonDir
            );
        }
        else {
            return '';
        }
    }

    _isEmptyLocation() {
        if(this.state.latDeg == '') { return true; }
        else if(this.state.latMin == '') { return true; }
        else if(this.state.latSec == '') { return true; }
        else if(this.state.latDir == '') { return true; }
        else if(this.state.lonDeg == '') { return true; }
        else if(this.state.lonMin == '') { return true; }
        else if(this.state.lonSec == '') { return true; }
        else if(this.state.lonDir == '') { return true; }
        else { return false; }
    }
}


module.exports = GPSInput;
