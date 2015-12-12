
//TextInputRegular.js
//
//
//


'use strict';

var React = require('react-native');

var {
    StyleSheet,
    View,
    TextInput,
    Component
} = React;

var styles = StyleSheet.create({
    textInput: {
        height: 60,
        flex: 1,
        alignSelf: 'stretch',
        fontSize: 18,
        paddingHorizontal: 10,
        color: '#dddddd',
        backgroundColor: '#444444'
    },
    separator: {
        height: 1,
        backgroundColor: '#444444',
    }
});


class TextInputRegular extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.input.focus();
    }

    render() {
        return (
            <View>
                <TextInput
                    ref ={(r) => this.input = r}
                    style={styles.textInput}
                    editable={this.props.editable}
                    defaultValue={this.props.defaultValue}
                    placeholder={this.props.placeholder}
                    placeholderTextColor='#bbbbbb'
                    autoCorrect={false}
                    autoCapitalize={this.props.autoCapitalize}
                    keyboardType={this.props.keyboardType}
                    onChangeText={(text) => this.props.onChangeText(text)} />
            </View>
        );
    }
}


module.exports = TextInputRegular;
