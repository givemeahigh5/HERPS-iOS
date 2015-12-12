//
//Welcome.js
//
//home page for app


'use strict';

var React = require('react-native');
var ViewForms = require('./ViewForms');
var About = require('./About');
var HowTo = require('./HowTo');
var Button = require('./Button');

var {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Image,
    ScrollView,
    Component
} = React;


var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        paddingTop: 64,
        backgroundColor: '#222222'
    },
    topContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    bottomContainer: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    scrollView: {
        paddingTop: 20,
        flex: 1
    },
    image: {
        padding: 30,
        alignSelf: 'center',
        backgroundColor: '#ffffff',
        borderColor: '#ffffff',
        borderWidth: 1,
        borderRadius: 15
    },
    infoContainer: {
        flexDirection: 'row'
    },
    separator: {
        height: 1,
        backgroundColor: '#444444'
    }
});


class Welcome extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    // Event Responders

    buttonPressed(title, component) {
        this.props.navigator.push({
            title: title,
            component: component,
            leftButtonTitle: 'Home',
            onLeftButtonPress: this.backPressed.bind(this)
        });
    }

    backPressed() {
        this.props.navigator.pop();
    }

    // Render

        render() {

            return (
                <View style={styles.container}>
                    <View style={styles.topContainer}>
                        <View style={styles.image}>
                            <Image source={require('image!herp-logo')} />
                        </View>
                    </View>
                    <View style={styles.bottomContainer}>
                        <View>
                            <Button view='high' text='Collect Data' onPress={() => this.buttonPressed('Forms', ViewForms)} />
                            <Button view='low' text='About' onPress={() => this.buttonPressed('About', About)} />
                            <View style={styles.separator} />
                            <Button view='low' text='How To' onPress={() =>this.buttonPressed('How To', HowTo)} />
                        </View>
                    </View>
                </View>
            );
        }
    }

    module.exports = Welcome;
