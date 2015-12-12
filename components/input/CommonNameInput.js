
//CommonNameInput.js
//
//


'use strict';

var React = require('react-native');
var TextInputAutoComplete = require('./TextInputAutoComplete');

var {
    Component
} = React;



class CommonNameInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.defaultValue
        };
    }

    value() {
        return this.state.value;
    }

    dependentValue() {
        return {
            key: 'Scientific Name:',
            value: this._scientificName(this.state.value)
        };
    }

    onChangeText(value) {
        this.setState({ value: value });
    }

    _scientificName(common) {
        var options = this.props.options;

        for(var i=0; i < options.length; i++) {
            if(common === options[i].common) {
                return options[i].scientific;
            }
        }
    }

    _options() {
        var propOptions = this.props.options;
        var options = [];

        if(propOptions) {
            for(var i=0; i < propOptions.length; i++) {
                options.push(propOptions[i].common);
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


module.exports = CommonNameInput;
