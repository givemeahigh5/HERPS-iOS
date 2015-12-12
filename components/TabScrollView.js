//
//TabScrollView.js
//
//horizontal scrollview on the top of each form to navigate pages


'use strict';

var React = require('react-native');

var {
    StyleSheet,
    View,
    TouchableHighlight,
    ScrollView,
    Text,
    Component
} = React;


var styles = StyleSheet.create({
    scrollView: {
        flex: 1
    },
    tabContainer: {
        flex: 1
    },
    containerIncomplete: {
        backgroundColor: '#e65c5c',
        borderRightWidth: 1,
        borderColor: '#181818'
    },
    containerComplete: {
        backgroundColor: '#8bc740',
        borderRightWidth: 1,
        borderColor: '#181818'
    },
    tabSeparator: {
        flex: 1,
        flexDirection: 'row'
    },
    pageTabInactive: {
        flex: 1,
        marginTop: 10,
        paddingTop: 17,
        paddingBottom: 18,
        paddingHorizontal: 20,
        fontSize: 18,
        backgroundColor: '#000000',
        color: '#dddddd'
    },
    pageTabActive: {
        flex: 1,
        marginTop: 10,
        paddingTop: 17,
        paddingBottom: 18,
        paddingHorizontal: 20,
        fontSize: 18,
        backgroundColor: '#999999',
        color: '#000000'
    },
    separatorIncomplete: {
        height: 10,
        backgroundColor: '#e65c5c'
    },
    separatorComplete: {
        height: 10,
        backgroundColor: '#8bc740'
    },
});



class TabScrollView extends Component {
    constructor(props) {
        super(props);
    }

    pagePressed(pageName) {
        //set page state in parent
        this.props.pagePressed(pageName);

        //scroll to position so selected is on the left (uses dynamic tab ref for tab position, scrollview ref for scrollto)
        setTimeout(() => {
            this.refs[pageName].measure((x, y, width, height, px, py) => {
                var xPos = x < 60 ? x : x - 60;
                this.scrollTabs.scrollTo(y, xPos);
            });
        }, 0);
    }

    renderPageTab(page) {
        var pageName = page.name;
        var isActive = pageName == this.props.page;

        //if PageList, pass the id of the list, otherwise pass the array of ids for fields
        var completeParam = page.listKey ? page.listKey : page.fields;
        var isComplete = this.props.pageIsComplete(completeParam);

        var style = isActive ? styles.pageTabActive : styles.pageTabInactive;
        var sepStyle = isComplete ? styles.containerComplete : styles.containerIncomplete;

        return (
            <TouchableHighlight
                    ref={pageName}
                    key={pageName}
                    onPress={() => this.pagePressed(pageName)}
                    underlayColor='#000000'>
                <View style={sepStyle}>
                    <View style={styles.tabSeparator}>
                        <Text style={style}>
                            {pageName}
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }

    render() {
        var pages = this.props.pages;
        var hasOneRow = pages.length == 1;
        var scrollTabs = [];

        for(var i=0; i < pages.length; i++) {
            scrollTabs.push(this.renderPageTab(pages[i]));
        }

        return (
            <View ref={(r) => this.scrollContainer = r}>
                <ScrollView
                    ref={(r) => this.scrollTabs = r}
                    style={styles.scrollView}
                    contentContainerStyle={styles.tabContainer}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    automaticallyAdjustContentInsets={false}>
                    {scrollTabs}
                </ScrollView>
            </View>
        );
    }

    _getFieldsFor(page) {
        var pages = this.props.pages;

        for(var i=0; i < pages.length; i++) {
            if(pages[i].name == page) {
                return pages[i].fields;
            }
        }

        return [{name: 'Error: Nothing Loaded'}];
    }
}


module.exports = TabScrollView;
