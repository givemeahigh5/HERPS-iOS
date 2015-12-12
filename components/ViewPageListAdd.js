
//ViewPageListAdd.js
//
//
//



'use strict';

var React = require('react-native');
var ViewPage = require('./ViewPage');
var Button = require('./Button');

var {
    StyleSheet,
    View,
    Component
} = React;


var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch'
    },
    rowContainer: {
        flex: 0,
        flexDirection: 'row'
    },
    separator: {
        height: 1,
        backgroundColor: '#444444'
    }
});


class ViewPageListAdd extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        this._initializeFields(this.props.fields);
    }

    value() {
        return this.state;
    }

    //this is the same as the function found in formcontainer
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
        else {}

        var pair = {};
        pair[key] = valueObject;
        this.setState(pair);
    }

    render() {
        if(this.props.isAdding) {
            return (
                <View style={styles.container}>
                    <ViewPage
                        fields={this.props.fields}
                        formData={this._asWorkingData(this.state)}
                        extra={this.props.extra}
                        fieldChanged={(key, value) => this.fieldChanged(key, value)} />
                    <View style={styles.separator}/>
                    <View style={styles.rowContainer}>
                        <Button view='low' text='Cancel' onPress={() => this.props.togglePressed()} />
                        <Button view='high' text='Add' onPress={() => this.props.addToList()} />
                    </View>
                </View>
            );
        }
        else {
            return (
                <View style={styles.rowContainer}>
                    <Button view='high' text={'Add ' + this.props.listKey} onPress={() => this.props.togglePressed()} />
                </View>
            );
        }
    }

    _initializeFields(fields) {
        for(var i=0; i < fields.length; i++) {
            if(fields[i].type != 'header') {
                var pair = {};
                pair[fields[i].key] = {
                    working: '',
                    store: ''
                };

                this.setState(pair);
            }
        }
    }

    _asWorkingData(formData) {
        //adds each key/value pair to asProps, where value is just the value -- not an object -- with storevalue left out
        var asProps = {};

        for (var pair in formData) {
            if(formData.hasOwnProperty(pair)) {
                asProps[pair] = formData[pair].working;
            }
        }

        return asProps;
    }
}


module.exports = ViewPageListAdd;
