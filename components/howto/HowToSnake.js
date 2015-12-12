'use strict';

var React = require('react-native');


var {
    TouchableHighlight,
    View,
    Text,
    Component
} = React;


class HowToSnake extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var styles = this.props.styles;
        var url = 'http://theherpproject.uncg.edu/curriculum';

        return (
            <View>
                <Text style={styles.mainText}>
                    This project is a population survey of native snake species. You will need to be able to identify snake species.
                    Gravid refers to female snakes holding eggs.
                </Text>
                <Text style={styles.mainText}>
                    Under capture method, you will see that there are some numbers with no descriptors (NA). This is because we use the same
                    numbers across projects and those blank numbers do not apply to the snake project. You will be taking snake measurements
                    of total length and weight. Please indicate your method for measuring snake length: stretch, squeeze box, tube or other.
                </Text>
                <Text style={styles.mainText}>
                    Refer to our Snake curriculum at
                </Text>
                <TouchableHighlight onPress={() => this.props.onURLPress(url)} underlayColor='#ffffff'>
                    <Text style={styles.url}>{url}</Text>
                </TouchableHighlight>
                <Text style={styles.mainText}>
                    for more detailed information related to teaching about snakes. You should contact your state’s wildlife resources agency
                    before starting any snake study.
                </Text>
                <Text style={styles.mainText}>
                    We do not recommend that anyone handle venomous snakes.
                </Text>
            </View>
        );
    }
}

module.exports = HowToSnake;
