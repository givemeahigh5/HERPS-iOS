
//DateInputDetail.js
//
//DatePickerIOS for date selection
//Takes formatted string as input; sends formatted string as output to fieldChanged


'use strict';

var React = require('react-native');
var Button = require('../Button');

var {
    StyleSheet,
    View,
    ScrollView,
    TouchableHighlight,
    Text,
    DatePickerIOS,
    Component
} = React;


var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: 64,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#222222'
    },
    picker: {
        backgroundColor: '#ffffff'
    }
});



class DateInput extends Component {
    constructor(props) {
        super(props);

        var defaultValue = this.props.defaultValue
            ? new Date(this.props.defaultValue)
            : new Date();

        this.state = {
            date: defaultValue
        };
    }

    value() {
        return this._dateString(this.state.date);
    }

    dependentValue() {
        return {
            key: 'Day of Week:',
            value: this._weekday(this.state.date)
        };
    }

    render() {
        return (
            <DatePickerIOS
                style={styles.picker}
                date={this.state.date}
                mode='date'
                onDateChange={(date) => this.setState({ date: date })} />
        );
    }

    _dateString(date) {
        return this._day(date) + ' ' + this._month(date) + ' ' + this._year(date);
    }

    _day(date) {
        var day = date.getDate();
        return day < 10 ? '0' + day : day;
    }

    _month(date) {
        var month = date.getMonth();
        return MONTHS[month];
    }

    _year(date) {
        return date.getFullYear();
    }

    _weekday(date) {
        var day = date.getDay();

        if(day < DAYS.length) {
            return DAYS[day];
        }
        else {
            return '';
        }
    }
}


module.exports = DateInput;



var MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];

var DAYS = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];
