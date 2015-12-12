
//TextSequencer.js
//
//Component implementation for sequencer that cycles text when clicked
//Contains a Text wrapped in a TouchableHighlight
//In this app, it's used to toggle between Celsius and Fahrenheit when clicked


'use strict';

var React = require('react-native');
var Button = require('../Button');

var {
    StyleSheet,
    View,
    TouchableHighlight,
    Text,
    Modal,
    Component
} = React;


var styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        paddingTop: 32
    },
    innerContainer: {
        flex: 1,
        backgroundColor: '#222222'
    },
    buttonContainer: {
        flexDirection: 'row'
    },
    separator: {
        height: 1,
        backgroundColor: '#444444'
    },
    fieldName: {
        flex: 1,
        padding: 10,
        fontSize: 18,
        fontWeight: '600',
        color: '#dddddd',
        textAlign: 'center'
    }
});



class ModalInput extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var propStyles = this.props.styles;

        return (
            <View>
                <Modal animated={true} transparent={true} visible={this.props.isEditing}>
                    <View style={styles.outerContainer}>
                        <View style={styles.innerContainer}>
                            <View style={styles.buttonContainer}>
                                <Button view='low' text='Cancel' onPress={() => this.props.onCancelPressed()} />
                                <Button view='high' text='OK' onPress={() => this.props.onOKPressed()} />
                            </View>
                            <View style={styles.separator}/>
                            <View style={styles.buttonContainer}>
                                <Text style={styles.fieldName}>{this.props.name}</Text>
                            </View>
                            <View style={styles.separator}/>
                            {this.props.children}
                        </View>
                    </View>

                </Modal>
            </View>
        );
    }
}


module.exports = ModalInput;
