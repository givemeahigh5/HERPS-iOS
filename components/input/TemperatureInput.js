
//TemperatureInput.js
//
//Component implementation for sequencer that cycles text when clicked
//Contains a Text wrapped in a TouchableHighlight
//In this app, it's used to toggle between Celsius and Fahrenheit when clicked


'use strict';

var React = require('react-native');
var TemperatureInputSequencer = require('./TemperatureInputSequencer');
var TextInputRegular = require('./TextInputRegular');

var {
    StyleSheet,
    View,
    Text,
    Component
} = React;


var styles = StyleSheet.create({
    container: {
        //flex: 1,
        flexDirection: 'row'
    },
    inputContainer: {
        flex: 1
    },
    unitContainer: {
        borderLeftWidth: 1,
        borderColor: '#222222'
    }
});


class TemperatureInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this._valuePart(this.props.defaultValue),
            unit: this._unitPart(this.props.defaultValue)
        };
    }

    value() {
        if(this.state.value) {
            return {
                working: this.state.value + ' ' + this.state.unit,
                store: this.state.value + ' ' + this.state.unit.slice(1)
            };
        }
        else {
            return '';
        }
    }

    _unitPart(value) {
        if(value) {
            var valueArray = value.split(' ');
            return valueArray.length == 2 ? valueArray[1] : '?';
        }
        else {
            return this.props.unit[0];
        }
    }

    _valuePart(value) {
        if(value) {
            var valueArray = value.split(' ');
            return valueArray.length == 2 ? valueArray[0] : '?';
        }
        else {
            return '';
        }
    }

    onChangeText(value) {
        this.setState({ value: value });
    }

    onChangeUnit(unit) {
        this.setState({ unit: unit });
    }


    render() {
        var unit = this.props.unit;

        return (
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <TextInputRegular
                        defaultValue={this.state.value}
                        placeholder={this.props.placeholder}
                        onChangeText={(text) => this.onChangeText(text)}
                        keyboardType='numeric' />
                </View>
                <View style={styles.unitContainer}>
                    <TemperatureInputSequencer
                        options={this.props.unit}
                        value={this.state.unit}
                        onChangeUnit={(unit) => this.onChangeUnit(unit)} />
                </View>
            </View>
        )
    }
}


module.exports = TemperatureInput;
