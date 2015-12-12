//
//ViewField.js
//
//


'use strict';

var React = require('react-native');
var ClickableInput = require('./input/ClickableInput');
var ModalInput = require('./input/ModalInput');

var BasicInput = require('./input/BasicInput');
var SelectInput = require('./input/SelectInput');
var TextInputMulti = require('./input/TextInputMulti');
var DateInput = require('./input/DateInput');
var TimeInput = require('./input/TimeInput');
var CommonNameInput = require('./input/CommonNameInput');
var ScientificNameInput = require('./input/ScientificNameInput');
var TurtleIdInput = require('./input/TurtleIdInput');
var MeasureInput = require('./input/MeasureInput');
var TemperatureInput = require('./input/TemperatureInput');
var SoundInput = require('./input/SoundInput');
var GPSInput = require('./input/GPSInput');
var UTMInput = require('./input/UTMInput');

var INPUTOPTIONS = require('../assets/metadata/InputOptions.json');
var MEASUREOPTIONS = require('../assets/metadata/MeasureOptions.json');
var SPECIESOPTIONS = require('../assets/metadata/SpeciesOptions.json');


var {
    StyleSheet,
    View,
    TouchableHighlight,
    ListView,
    TextInput,
    Text,
    Modal,
    Component,
    NativeModules: { UIImagePickerManager }
} = React;


