
//ViewPage.js
//
//Displays 1 page of a form, and all the associated fields
//No state is stored, just passed up to the container where it is processed, saved, and propagated down



'use strict';

var React = require('react-native');
var ViewField = require('./ViewField');

var {
    StyleSheet,
    View,
    ScrollView,
    Component
} = React;


var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch'
    },
    listView: {
        backgroundColor: '#222222'
    },
    pageFieldCntainer: {
        padding: 16
    },
    separator: {
        height: 1,
        backgroundColor: '#444444'
    }
});


class ViewPage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidUpdate(prevProps) {
        //scroll to the top of the scrollview, but only if the page has just been changed (by clicking the TabScrollView)
        if(prevProps.page != this.props.page) {
            requestAnimationFrame(() => {
                this.scroll.scrollTo(0);
            });
        }
    }

    _conditionalValue(formData, key) {
        for(var d in formData) {
            if(formData.hasOwnProperty(d)) {
                if(d == key) {
                    return formData[d].toLowerCase();
                }
            }
        }

        return '';
    }

    _scrollFields(fields) {
        var scrollFields = [];

        for(var i=0; i < fields.length; i++) {
            var conditional = fields[i].conditional ? this._conditionalValue(this.props.formData, fields[i].conditional) : '';

            scrollFields.push(this.renderField(fields[i], conditional));
        }

        return scrollFields;
    }

    renderField(field, conditional) {
        var defaultValue = this.props.formData.hasOwnProperty(field.key) ? this.props.formData[field.key] : '';
        return (
            <View key={field.key}>
                <ViewField
                    field={field}
                    key={field.key}
                    defaultValue={defaultValue}
                    placeholder={field.placeholder}
                    conditional={conditional}
                    fieldChanged={this.props.fieldChanged} />
                <View style={styles.separator}/>
            </View>
        );
    }

    render() {
        var scrollFields = this._scrollFields(this.props.fields);

        return (
            <ScrollView
                ref={(r) => this.scroll = r}
                style={styles.listView}
                keyboardShouldPersistTaps={true}>
                {scrollFields}
            </ScrollView>
        )
    }
}


module.exports = ViewPage;
