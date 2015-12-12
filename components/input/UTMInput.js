
//UTMInput.js
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
        flexDirection: 'row',
        paddingBottom: 20
    },
    textInput: {
        height: 36,
        flex: 5,
        padding: 10,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#dddddd',
        alignSelf: 'stretch',
        fontSize: 20,
        color: '#dddddd',
        textAlign: 'center'
    },
    field: {
        flex: 3,
        height: 36,
        color: '#dddddd',
        fontSize: 18,
        paddingVertical: 7
    }
});



class UTMInput extends Component {
    constructor(props) {
        super(props);

        if(this.props.defaultValue != '') {
            var fields = this._stringToFields(this.props.defaultValue);

            this.state = {
                easting: fields.easting,
                northing: fields.northing,
                zone: fields.zone
            }
        }
        else {
            this.state = {
                easting: '',
                northing: '',
                zone: ''
            }
        }
    }

    value() {
        return this._fieldsToString();
    }

    onSetLocationPressed() {
        navigator.geolocation.getCurrentPosition(
            (position) => this._setUTMCoordinates(position),
            (error) => console.log(error)
        );
    }

    _setUTMCoordinates(position) {
        if(position.coords) {
            var utm = GPSToUTM(position.coords.latitude, position.coords.longitude);

            this.setState({
                easting: utm.easting,
                northing: utm.northing,
                zone: utm.zone
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
                        <Text style={styles.field}>Easting: </Text>
                        <TextInput style={styles.textInput} defaultValue={this.state.easting} editable={false} />
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.field}>Northing: </Text>
                        <TextInput style={styles.textInput} defaultValue={this.state.northing} editable={false} />
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.field}>Zone: </Text>
                        <TextInput style={styles.textInput} defaultValue={this.state.zone} editable={false} />
                    </View>

                    <Button view='low' text='Set Location' onPress={() => this.onSetLocationPressed()} />

                </View>
            </View>
        );
    }

    //used to convert string (passed down from form) to display fields; includes both measurements in 1 string
    _stringToFields(string) {
        var fields = {
            easting: '',
            northing: '',
            zone: '',
        };

        var s = string.replace('Easting: ', '').replace('Northing: ', '').replace('Zone: ', '');
        var sArray = s.split(' ');

        if(sArray.length == 3) {
            fields.easting = sArray[0];
            fields.northing = sArray[1];
            fields.zone = sArray[2];
        }

        return fields;
    }

    //used to convert display field values to string for passing up to form state; includes both measurements
    _fieldsToString() {
        if(!this._isEmptyLocation()) {
            return (
                'Easting: ' + this.state.easting
                + ' Northing: ' + this.state.northing
                + ' Zone: ' + this.state.zone
            );
        }
        else {
            return '';
        }
    }

    _isEmptyLocation() {
        if(this.state.latDeg == '') { return true; }
        else if(this.state.easting == '') { return true; }
        else if(this.state.northing == '') { return true; }
        else if(this.state.zone == '') { return true; }
        else { return false; }
    }
}


module.exports = UTMInput;




//Auxiliary functions for converting GPS to UTM

var PI = 3.14159265358979;
var SM_A = 6378137.0;
var SM_B = 6356752.314;
var UTMScaleFactor = 0.9996;

var GPSToUTM = function(lat, lon) {
    var zone = UTMZone(lon);                            //get utm zone from gps lat/lon degrees

    var meridian = UTMCentralMeridian(zone);            //calculate central meridian from zone

    var latRad = degToRad(lat);                         //convert lat/lon to radians
    var lonRad = degToRad(lon);

    var pairXY = GPSToXY(latRad, lonRad, meridian);     //calculate xy pair from lat/lon radians and utm central meridian

    return scaleUTM(pairXY.x, pairXY.y, zone);         //scale x/y to utm; return object with {easting, northing, zone}
};

