
//TurtleIdInput.js
//
//Component implemntation for turtle id picker


'use strict';

var React = require('react-native');
var TextInputRegular = require('./TextInputRegular');

var {
    StyleSheet,
    View,
    ScrollView,
    Image,
    Component
} = React;


var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    type: {
        fontSize: 20
    },
    textInput: {
        height: 48,
        padding: 12,
        backgroundColor: '#222222',
        borderWidth: 1,
        borderColor: '#222222',
        alignSelf: 'stretch',
        fontSize: 20,
        color: '#dddddd',
        textAlign: 'center'
    },
    scrollView: {
        flex: 1
    },
    imageContainer: {
        flex: 1,
        alignSelf: 'center'
    },
    image: {
        borderTopWidth: 10, //adds whitespace padding for image
        borderColor: '#ffffff'
    }
});



class TurtleIdInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.defaultValue
        };
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
                <TextInputRegular
                    defaultValue={this.state.value}
                    placeholder={this.props.placeholder}
                    onChangeText={(text) => this.onChangeText(text)} />
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.imageContainer}
                    automaticallyAdjustContentInsets={false}>
                    <View style={styles.image}>
                        <Image source={require('image!turtle-id')} />
                    </View>
                </ScrollView>
            </View>
        );
    }
}


module.exports = TurtleIdInput;
