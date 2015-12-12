
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
    TextInput,
    Component
} = React;


var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch'
    },
    buffer: {
        flex: 1
    },
    textInput: {
        height: 200,
        padding: 10,
        fontSize: 18,
        color: '#dddddd',
        backgroundColor: '#444444'
    }
});



class TextInputMulti extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.defaultValue
        };
    }

    componentDidMount() {
        this.input.focus();
    }

    value() {
        return this.state.value;
    }

    onChangeText(value) {
        this.setState({ value: value });
    }

    render() {

        return (
            <View style={styles.container}>
                <TextInput
                    ref ={(r) => this.input = r}
                    style={styles.textInput}
                    multiline={true}
                    defaultValue={this.props.defaultValue}
                    placeholder={this.props.placeholder}
                    placeholderTextColor='#999999'
                    onChangeText={(text) => this.onChangeText(text)}
                    autoFocus={true} />
                <View style={styles.buffer} />
            </View>
        );
    }
}


module.exports = TextInputMulti;
