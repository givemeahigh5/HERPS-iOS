'use strict';

var React = require('react-native');


var {
    TouchableHighlight,
    View,
    Text,
    Component
} = React;


class HowToAquaticTurtle extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var styles = this.props.styles;
        var url = 'http://theherpproject.uncg.edu/curriculum';

        return (
            <View>
                <Text style={styles.mainText}>
                    This project is a mark/recapture population study of semi-aquatic turtles. You will need to be able to identify turtle
                    species and have a coding system if you want to mark turtles.  We trap turtles using hoop traps. You will be taking
                    turtle measurements of length and weight.</Text>
                <Text style={styles.mainText}>
                    Refer to our Semi-Aquatic Turtle curriculum at
                </Text>
                <TouchableHighlight onPress={() => this.props.onURLPress(url)} underlayColor='#ffffff'>
                    <Text style={styles.url}>{url}</Text>
                </TouchableHighlight>
                <Text style={styles.mainText}>
                    for more detailed information. You should contact your state’s wildlife resources agency before starting any
                    semi-aquatic turtle study.
                </Text>
            </View>
        );
    }
}

module.exports = HowToAquaticTurtle;
