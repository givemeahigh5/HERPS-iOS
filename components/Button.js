
//ButtonHigh.js
//
//Button component that includes styling, to keep color formatting consistent and easy across app

'use strict';

var React = require('react-native');

var {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Component
} = React;

var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    text: {
        fontSize: 20,
        color: '#ffffff',
        alignSelf: 'center'
    },
    high: {
        height: 60,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#8bc740',
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    low: {
        height: 60,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#222222',
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    mid: {
        height: 60,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#777777',
        alignSelf: 'stretch',
        justifyContent: 'center'
    }
});


class Button extends Component {
    constructor(props) {
        super(props);
    }

    underlayColor(view) {
        return view == 'high' ? '#7cb930' : '#444444';
    }

    // Render

    render() {
        var view = this.props.view;

        return (
            <View style={styles.container}>
                <TouchableHighlight
                    style={styles[view]}
                    underlayColor={this.underlayColor(view)}
                    onPress={this.props.onPress}>
                    <Text style={styles.text}>{this.props.text}</Text>
                </TouchableHighlight>
            </View>
        );
    }
}

module.exports = Button;
