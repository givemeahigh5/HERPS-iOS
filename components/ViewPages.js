//
//ViewPages.js
//
//shows TabScrollView with current page below



'use strict';

var React = require('react-native');
var TabScrollView = require('./TabScrollView');
var ViewPage = require('./ViewPage');
var ContainerPageList = require('./ContainerPageList');

var {
    StyleSheet,
    View,
    Component
} = React;


var styles = StyleSheet.create({
    separator: {
        height: 1,
        backgroundColor: '#444444'
    },
    container: {
        flex: 1,
        paddingTop: 64,
        flexDirection: 'column',
        backgroundColor: '#222222'
    },
    scrollViewContainer: {
        height: 72,
        flexDirection: 'column',
        alignItems: 'stretch',
        backgroundColor: '#000000',
        borderBottomWidth: 6,
        borderColor: '#999999'
    },
    scrollView: {
        flex: 1
    }
});



class ViewPages extends Component {
    constructor(props) {
        super(props);

        var pages = this.props.pages;
        var page = pages && pages.length && pages[0].name ? pages[0].name : '';

        this.state = {
            page: page
        };
    }

    pagePressed(pageName) {
        this.setState({ page: pageName });
    }

    pageListKey(pageName) {
        var pages = this.props.pages;

        for(var i=0; i < pages.length; i++) {
            if(pages[i].name == pageName && pages[i].listKey) {
                return pages[i].listKey;
            }
        }

        return null;
    }

    renderPage(page) {
        var props = {
            page: this.state.page,
            fields: this._getFieldsFor(this.state.page),
            formData: this._asWorkingData(this.props.formData),
            fieldChanged: this.props.fieldChanged
        };

        if(this.pageListKey(page)) {
            return <ContainerPageList {...props} formData={this.props.formData} listKey={this.pageListKey(page)} />;
        }
        else {
            return <ViewPage {...props} />;
        }
    }


    render() {
        var pageComponent = this.renderPage(this.state.page);

        return (
            <View style={styles.container}>
                <View style={styles.scrollViewContainer}>
                    <TabScrollView
                        pages={this.props.pages}
                        page={this.state.page}
                        pagePressed={(pageName) => this.pagePressed(pageName)}
                        pageIsComplete={this.props.pageIsComplete} />
                </View>
                <View style={styles.separator}/>
                <View style={styles.scrollView}>
                    {pageComponent}
                </View>
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

    _asWorkingData(formData) {
        //adds each key/value pair to asProps, where value is just the value -- not an object -- with storevalue left out
        var asProps = {};

        for (var pair in formData) {
            if (formData.hasOwnProperty(pair) && formData[pair].hasOwnProperty('working')) {
                asProps[pair] = formData[pair].working;
            }
        }

        return asProps;
    }
}


module.exports = ViewPages;
