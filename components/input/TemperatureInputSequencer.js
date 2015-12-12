
//TextSequencer.js
//
//Component implementation for sequencer that cycles text when clicked
//Contains a Text wrapped in a TouchableHighlight
//In this app, it's used to toggle between Celsius and Fahrenheit when clicked


'use strict';

var React = require('react-native');

var {
    StyleSheet,
    View,
    TouchableHighlight,
    Text,
    Component
} = React;


var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    text: {
        height: 60,
        width: 60,
        fontSize: 18,
        //paddingHorizontal: 20,
        textAlign: 'center',
        paddingTop: 18,
        backgroundColor: '#444444',
        color: '#dddddd'
    }
});


class TextSequencer extends Component {
    constructor(props) {
        super(props);
    }

    onPress() {
        var list = this.props.options;
        var len = list.length;
        var value = this.props.value;

        if(len) {
            for(var i=0; i < len; i++) {
                if(list[i] == value) {
                    var newI = (len == (i + 1)) ? 0 : i + 1;
                    this.props.onChangeUnit(list[newI]);
                    break;
                }
            }
        }
    }

    render() {
        return (
            <TouchableHighlight
                style={styles.container}
                underlayColor='#444444'
                onPress={() => this.onPress()}>
                <Text style={styles.text}>{this.props.value}</Text>
            </TouchableHighlight>
        )
    }
}


module.exports = TextSequencer;