//styles passed to each input as props
var styles = StyleSheet.create({
    headerContainer: {
        padding: 10,
        backgroundColor: '#000000'
    },
    header: {
        flex: 1,
        alignSelf: 'stretch',
        fontSize: 16,
        color: '#dddddd'
    },
    rowContainer: {
        padding: 16,
        flexDirection: 'row',
        backgroundColor: '#222222'
    },
    rowContainerEmbedded: {
        flexDirection: 'row',
        backgroundColor: '#222222'
    },
    textContainer: {
        flex: 7,
        paddingLeft: 10
    },
    textInput: {
        height: 42,
        flex: 1,
        flexDirection: 'row',
        borderColor: '#222222',
        alignSelf: 'stretch',
        fontSize: 16,
        color: '#dddddd'
    },
    iconContainer: {
        paddingVertical: 6,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    icon: {
        justifyContent: 'center'
    },
    separator: {
        height: 1,
        backgroundColor: '#dddddd'
    }
});



class ViewField extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.defaultValue,
            isEditing: false
        }
    }

    componentWillReceiveProps(nextProps) {
        //updates state when the value has been changed by another field (i.e. this is a dependent field)
        this.setState({ value: nextProps.defaultValue });
    }

    okPressed() {
        var value = this.input.value();
        var workingValue;

        if(typeof value === 'object') {
            workingValue = value.working ? value.working : 'Error';
        }
        else {
            workingValue = value;
        }

        if(this.props.field.hasDependent) {
            var pair = this.input.dependentValue();

            if(pair.key && pair.value) {
                this.props.fieldChanged(pair.key, pair.value);
            }
            //dependent value is ignored if not found
        }

        this.props.fieldChanged(this.props.field.key, value);

        this.setState({
            value: workingValue,
            isEditing: false
        });
    }

    cancelPressed() {
        this.setState({
            isEditing: false
        });
    }

    _speciesOptions(options, conditional) {
        //return the options themselves if the field isn't conditional on the organism type
        if(options != 'conditional') {
            return options;
        }
        //return conditional options if conditional is set
        else if(conditional) {
            return conditional;
        }
        //return other (blank array) if other or nothing is selected
        else {
            return 'other';
        }
    }

    _addImage() {
        var options = {
            title: 'Select Photo',
            maxWidth: 1024,
            maxHeight: 1024,
            quality: 0.3,
            storageOptions: { skipBackup: true }
        };

        UIImagePickerManager.showImagePicker(options, (didCancel, response) => {
            if(!didCancel) {
                //store uri; get image data when uploading
                this.setState({ value: response.uri});
                this.props.fieldChanged(this.props.field.key, response.uri);
            }
        });
    }

    _inputComponent(field) {
        //Common props applied to each field component; additional props are appended when returning the component
        var props = {
            styles: styles,
            placeholder: 'Enter Value',
            defaultValue: this.state.value,
            ref: (r) => this.input = r          // needed to extract value from component via value() method
        };

        var inputComponent;

        switch(field.type) {
            case 'select':          return <SelectInput {...props} options={INPUTOPTIONS[field.options]}/>;
            break;
            case 'date':            return <DateInput {...props} />;
            break;
            case 'time':            return <TimeInput {...props} />;
            break;
            case 'measure':         return <MeasureInput {...props} unit={MEASUREOPTIONS[field.options].unit} />;
            break;
            case 'temperature':     return <TemperatureInput {...props} unit={MEASUREOPTIONS.temperature.unit} />;
            break;
            case 'turtleId':        return <TurtleIdInput {...props} />;
            break;
            case 'gps':             return <GPSInput {...props} />;
            break;
            case 'utm':             return <UTMInput {...props} />;
            break;
            //case 'image':         return <ImageInput {...props} />;     NOT REQUIRED; image is called via plugin modal directly
            //break;
            case 'sound':           return <SoundInput {...props} />;
            break;
            case 'textMulti':       return <TextInputMulti {...props} />;
            break;
            case 'commonName':      return <CommonNameInput {...props} options={SPECIESOPTIONS[this._speciesOptions(field.options, this.props.conditional)]} />;
            break;
            case 'scientificName':  return <ScientificNameInput {...props} options={SPECIESOPTIONS[this._speciesOptions(field.options, this.props.conditional)]} />;
            break;
            case 'text':
            default:                return <BasicInput {...props} />;
            //unknown or missing types will return a basic text entry field
        }
    }

    _inputIcon(field) {
        switch(field.type) {
            case 'select':      return require('image!field-select');
            break;
            case 'date':        return require('image!field-date');
            break;
            case 'time':        return require('image!field-time');
            break;
            case 'measure':     return require('image!field-measure');
            break;
            case 'temperature': return require('image!field-temp');
            break;
            case 'turtleId':    return require('image!field-turtle');
            break;
            case 'gps':         return require('image!field-gps');
            break;
            case 'utm':         return require('image!field-gps');
            break;
            //case 'image':       return require('image!field-image');
            //break;
            case 'sound':       return require('image!field-sound');
            break;
            case 'textMulti':   return require('image!field-multi');
            break;
            case 'commonName':
            case 'scientificName':
            case 'text':
            default:            return require('image!field-text');
        }
    }

    render() {
        var field = this.props.field;
        var icon = this._inputIcon(field);

        if(field.type == 'header') {
            //return <HeaderInput text={field.placeholder} />;
            return (
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>
                        {field.placeholder}
                    </Text>
                </View>
            );
        }
        else if(field.type == 'image') {
            //There is no separate ImageInput component, since this plugin requires a modal and can't be called inside
            // the normal modal that pops up for editing. It only requires _addImage() and the module declaration at the top.
            return (
                <ClickableInput
                    value={this.state.value}
                    placeholder={field.placeholder}
                    isEmbedded={this.props.isEmbedded}
                    icon={require('image!field-image')}
                    onPressed={() => this._addImage()}
                    styles={styles} />
            );
        }

        var inputComponent = this._inputComponent(field);

        return (
            <View>
                <ClickableInput
                    value={this.state.value}
                    placeholder={field.placeholder}
                    icon={icon}
                    isEmbedded={this.props.isEmbedded}
                    onPressed={() => this.setState({ isEditing: true })}
                    styles={styles} />
                <ModalInput
                    name={field.placeholder}
                    isEditing={this.state.isEditing}
                    styles={styles}
                    onCancelPressed={() => this.cancelPressed()}
                    onOKPressed={() => this.okPressed()}>
                    {inputComponent}
                </ModalInput>
            </View>
        );
    }
}


module.exports = ViewField;
