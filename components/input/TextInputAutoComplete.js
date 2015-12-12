
//TextInputAutoComplete.js
//
//


'use strict';

var React = require('react-native');

var {
    StyleSheet,
    ListView,
    TouchableHighlight,
    View,
    Text,
    TextInput,
    Component
} = React;

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    rowContainer: {
        backgroundColor: '#666666',
        padding: 10
    },
    text: {
        fontSize: 18,
        color: '#dddddd'
    },
    listSeparator: {
        height: 1,
        backgroundColor: '#555555'
    },
    textInput: {
        height: 60,
        flex: 0,
        alignSelf: 'stretch',
        fontSize: 18,
        paddingHorizontal: 10,
        color: '#dddddd',
        backgroundColor: '#444444'
    },
    inputSeparator: {
        height: 1,
        backgroundColor: '#444444',
    }
});



class TextInputAutoComplete extends Component {
    constructor(props) {
        super(props);

        var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.state = {
            dataSource: dataSource.cloneWithRows([])    //start with empty listview; change once typing starts
        };
    }

    componentDidMount() {
        this.input.focus();
    }

    onChangeText(value) {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this._matchOptions(value))
        });

        if(this.props.onChangeText) {
            this.props.onChangeText(value);
        }
    }

    selectName(value) {
        this.input.blur();  //input is only blurred when a value is clicked, not when typing

        this.setState({
            dataSource: this.state.dataSource.cloneWithRows([])
        });

        if(this.props.onChangeText) {
            this.props.onChangeText(value);
        }
    }

    _matchOptions(value) {
        if(!value) {
            return [];
        }

        var options = this.props.options;
        var match = value.toLowerCase();

        var matchOptions = [];

        for(var i=0; i < options.length; i++) {
            var test = options[i].toLowerCase();

            if(test.indexOf(match) == 0) {
                matchOptions.push(options[i]);
            }
        }

        return matchOptions;
    }

    renderRow(value) {
        return (
            <TouchableHighlight onPress={() => this.selectName(value)} underlayColor='#222222'>
                <View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.text}>
                            {value}
                        </Text>
                    </View>
                    <View style={styles.listSeparator}/>
                </View>
            </TouchableHighlight>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    ref={(r) => this.input = r}
                    style={styles.textInput}
                    defaultValue={this.props.defaultValue}
                    placeholder={this.props.placeholder}
                    placeholderTextColor='#bbbbbb'
                    autoCorrect={false}
                    keyboardType={this.props.keyboardType}
                    onChangeText={(text) => this.onChangeText(text)} />
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                    automaticallyAdjustContentInsets={false}
                    keyboardShouldPersistTaps={true} />
            </View>
        );
    }
}


module.exports = TextInputAutoComplete;
