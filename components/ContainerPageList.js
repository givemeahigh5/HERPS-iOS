//
//ContainerPageList.js
//
//



'use strict';

var React = require('react-native');
var ViewPageListAdd = require('./ViewPageListAdd');
var ViewPageList = require('./ViewPageList');

var {
    StyleSheet,
    View,
    Component
} = React;


var styles = StyleSheet.create({
    container: {
        flex: 1
    }
});



class ContainerPageList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.formData[this.props.listKey],
            isAdding: false
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.formData[nextProps.listKey],
            isAdding: false
        });

        if(this.props.listKey != nextProps.listKey) {
            this.input.state = {};    //this is really bad, but only way i know to clear state when transitioning between tab page lists
            this.input._initializeFields(this.props.fields);
        }
    }

    togglePressed() {
        if(!this.state.isAdding) {
            this.input.state = {};    //this is really bad, but only way i know to clear state when transitioning between tab page lists
            this.input._initializeFields(this.props.fields);
        }

        this.setState({ isAdding: !this.state.isAdding });
    }

    addToList() {
        var value = this.input.value();

        var records = this.state.value;
        var newRecords = [];

        for(var i=0; i < records.length; i++) {
            newRecords.push(records[i]);
        }

        newRecords.push(value);

        //set local state to just working value
        this.setState({
            value: newRecords,
            isAdding: false
        });

        //set container variable to object
        this.props.fieldChanged(this.props.listKey, newRecords);
    }

    updateListItem(key, value, index) {

        //make sure value is in working/store form

        var records = this.state.value;
        var newRecords = [];

        if(records.length >= index) {
            for(var i=0; i < records.length; i++) {
                var record = records[i];
                var updatedRecord = {};

                for(var r in record) {
                    if(record.hasOwnProperty(r)) {
                        //set value where record index and field names both match
                        updatedRecord[r] = (index == i && r == key) ? value : record[r];
                    }
                }

                newRecords.push(updatedRecord);
            }

            this.setState({ value: newRecords });
            this.props.fieldChanged(this.props.listKey, newRecords);
        }
    }

    render() {
        var listView = this.state.isAdding ? null : (
            <ViewPageList
                fields={this.props.fields}
                list={this.state.value}
                listKey={this.props.listKey}
                fieldChanged={(key, value, index) => this.updateListItem(key, value, index)} />
        );

        return (
            <View style={styles.container}>
                {listView}
                <ViewPageListAdd
                    ref={(r) => this.input = r}
                    fields={this.props.fields}
                    listKey={this.props.listKey}
                    isAdding={this.state.isAdding}
                    togglePressed={() => this.togglePressed()}
                    addToList={() => this.addToList()} />
            </View>
        );
    }
}


module.exports = ContainerPageList;
