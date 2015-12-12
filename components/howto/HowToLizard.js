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
                    This project is a population survey of native lizard species. You will need to be able to identify lizard species.  We capture
                    lizards using home-made lizard lassos but we capture skinks by hand. You will be taking lizard measurements of snout-vent length
                    (SVL), tail length and weight.
                </Text>
                <Text style={styles.mainText}>
                    Refer to our Lizard curriculum at 
                </Text>
                <TouchableHighlight onPress={() => this.props.onURLPress(url)} underlayColor='#ffffff'>
                    <Text style={styles.url}>{url}</Text>
                </TouchableHighlight>
                <Text style={styles.mainText}>
                    for more detailed information.  You should contact your state’s wildlife resources agency before starting any lizard study.
                </Text>
            </View>
        );
    }
}

module.exports = HowToAquaticTurtle;
