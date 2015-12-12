'use strict';

var React = require('react-native');


var {
    TouchableHighlight,
    View,
    Text,
    Component
} = React;


class HowToFrogCall extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var styles = this.props.styles;
        var url = 'https://www.pwrc.usgs.gov/naamp/';

        return (
            <View>
                <Text style={styles.mainText}>
                    This project is a calling amphibian survey. You will need to be able to identify frogs by call and characterize the
                    population with a calling abundance index. The calling index values are: 1 = Individuals can be counted, there is space
                    between calls; 2 = Calls of individuals can be distinguished but there is some overlapping of calls; and 3 = Full chorus,
                    calls are constant, continuous and overlapping.
                </Text>
                <Text style={styles.mainText}>
                    For our project, at each stop students listen for 2 minutes (recording start time), then record the air temperature, the
                    amphibian calling index for each species heard, and whether moon light was visible or not. Additional species can be added
                    with the “Add Species” button. For more information about amphibian calling surveys check
                </Text>
                <TouchableHighlight onPress={() => this.props.onURLPress(url)} underlayColor='#ffffff'>
                    <Text style={styles.url}>{url}</Text>
                </TouchableHighlight>
            </View>
        );
    }
}

module.exports = HowToFrogCall;
