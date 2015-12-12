//
//About.js
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
        fontSize: 18
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


class About extends Component {
    constructor(props) {
        super(props);
    }

    onPress(url) {
        LinkingIOS.openURL(url);
    }

    render() {
        var url = 'http://theherpproject.uncg.edu/';

        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollView}>
                <Text style={styles.title}>The HERP Project</Text>
                <Text style={styles.mainText}>
                    Herpetology Education in Rural Places and Spaces (The HERP Project) is a NSF-funded project to support educational, conservation
                    and field ecology experiences related to herpetology (the study of reptiles and amphibians).  School-aged youth from around the
                    state of North Carolina are participating in a variety of field science investigations.  This app provides the opportunity to
                    contribute data to those investigations.
                </Text>
                <View style={styles.learnMore}>
                    <Text style={styles.learnMoreText}>Learn more at:</Text>
                    <TouchableHighlight style={styles.learnmoreText} onPress={() => LinkingIOS.openURL(url)} underlayColor='#dfdfdf'>
                        <Text style={styles.url}>{url}</Text>
                    </TouchableHighlight>
                </View>
                </ScrollView>
            </View>
        );
    }
}

module.exports = About;
