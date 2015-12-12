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

        return (
            <View>
                <Text style={styles.mainText}>
                    This project is a habitat specific survey. You should use this data entry method for survey of ephemeral pools,
                    streams, ponds or lakes. We use minnow traps (baited and unbaited) as well as leaf packs.</Text>
                <Text style={styles.mainText}>The data collection is set up to start the survey by collecting location information and
                    environmental parameters. Once this information is submitted, select "Add Data" and proceed through the tabs:
                    Trap, Salamander, Frog, Macroinvertebrate, and Other as you record information on all animals collected. When all
                    animal information has been recorded, click the submit button and this will take you back to the form screen. Click
                    "Add Data" again to add more records with the same start params, or click "End Survey" to record environmental parameters
                    at the end of the survey. Clicking the final submit button will complete the data entry.
                </Text>
            </View>
        );
    }
}

module.exports = HowToFrogCall;
