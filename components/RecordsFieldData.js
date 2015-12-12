//
//RecordsFieldData.js
//
//


'use strict';

var React = require('react-native');
//ViewPage lazy loaded in Pressed functions to avoid cyclical component conflict

var {
    StyleSheet,
    View,
    Text,
    Component
} = React;


var styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 50,
        paddingHorizontal: 10,
        alignItems: 'center'
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        color: '#dddddd'
    }
});




class RecordsFieldData extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    backPressed() {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.props.pages)
        }, function() {
            this.props.navigator.pop();
        });
    }

    rowPressed(page) {
        var pages = this._getPagesFor(page);

        this.props.navigator.push({
            title: page,
            component: ViewPage,
            leftButtonTitle: "Back",
            onLeftButtonPress: () => this.backPressed(),
            passProps: {
                fields: fields,
                formData: this.props.formData,
                fieldChanged: this.props.fieldChanged
            }
        });
    }

    render() {
        var text;
        var startText, addText, endText;
        var buttonNames = this.props.buttonNames;

        startText = buttonNames && buttonNames.start ? buttonNames.start : 'Start Survey';
        addText = buttonNames && buttonNames.add ? buttonNames.add : 'Add Data';
        endText = buttonNames && buttonNames.end ? buttonNames.end : 'End Survey';

        if(this.props.endComplete) {
            text = 'Press \'Submit\' to Complete the Survey';
        }
        else if(this.props.startComplete) {
            text = 'Records Added: ' + (this.props.records ? this.props.records.length : 0) + '\n\nPress \'' + addText + '\' or \'' + endText + '\'';
        }
        else {
            text = 'Press \'' + startText + '\' to Begin';
        }

        return (
            <View style={styles.container}>
                <Text style={styles.text}>
                    {text}
                </Text>
            </View>
        );
    }

    _getPagesFor(name) {
        var subform = this.props.subform;

        for(var i=0; i < subforms.length; i++) {
            if(subforms[i].name == name) {
                return subforms[i].pages;
            }
        }

        return [{name: 'Error: Nothing Loaded'}];
    }
}


module.exports = RecordsFieldData;
