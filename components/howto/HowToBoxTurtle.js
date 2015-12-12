'use strict';

var React = require('react-native');


var {
    TouchableHighlight,
    View,
    Text,
    Component
} = React;


class HowToBoxTurtle extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var styles = this.props.styles;
        var url = 'http://theherpproject.uncg.edu/curriculum';

        return (
            <View>
                <Text style={styles.mainText}>
                    This project is a mark/recapture population study of Eastern Box Turtles. You will need to have a coding system if you
                    want to mark turtles. You will be taking the following turtle measurements: CL is carapace length, CW is carapace width at
                    widest point, and PL is plastron length from anterior to hinge and hinge to posterior.  You will also be weighing turtles.
                </Text>
                <Text style={styles.mainText}>
                    Refer to our Box Turtle curriculum at
                </Text>
                <TouchableHighlight onPress={() => this.props.onURLPress(url)} underlayColor='#ffffff'>
                    <Text style={styles.url}>{url}</Text>
                </TouchableHighlight>
                <Text style={styles.mainText}>
                    for more detailed information. You should contact your state’s wildlife resources agency before starting any box turtle study.
                </Text>
            </View>
        );
    }
}

module.exports = HowToBoxTurtle;