// the heavy math lifting; converts lat/lon pair to transverse x/y pair
var GPSToXY = function(phi, lambda, lambda0) {
    //xy pair return value
    var pairXY = {
        x: 0,
        y: 0
    };

    //Precalculations
    var ep2 = (Math.pow (SM_A, 2.0) - Math.pow (SM_B, 2.0)) / Math.pow (SM_B, 2.0);
    var nu2 = ep2 * Math.pow (Math.cos (phi), 2.0);
    var N = Math.pow (SM_A, 2.0) / (SM_B * Math.sqrt (1 + nu2));
    var t = Math.tan (phi);
    var t2 = t * t;
    var tmp = (t2 * t2 * t2) - Math.pow (t, 6.0);
    var l = lambda - lambda0;

    //Precalculate coefficients for l**n (l**1, l**2 are 1.0)
    var l3coef = 1.0 - t2 + nu2;
    var l4coef = 5.0 - t2 + 9 * nu2 + 4.0 * (nu2 * nu2);
    var l5coef = 5.0 - 18.0 * t2 + (t2 * t2) + 14.0 * nu2 - 58.0 * t2 * nu2;
    var l6coef = 61.0 - 58.0 * t2 + (t2 * t2) + 270.0 * nu2 - 330.0 * t2 * nu2;
    var l7coef = 61.0 - 479.0 * t2 + 179.0 * (t2 * t2) - (t2 * t2 * t2);
    var l8coef = 1385.0 - 3111.0 * t2 + 543.0 * (t2 * t2) - (t2 * t2 * t2);

    //Calculate easting (x)
    pairXY.x = N * Math.cos (phi) * l
        + (N / 6.0 * Math.pow (Math.cos (phi), 3.0) * l3coef * Math.pow (l, 3.0))
        + (N / 120.0 * Math.pow (Math.cos (phi), 5.0) * l5coef * Math.pow (l, 5.0))
        + (N / 5040.0 * Math.pow (Math.cos (phi), 7.0) * l7coef * Math.pow (l, 7.0));

    //Calculate northing (y)
    pairXY.y = arcLengthOfMeridian(phi)
        + (t / 2.0 * N * Math.pow (Math.cos (phi), 2.0) * Math.pow (l, 2.0))
        + (t / 24.0 * N * Math.pow (Math.cos (phi), 4.0) * l4coef * Math.pow (l, 4.0))
        + (t / 720.0 * N * Math.pow (Math.cos (phi), 6.0) * l6coef * Math.pow (l, 6.0))
        + (t / 40320.0 * N * Math.pow (Math.cos (phi), 8.0) * l8coef * Math.pow (l, 8.0));

    return pairXY;
};

var scaleUTM = function(x, y, zone) {

    var xUTM = x * UTMScaleFactor + 500000.0;
    var yUTM = (y * UTMScaleFactor) + (y < 0 ? 10000000.0 : 0);
    //var yUTM = y * UTMScaleFactor;
    //yUTM = (yUTM < 0) ? yUTM + 10000000.0 : yUTM;
    return {
        easting: (Math.round(xUTM * 100) / 100).toString(),
        northing: (Math.round(yUTM * 100) / 100).toString(),
        zone: (Math.round(zone * 100) / 100).toString()
    };
};

var UTMZone = function(lon) {
    return (Math.floor ((lon + 180.0) / 6) + 1);
};

var UTMCentralMeridian = function(zone) {
    return degToRad(-183.0 + (zone * 6.0));
};


var arcLengthOfMeridian = function(phi)
{
    //Precalculations
    var n = (SM_A - SM_B) / (SM_A + SM_B);
    var alpha = ((SM_A + SM_B) / 2.0) * (1.0 + (Math.pow (n, 2.0) / 4.0) + (Math.pow (n, 4.0) / 64.0));
    var beta = (-3.0 * n / 2.0) + (9.0 * Math.pow (n, 3.0) / 16.0) + (-3.0 * Math.pow (n, 5.0) / 32.0);
    var gamma = (15.0 * Math.pow (n, 2.0) / 16.0) + (-15.0 * Math.pow (n, 4.0) / 32.0);
    var delta = (-35.0 * Math.pow (n, 3.0) / 48.0) + (105.0 * Math.pow (n, 5.0) / 256.0);
    var epsilon = (315.0 * Math.pow (n, 4.0) / 512.0);

    //Calculate the sum of the series
    var result = alpha
        * (phi + (beta * Math.sin (2.0 * phi))
            + (gamma * Math.sin (4.0 * phi))
            + (delta * Math.sin (6.0 * phi))
            + (epsilon * Math.sin (8.0 * phi)));

    return result;
};

var degToRad = function(deg) {
    return (deg / 180.0 * PI);
};
