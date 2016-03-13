//
//ContainerFrogCall.js
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


class ContainerFrogCall extends Component {
    constructor(props) {
        super(props);

        this.state = {
            startComplete: false,
            endComplete: false,
            formRef: null,
            speciesList: []     //persistent form data that carries from subform to subform (stop to stop)
        };
    }

    surveyPressed(subform) {
        //lazy load component to avoid cyclical error
        var ContainerStandard = require('./ContainerStandard');

        var pages = this._getPagesFor(subform);

        //only pass persistent data if loading Add subform
        var persistentData = subform == 'Add' ? { Species: this.state.speciesList } : null;

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
                persistentData: persistentData,
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

            //flush frogs list to only keep names (and not calling index)
            this.setState({ speciesList: this._peristentDataOnly(fields.Species, ['Common Name:', 'Scientific Name:']) });

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

    _peristentDataOnly(speciesList, persistentFields) {
        var newList = [];

        for(var i=0; i < speciesList.length; i++) {
            var species = speciesList[i];
            var newSpecies = {};

            for(var s in species) {
                if(species.hasOwnProperty(s)) {
                    newSpecies[s] = persistentFields.indexOf(s) >= 0 ? species[s] : { working: '', store: '' };
                }
            }
            newList.push(newSpecies);
        }

        return newList;
    }

    render() {
        var records = this.props.formData.records ? this.props.formData.records : [];
        var buttonNames = { start: 'Start Params', add: 'Add Stop', end: 'End Params' };

        return (
            <View style={styles.container}>
                <View>
                    <RecordsFieldData
                        startComplete={this.state.startComplete}
                        endComplete={this.state.endComplete}
                        records={records}
                        buttonNames={buttonNames} />
                    <ButtonsFieldData
                        startComplete={this.state.startComplete}
                        endComplete={this.state.endComplete}
                        surveyPressed={(subform) => this.surveyPressed(subform)}
                        buttonNames={buttonNames} />
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


module.exports = ContainerFrogCall;
