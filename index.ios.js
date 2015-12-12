'use strict';

var React = require('react-native');
var Welcome = require('./components/Welcome');

var {
    StyleSheet,
    Component,
    Navigator,
    NavigatorIOS
} = React;

var styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

//update navigator styles
//change pages style to only edit text and subtext, NOT row bg color


class HerpProjectApp extends Component {
    render() {
        
        return (
            <NavigatorIOS
                style={styles.container}
                barTintColor='#494c2d'
                tintColor='#ffffff'
                titleTextColor='#ffffff'
                initialRoute={{
                    title: 'Welcome',
                    component: Welcome,
                }} />
            );

    }
}

React.AppRegistry.registerComponent('HerpProject', function() { return HerpProjectApp; });
