
//BasicInput.js
//
//
//


'use strict';

var React = require('react-native');
var TextInputRegular = require('./TextInputRegular');

var {
    Component
} = React;



class BasicInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.defaultValue
        };
    }

    value() {
        return this.state.value;
    }

    onChangeText(value) {
        this.setState({ value: value });
    }

    render() {
        return (
            <TextInputRegular
                defaultValue={this.state.value}
                placeholder={this.props.placeholder}
                onChangeText={(text) => this.onChangeText(text)} />
        );
    }
}


module.exports = BasicInput;
