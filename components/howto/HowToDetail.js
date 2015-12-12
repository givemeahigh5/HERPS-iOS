'use strict';

var React = require('react-native');
var AquaticTurtle = require('./HowToAquaticTurtle');
var BoxTurtle = require('./HowToBoxTurtle');
var Lizard = require('./HowToLizard');
var Snake = require('./HowToSnake');
var FrogCall = require('./HowToFrogCall');
var AquaticHabitatData = require('./HowToAquaticHabitatData');
var FieldData = require('./HowToFieldData');


var {
    StyleSheet,
    TouchableHighlight,
    View,
    Text,
    ScrollView,
    LinkingIOS,
    Component
} = React;


var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        backgroundColor: '#222222'
    },
    scrollView: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        flex: 1
    },
    title: {
        marginTop: 20,
        marginBottom: 10,
        fontSize: 24,
        textAlign: 'left',
        color: '#e65c5c'
    },
    mainText: {
        fontSize: 18,
        textAlign: 'left',
        color: '#dddddd',
        paddingBottom: 10
    },
    url: {
        color: '#7aceb7',
        fontSize: 18
    }
    });


class About extends Component {
    constructor(props) {
        super(props);
    }

    onURLPress(url) {
        console.log(url);
        LinkingIOS.openURL(url);
    }

    render() {
        var bodyComponent;
        var props = {
            onURLPress: (url) => this.onURLPress(url),
            styles: styles
        };

        switch(this.props.form) {
            case 'Aquatic Turtle': bodyComponent = <AquaticTurtle {...props} />;
            break;
            case 'Box Turtle': bodyComponent = <BoxTurtle {...props} />;
            break;
            case 'Lizard': bodyComponent = <Lizard {...props} />;
            break;
            case 'Snake': bodyComponent = <Snake {...props} />;
            break;
            case 'Frog Call': bodyComponent = <FrogCall {...props} />;
            break;
            case 'Aquatic Habitat Data': bodyComponent = <AquaticHabitatData {...props} />;
            break;
            case 'Field Data': bodyComponent = <FieldData {...props} />;
            break;
            default: return null;
        }

        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollView}>
                    <Text style={styles.title}>{this.props.form}</Text>
                    {bodyComponent}
                </ScrollView>
            </View>
        );
    }
}

module.exports = About;
