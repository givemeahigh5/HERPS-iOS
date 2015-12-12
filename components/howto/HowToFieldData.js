'use strict';

var React = require('react-native');


var {
    TouchableHighlight,
    View,
    Text,
    Component
} = React;


class HowToFieldData extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var styles = this.props.styles;

        return (
            <View>
                <Text style={styles.mainText}>
                    This project is a habitat specific survey. You should use this data entry method for survey of forested areas.  We use coverboards
                    or visual searches.
                </Text>
                <Text style={styles.mainText}>
                    The data collection is set up to start the survey by collecting location information and environmental parameters.
                    Once this information is submitted, select "Add Data" to record an animal. When all animal information has been
                    recorded, click the submit button and this will take you back to the form screen.  Click the "End Survey" button
                    to record environmental parameters at the end of the survey. Clicking the final submit button will complete the data entry.
                </Text>
            </View>
        );
    }
}

module.exports = HowToFieldData;
