'use strict';

var React = require('react-native');
var ContainerStandard = require('./ContainerStandard');
var HowToDetail = require('./howto/HowToDetail');
var FORMSTRUCTURE = require('../assets/metadata/FormStructure.json');


var {
    StyleSheet,
    Image,
    View,
    TouchableHighlight,
    ListView,
    Text,
    Component
} = React;


var styles = StyleSheet.create({
    listView: {
        backgroundColor: '#222222'
    },
    rowContainer: {
        flexDirection: 'row',
        backgroundColor: '#222222'
    },
    infoContainer: {
        height: 60,
        flex: 1,
        paddingVertical: 15,
        paddingHorizontal: 10
    },
    info: {
        alignItems: 'center'
    },
    selectContainer: {
        height: 60,
        flex: 6,
        flexDirection: 'row',
        paddingVertical: 18,
        paddingLeft: 5,
        paddingRight: 15
    },
    textContainer: {
        flex: 7
    },
    type: {
        fontSize: 20,
        color: '#dddddd'
    },
    arrowContainer: {
        flex: 1,
        paddingVertical: 2
    },
    arrow: {
        alignItems: 'flex-end'
    },
    separator: {
        height: 1,
        backgroundColor: '#444444'
    }
});


class ViewForms extends Component {
    constructor(props) {
        super(props);

        var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: dataSource.cloneWithRows(FORMSTRUCTURE.forms),
            formRef: null
        };
    }

    // Event Responders

    rowPressed(form) {
        var pages = this._getPagesFor(form);

        this.props.navigator.push({
            title: form,
            component: ContainerStandard,
            leftButtonTitle: 'Cancel',
            onLeftButtonPress: () => { this.state.formRef && this.state.formRef.backPressed() },
            rightButtonTitle: 'Submit',
            onRightButtonPress: () => { this.state.formRef && this.state.formRef.submitPressed() },
            passProps: {
                form: form,
                pages: pages,
                ref: this.onContainerRef.bind(this)
            }
        });
    }

    infoPressed(form) {
        this.props.navigator.push({
            title: 'How To',
            component: HowToDetail,
            leftButtonTitle: 'Back',
            onLeftButtonPress: this.backPressed.bind(this),
            passProps: {
                form: form
            }
        });
    }

    backPressed() {
        this.props.navigator.pop();
    }

    // Public Functions

    onContainerRef(callbackRef) {
        this.setState({formRef: callbackRef});
    }

    // Render

    renderRow(rowData) {
        return (
            <TouchableHighlight onPress={() => this.rowPressed(rowData.name)} underlayColor='#444444'>
                <View>
                    <View style={styles.rowContainer}>
                        <TouchableHighlight style={styles.infoContainer} onPress={() => this.infoPressed(rowData.name)} underlayColor='#444444'>
                            <View>
                                <View style={styles.info}>
                                    <Image source={require('image!info')} />
                                </View>
                            </View>
                        </TouchableHighlight>

                        <View style={styles.selectContainer}>
                            <View style={styles.textContainer}>
                                <Text style={styles.type}>{rowData.name}</Text>
                            </View>

                            <View style={styles.arrowContainer}>
                                <View style={styles.arrow}>
                                    <Image source={require('image!field-view')} />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.separator}/>
                </View>
            </TouchableHighlight>
        );
    }

    render() {
        return (
            <ListView
                style={styles.listView}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}/>
        )
    }

    // Private Functions

    _getPagesFor(name) {
        var forms = FORMSTRUCTURE.forms;

        for(var i=0; i < forms.length; i++) {
            if(forms[i].name == name) {
                return forms[i].pages;
            }
        }

        return [{name: 'Error: Nothing Loaded'}];
    }
}


module.exports = ViewForms;
