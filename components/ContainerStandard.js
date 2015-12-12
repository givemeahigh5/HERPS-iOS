// ContainerStandard.js
//
// Stores state for form completion
// Stores functions for data retrieval, user authentication, and data submittal
//
// Loaded from Welcome page (by clicking Collect Data)
// Doesn't have its own view, instead instatiates proper form pages


'use strict';

var React = require('react-native');
var ContainerFieldData = require('./ContainerFieldData');
var ContainerFrogCall = require('./ContainerFrogCall');
var ViewPages = require('./ViewPages');
var ViewSubmit = require('./ViewSubmit');

var {
    Component,
    View,
    StyleSheet,
    AlertIOS
} = React;


var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch'
    }
});



class ContainerStandard extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        this._initializeForm(this.props.pages);

        if(this.props.persistentData) {
            var data = this.props.persistentData;

            for(var d in data) {
                if(data.hasOwnProperty(d)) {
                    var pair = {};
                    pair[d] = data[d];
                    this.setState(pair);
                }
            }
        }
    }


    // Private Functions

    _initializeForm(pages) {
        for(var i=0; i < pages.length; i++) {
            var isFieldDataForm = pages[i].pages;   //true if page has pages array
            var isPageList = pages[i].listKey;      //true is page has a listKey string
            var isStandardForm = pages[i].fields;   //true if page has fields array

            if(isFieldDataForm) {
                //set empty state for objects that will be stored as a whole
                this.setState({
                    start: {},
                    records: [],
                    end: {}
                });
            }
            else if(isPageList) {
                //sets 1 state variable; an array with key that matches the page's listKey
                var pair = {};
                pair[pages[i].listKey] = [];
                this.setState(pair);
            }
            else if(isStandardForm) {
                //iterate through fields and set default state for each
                this._initializeFields(pages[i].fields);
            }
            else {
                console.log('Error: Couldn\'t Initialize Form');
            }
        }
    }

    _initializeFields(fields) {
        //loop through fields array
        for(var i=0; i < fields.length; i++) {
            //ignore fields with type 'header'
            if(fields[i].type != 'header') {
                //create key/value pair using field key and blank default value
                var pair = {};
                pair[fields[i].key] = {
                    working: '',
                    store: ''
                };

                //add key/value pair to state
                this.setState(pair);
            }
        }
    }

    _formIsComplete() {
        var pages = this.props.pages;

        if(this._hasSubforms(pages)) {
            //check for field data forms
            return (this.state.start && !this._isEmpty(this.state.start)
                && this.state.records && this.state.records.length
                && this.state.end && !this._isEmpty(this.state.end));
        }
        else {
            //check for standard forms
            for(var i=0; i < pages.length; i++) {
                if(!this.pageIsComplete(pages[i].fields)) {
                    return false;
                }
            }

            return true;
        }
    }

    _submitForm() {
        this.props.navigator.push({
            title: 'Upload Data',
            component: ViewSubmit,
            leftButtonTitle: "Back",
            onLeftButtonPress: () => this.props.navigator.pop(),
            passProps: {
                data: this.state,
                form: this.props.form
            }
        });
    }

    _hasSubforms(pages) {
        //check if there are pages, and if so, if there are pages inside the first page
        return pages.length && pages[0].pages;
    }

    _isEmpty(object) {
        return Object.getOwnPropertyNames(object).length === 0;
    }


    // Event Responders

    fieldChanged(key, value) {
        var valueObject;

        if(typeof value == 'object') {
            valueObject = value;
        }
        else if(typeof value == 'string') {
            valueObject = {
                working: value,
                store: value
            };
        }
        else {
            valueObject = {
                working: '',
                store: ''
            };
        }

        var pair = {};
        pair[key] = valueObject;
        this.setState(pair);
    }

    backPressed() {
        AlertIOS.alert(
            'Exit Form?',
            'If you click OK, data you entered here will be lost.',
            [
                { text: 'Cancel' },
                { text: 'OK', onPress: () => this.props.navigator.pop() }
            ]);
    }

    savePressed() {
        if(this._formIsComplete()) {
            this.props.savePressed(this.state);
        }
        else {
            AlertIOS.alert(
                'Save Incomplete?',
                "It looks like this part of the form isn't complete. Are you sure you want to save it?",
                [
                    { text: 'Cancel' },
                    { text: 'OK', onPress: () => this.props.savePressed(this.state) }
                ]
            );
        }
    }

    submitPressed() {
        if(this._formIsComplete()) {
            this._submitForm();
        }
        else {
            AlertIOS.alert(
                'Submit Incomplete?',
                "It looks like the form isn't complete. Are you sure you want to submit it?",
                [
                    { text: 'Cancel' },
                    { text: 'OK', onPress: () => this._submitForm() }
                ]
            );
        }
    }

    pageIsComplete(fields) {
        //if PageList, only the id of the list is passed up
        if(typeof fields == 'string') {
            return this.state[fields] && this.state[fields].length;
        }
        //otherwise, the array of fields is passed up
        else if(fields) {
            for(var i=0; i < fields.length; i++) {

                var field = fields[i];
                var doCheck = field.type && (field.type != 'header') && field.required;

                if(doCheck && field.key && this.state[field.key] && this.state[field.key].store == '') {
                    //return false immediately if any 1 value hasn't been changed from default
                    return false;
                }
            }
        }

        //return true only if false wasn't already returned
        return true;
    }


    // Render

    render() {
        var component;
        var complete = {};

        //common component props
        var props = {
            navigator: this.props.navigator,
            formData: this.state,
            fieldChanged: this.fieldChanged.bind(this),
            backPressed: this.backPressed,
            pageIsComplete: this.pageIsComplete.bind(this)
        };

        if(this._hasSubforms(this.props.pages)) {
            //additional props for field data forms
            var fieldDataProps = {
                subforms: this.props.pages,
                submitPressed: () => this.submitPressed()
            };

            if(this.props.form == 'Field Data' || this.props.form == 'Aquatic Habitat Data') {
                component = <ContainerFieldData {...props} {...fieldDataProps} />;
            }
            else if(this.props.form == 'Frog Call') {
                component = <ContainerFrogCall {...props} {...fieldDataProps} />;
            }
            else {
                console.log('Error loading form.');
            }
        }
        else {
            component = <ViewPages {...props} pages={this.props.pages} />;
        }

        return (
            <View style={styles.container}>
                {component}
            </View>
        );
    }
}


module.exports = ContainerStandard;
