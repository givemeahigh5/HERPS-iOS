
//ViewPageList.js
//
//
//page that is a list of items, with an add button at its bottom



'use strict';

var React = require('react-native');
var Button = require('./Button');
var ViewField = require('./ViewField');

var {
    StyleSheet,
    View,
    ListView,
    Text,
    Component
} = React;


var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    listViewContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch'
    },
    listView: {
        flex: 1,
        backgroundColor: '#222222'
    },
    rowContainer: {
        flexDirection: 'row'
    },
    separator: {
        height: 1,
        backgroundColor: '#444444'
    },
    record: {
        alignSelf: 'stretch',
        paddingTop: 12
    },
    recordText: {
        flex: 1,
        color: '#dddddd',
        paddingHorizontal: 20,
        fontSize: 18
    },
    recordEditable: {
        alignItems: 'stretch',
        alignSelf: 'stretch',
        paddingTop: 12,
        paddingHorizontal: 20,
        backgroundColor: '#222222'
    },
    recordTextEditable: {
        flex: 1,
        color: '#dddddd',
        fontSize: 18
    }
});



class ViewPageList extends Component {
    constructor(props) {
        super(props);

        var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            value: this.props.list,
            dataSource: dataSource.cloneWithRows(this.props.list)
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.list,
            dataSource: this.state.dataSource.cloneWithRows(nextProps.list)
        });
    }

    renderRow(rowData, sectionID, rowID) {
        return (
            <View key={rowData['Common Name:'].working} style={styles.record}>
                <Text style={styles.recordText}>
                    #{parseInt(rowID)+1}: {rowData['Common Name:'].working} ({rowData['Scientific Name:'].working})
                </Text>
            </View>
        );
    }

    renderMacroInvertebratesRow(rowData, sectionID, rowID) {
        return (
            <View key={rowData.species} style={styles.record}>
                <Text style={styles.recordText}>
                    #{parseInt(rowID)+1}: {rowData['Species:'].working}, Number: {rowData['Number:'].working}
                </Text>
            </View>
        );
    }

    renderCallRow(rowData, sectionID, rowID) {
        //get callingIndex field from fields list
        var fields = this.props.fields;
        var field;

        for(var i=0; i < fields.length; i++) {
            if(fields[i].key == 'Calling Index:') {
                field = fields[i];
            }
        }

        return (
            <View key={rowData['Common Name:'].working}>
                <View style={styles.recordEditable}>
                    <Text style={styles.recordTextEditable}>
                        {rowData['Common Name:'].working} ({rowData['Scientific Name:'].working})
                    </Text>
                    <ViewField
                        field={field}
                        key={field.key}
                        defaultValue={rowData['Calling Index:'].working}
                        placeholder={field.placeholder}
                        isEmbedded={true}
                        fieldChanged={(key, value) => this.props.fieldChanged(key, value, rowID)} />
                </View>
                <View style={styles.separator} />
            </View>
        );
    }

    render() {
        if(this.props.list.length) {
            var renderRow;

            if(this.props.listKey == 'Species') {
                renderRow = this.renderCallRow.bind(this);
            }
            else if(this.props.listKey == 'Macroinvertebrates') {
                renderRow = this.renderMacroInvertebratesRow.bind(this);
            }
            else {
                renderRow = this.renderRow.bind(this);
            }

            return (
                <View style={styles.listViewContainer}>
                    <ListView
                        style={styles.listView}
                        automaticallyAdjustContentInsets={false}
                        dataSource={this.state.dataSource}
                        renderRow={renderRow} />
                </View>
            );
        }
        else {
            return (
                <View style={styles.listViewContainer}>
                    <View style={styles.record}>
                        <Text style={styles.recordText}>
                            No Data Added Yet.
                        </Text>
                    </View>
                </View>
            );
        }
    }
}


module.exports = ViewPageList;
