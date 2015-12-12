
//TextMultiInput.js
//
//Component implementation for multi-line text input
//Looks like a text input (but with an arrow), pushes a new view with a list multiline text box and a full description (where applicable)


'use strict';

var React = require('react-native');

var {
    StyleSheet,
    View,
    TouchableHighlight,
    Text,
    TextInput,
    Image,
    Component
} = React;



class ClickableInput extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var styles = this.props.styles;
        var containerStyle = this.props.isEmbedded ? styles.rowContainerEmbedded : styles.rowContainer;

        return (
            <TouchableHighlight onPress={() => this.props.onPressed()} underlayColor='#ffffff'>
                <View style={containerStyle}>
                    <View style={styles.iconContainer}>
                        <View style={styles.icon}>
                            <Image source={this.props.icon} />
                        </View>
                    </View>
                    <View style={styles.textContainer}>
                        <TextInput
                            style={styles.textInput}
                            editable={false}
                            value={this.props.value}
                            placeholder={this.props.placeholder}
                            placeholderTextColor='#999999' />
                    </View>
                </View>
            </TouchableHighlight>
        )
    }
}


module.exports = ClickableInput;
