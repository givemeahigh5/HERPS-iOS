
//TimeInput.js
//
//TimePickerIOS for date selection
//Takes formatted string as input; sends formatted string as output to fieldChanged


'use strict';

var React = require('react-native');
var Button = require('../Button');

var {
    StyleSheet,
    View,
    TouchableHighlight,
    Text,
    DatePickerIOS,
    Component
} = React;


var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: 65,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#222222'
    },
    picker: {
        backgroundColor: '#ffffff'
    }
});



class TimeInput extends Component {
    constructor(props) {
        super(props);

        var defaultValue = this._stringToTime(this.props.defaultValue);

        this.state = {
            time: defaultValue
        };
    }

    value() {
        return this._timeToString(this.state.time);
    }

    render() {
        return (
            <DatePickerIOS
                style={styles.picker}
                date={this.state.time}
                mode='time'
                onDateChange={(time) => this.setState({ time: time })} />
        );
    }

    _stringToTime(str) {
        //imported/found function

        var d = new Date();

        if (str == '' || str == null) return d;

        var time = str.match(/(\d+)(:(\d\d))?\s*(p?)/i);
        if (time == null) return d;

        var hours = parseInt(time[1],10);
        if (hours == 12 && !time[4]) {
              hours = 0;
        }
        else {
            hours += (hours < 12 && time[4])? 12 : 0;
        }

        d.setHours(hours);
        d.setMinutes(parseInt(time[3],10) || 0);
        d.setSeconds(0, 0);

        return d;
    }

    _timeToString(time) {
        return this._hour(time) + ':' + this._minute(time) + ' ' + this._amPm(time)
    }

    _hour(time) {
        var hour = time.getHours();

        if(hour == 0 || hour == 12) {
            return 12;
        }
        else {
            hour = hour % 12;
            return hour < 10 ? '0' + hour : hour;
        }
    }

    _minute(time) {
        var minute = time.getMinutes();
        return minute < 10 ? '0' + minute : minute;
    }

    _amPm(time) {
        var hour = time.getHours();
        return hour < 12 ? 'AM' : 'PM';
    }
}


module.exports = TimeInput;
