//
//HowTo.js
//
//


'use strict';

var React = require('react-native');

var {
    StyleSheet,
    View,
    TouchableHighlight,
    Text,
    ScrollView,
    LinkingIOS,
    Component
} = React;

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        backgroundColor: '#222222'
    },
    scrollView: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        flex: 1
    },
    title: {
        marginTop: 20,
        marginBottom: 10,
        fontSize: 24,
        textAlign: 'left',
        color: '#e65c5c'
    },
    mainText: {
        fontSize: 18,
        textAlign: 'left',
        color: '#dddddd'
    },
    url: {
        color: '#7aceb7',
        fontSize: 18,
        paddingVertical: 10
    },
    learnMore: {
        paddingTop: 30,
        alignItems: 'center'
    },
    learnMoreText: {
        fontSize: 18,
        color: '#dddddd',
        textAlign: 'center'
    }
    });


class HowTo extends Component {
    constructor(props) {
        super(props);
    }

    onPress(url) {
        LinkingIOS.openURL(url);
    }

    render() {
        var email = 'mailto:theherpproject@uncg.edu';
        var url = 'http://theherpproject.uncg.edu/curriculum';

        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollView}>
                <Text style={styles.title}>Registration</Text>
                <Text style={styles.mainText}>
                    Register your participation in these projects by emailing The HERP Project at:
                </Text>
                <TouchableHighlight onPress={() => LinkingIOS.openURL(email)} underlayColor='#ffffff'>
                    <Text style={styles.url}>theherpproject@uncg.edu</Text>
                </TouchableHighlight>
                <Text style={styles.title}>How To Collect Data</Text>
                <Text style={styles.mainText}>For each project, you will navigate through the data collection process by selecting each of the categories. As you comlplete
                    each section, it will be marked as complete. This should remind you to go back and check the form for missing data before
                    submitting. There is a teaching curriculum related to most of these projects on our website:
                </Text>
                <TouchableHighlight onPress={() => LinkingIOS.openURL(url)} underlayColor='#ffffff'>
                    <Text style={styles.url}>{url}</Text>
                </TouchableHighlight>
                <Text style={styles.mainText}>
                    For more information on collecting data for each project, click the info icon next to each form.
                </Text>
                </ScrollView>
            </View>
        );
    }
}

module.exports = HowTo;
