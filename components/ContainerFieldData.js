//
//ContainerFieldData.js
//
//


'use strict';

var React = require('react-native');
var ButtonsFieldData = require('./ButtonsFieldData');
var RecordsFieldData = require('./RecordsFieldData');
//ContainerStandard lazy loaded in Pressed functions to avoid cyclical component conflict

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
        flexDirection: 'column',
        paddingTop: 64,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#222222'
    }
});


class ContainerFieldData extends Component {
    constructor(props) {
        super(props);

        this.state = {
            startComplete: false,
            endComplete: false,
            formRef: null
        };
    }

    surveyPressed(subform) {
        var ContainerStandard = require('./ContainerStandard');
        var pages = this._getPagesFor(subform);

        this.props.navigator.push({
            title: subform,
            component: ContainerStandard,
            leftButtonTitle: 'Cancel',
            onLeftButtonPress: () => {this.state.formRef && this.state.formRef.backPressed()},
            rightButtonTitle: 'Save',
            onRightButtonPress: () => {this.state.formRef && this.state.formRef.savePressed()},
            passProps: {
                pages: pages,
                savePressed: (fields) => this.savePressed(fields, subform),
                ref: this.onContainerRef.bind(this)
            }
        });
    }

    savePressed(fields, subform) {
        if(subform == 'Add') {
            var records = this.props.formData.records ? this.props.formData.records : [];
            var newRecords = [];

            for(var i=0; i < records.length; i++) {
                newRecords.push(records[i]);
            }

            newRecords.push(fields);
            this.props.fieldChanged('records', newRecords);
        }
        else {
            if(subform == 'Start') {
                this.setState({ startComplete: true });
                this.props.fieldChanged('start', fields);
            }
            else if(subform == 'End') {
                this.setState({ endComplete: true });
                this.props.fieldChanged('end', fields);
            }
            else {
                //console.log('Error: Subform not found; nothing saved.');
            }
        }

        this.props.navigator.pop();
    }

    onContainerRef(callbackRef) {
        this.setState({formRef: callbackRef});
    }

    render() {
        var records = this.props.formData.records ? this.props.formData.records : [];

        return (
            <View style={styles.container}>
                <View>
                    <RecordsFieldData
                        startComplete={this.state.startComplete}
                        endComplete={this.state.endComplete}
                        records={records} />
                    <ButtonsFieldData
                        startComplete={this.state.startComplete}
                        endComplete={this.state.endComplete}
                        surveyPressed={(subform) => this.surveyPressed(subform)} />
                </View>
            </View>
        );
    }

    _getPagesFor(name) {
        var subforms = this.props.subforms;

        for(var i=0; i < subforms.length; i++) {
            if(subforms[i].name == name) {
                return subforms[i].pages;
            }
        }

        return [{name: 'Error: Nothing Loaded'}];
    }
}


module.exports = ContainerFieldData;
