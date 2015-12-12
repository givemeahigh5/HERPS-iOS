
//ScientificNameInput.js
//
//


'use strict';

var React = require('react-native');
var TextInputAutoComplete = require('./TextInputAutoComplete');

var {
    Component
} = React;



class ScientificNameInput extends Component {
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

    _options() {
        var propOptions = this.props.options;
        var options = [];

        if(propOptions) {
            for(var i=0; i < propOptions.length; i++) {
                options.push(propOptions[i].scientific);
            }
        }

        return options;
    }

    render() {
        return (
            <TextInputAutoComplete
                defaultValue={this.state.value}
                placeholder={this.props.placeholder}
                onChangeText={(text) => this.onChangeText(text)}
                options={this._options()} />
        );
    }
}


module.exports = ScientificNameInput;
