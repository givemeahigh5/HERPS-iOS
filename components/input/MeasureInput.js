
//TextSequencer.js
//
//Component implementation for sequencer that cycles text when clicked
//Contains a Text wrapped in a TouchableHighlight
//In this app, it's used to toggle between Celsius and Fahrenheit when clicked


'use strict';

var React = require('react-native');
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
    },
    unit: {
        height: 60,
        fontSize: 18,
        paddingHorizontal: 20,
        paddingTop: 18,
        backgroundColor: '#444444',
        color: '#dddddd'
    }
});


class MeasureInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this._valuePart(this.props.defaultValue)
        };
    }

    value() {
        if(this.state.value) {
            return {
                working: this.state.value + ' ' + this.props.unit,
                store: this.state.value
            };
        }
        else {
            return '';
        }

        return this.state.value;
    }

    blur() {
        this.input.blur();
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

    renderUnit(unit) {
        if(unit) {
            return (
                <View style={styles.unitContainer}>
                    <Text style={styles.unit}>{unit}</Text>
                </View>
            );
        }
        else {
            return;
        }
    }

    render() {
        var unit = this.renderUnit(this.props.unit);

        return (
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <TextInputRegular
                        ref={(r) => this.input = r}
                        defaultValue={this.state.value}
                        placeholder={this.props.placeholder}
                        onChangeText={(text) => this.onChangeText(text)}
                        keyboardType='numeric' />
                </View>
                {unit}
            </View>
        )
    }
}


module.exports = MeasureInput;
