
//SelectInput.js
//
//Component implementation for dropdown
//Looks like a text input (but with an arrow), pushes a new view with a list of options that can be clicked to select


'use strict';

var React = require('react-native');


var {
    StyleSheet,
    View,
    TouchableHighlight,
    ScrollView,
    Text,
    Component
} = React;


var styles = StyleSheet.create({
    listView: {
        flex: 1,
        backgroundColor: '#222222'
    },
    type: {
        fontSize: 20
    },
    separator: {
        height: 1,
        backgroundColor: '#444444'
    },
    rowContainer: {
        padding: 10,
        flexDirection: 'row',
        backgroundColor: '#222222'
    },
    rowContainerSelected: {
        padding: 10,
        flexDirection: 'row',
        backgroundColor: '#444444'
    },
    text: {
        //height: 36,
        flex: 1,
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        alignSelf: 'stretch',
        fontSize: 16,
        color: '#dddddd'
    },
    textSelected: {
        //height: 36,
        flex: 1,
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        alignSelf: 'stretch',
        fontSize: 16,
        color: '#dddddd'
    }
});



class SelectInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.defaultValue
        };
    }

    value() {
        var valueObject = this._stringToObject(this.state.value);
        return valueObject;
    }

    _stringToObject(string) {
        var index = string.indexOf('-');

        if(index == 2 || index == 3 || index == 4) {
            return {
                working: string,
                store: string.slice(0, index-1)
            };
        }
        else {
            return {
                working: string,
                store: string
            };
        }
    }

    selectOption(value) {
        this.setState({ value: value });
    }

    renderRow(option) {
        var isSelected = (option == this.state.value);

        return (
            <TouchableHighlight key={option} onPress={() => this.selectOption(option)} underlayColor='#000000'>
                <View>
                    <View style={isSelected ? styles.rowContainerSelected : styles.rowContainer}>
                        <Text style={isSelected ? styles.textSelected : styles.text}>{option}</Text>
                    </View>
                    <View style={styles.separator}/>
                </View>
            </TouchableHighlight>
        );
    }

    render() {
        var options = this.props.options;
        var scrollOptions = [];

        for(var i=0; i < options.length; i++) {
            scrollOptions.push(this.renderRow(options[i]));
        }

        return (
            <ScrollView
                style={styles.listView}
                showsVerticalScrollIndicator={false}
                automaticallyAdjustContentInsets={false}>
                {scrollOptions}
            </ScrollView>
        );
    }
}


module.exports = SelectInput;
