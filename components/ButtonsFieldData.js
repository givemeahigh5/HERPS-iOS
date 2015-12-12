//
//ButtonsFieldData.js
//
//group of 3 buttons for start/add data/end in a field data/frog call form


'use strict';

var React = require('react-native');
var Button = require('./Button');
//CollectDataFormContainer lazy loaded in Pressed functions to avoid cyclical component conflict

var {
    StyleSheet,
    View,
    ScrollView,
    TouchableHighlight,
    ListView,
    Text,
    Component
} = React;


var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    separator: {
        height: 1,
        backgroundColor: '#444444'
    },
    separatorHigh: {
        height: 1
    }
});



class ButtonsFieldData extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        var buttons, startText, addText, endText;
        var buttonNames = this.props.buttonNames;

        startText = buttonNames && buttonNames.start ? buttonNames.start : 'Start Survey';
        addText = buttonNames && buttonNames.add ? buttonNames.add : 'Add Data';
        endText = buttonNames && buttonNames.end ? buttonNames.end : 'End Survey';

        if(!this.props.startComplete) {
            buttons = (
                <View>
                    <Button view='high' text={startText} onPress={() => this.props.surveyPressed('Start')} />
                    <Button view='low' text={addText} />
                    <View style={styles.separator} />
                    <Button view='low' text={endText} />
                    <View style={styles.separator} />
                </View>
            );
        }
        else if(!this.props.endComplete) {
            buttons = (
                <View>
                    <View style={styles.separator} />
                    <Button view='low' text={startText} />
                    <Button view='high' text={addText} onPress={() => this.props.surveyPressed('Add')} />
                    <View style={styles.separatorHigh} />
                    <Button view='high' text={endText} onPress={() => this.props.surveyPressed('End')} />
                </View>
            );
        }
        else {
            buttons = (
                <View>
                    <View style={styles.separator} />
                    <Button view='low' text={startText} />
                    <View style={styles.separator} />
                    <Button view='low' text={addText} />
                    <View style={styles.separator} />
                    <Button view='low' text={endText} />
                    <View style={styles.separator} />
                </View>
            );
        }


        return (
            <View style={styles.container}>
                {buttons}
            </View>
        );
    }
}


module.exports = ButtonsFieldData;
