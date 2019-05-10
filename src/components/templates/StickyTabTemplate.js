import React from "react";
import {
  Animated, Dimensions, Platform, Text, View, StyleSheet, FlatList, ScrollView, TouchableWithoutFeedback
} from "react-native";
import {
  Body, Header, List, ListItem as Item, ScrollableTab, Tab, Tabs, Title
} from "native-base";

import FlexContainer from "@components/FlexContainer";
import HeaderBar from "@molecules/HeaderBar";

// import _ from "lodash";
const _ = require("lodash");

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const {width: SCREEN_WIDTH} = Dimensions.get("window");
const TAB_BAR_HEIGHT = 40;
const TabContext = React.createContext();

/**
 * Props:\
 * headerComponent: The component to render as header\
 * renderItem: the default item render method\
 * tabData: an array of objects containing data for each tab\
 * tabContainerStyle: Style to apply to tab container\
 * tabStyle: Style to apply to each tab\
 * tabActiveStyle: Style to apply to an active tab\
 * \
 */
class StickyTabTemplate extends React.Component {
  _tabPanes = [];
  // _padders =[];
  _scrollValue = 0;
  _headerOffsetYValue = 0;

  // testPad = new Animated.Value(0);

  constructor (props) {
    super(props);
    this.state = {
      scroll: new Animated.Value(0),
      headerOffsetY: new Animated.Value(0),
      pageHeight: 0,
      activeTab: 0,
      tabData: props.tabData,
      headerDimensions: null,
      // headerHeight: (this.props.headerHeight || 0) + TAB_BAR_HEIGHT,
      // headerHeightAnim: new Animated.Value(0),

    };
  }

  static getDerivedStateFromProps (props, state) {
    return {tabData: props.tabData};
  }

  componentDidMount () {
    // const test = this._customOnHeaderOffset.bind(this);
    const throttled = _.throttle(this._customOnHeaderOffset.bind(this), 60);
    this.state.scroll.addListener(({value}) => {
      const diff = value - this._scrollValue;
      this._scrollValue = value;
      this._headerOffsetYValue = Math.min(
        Math.max(this._headerOffsetYValue + diff, 0),
        // this.state.headerHeight,
        this.state.headerDimensions ? this.state.headerDimensions.height : 0
      );
      throttled();
    });

    this.state.scroll.addListener(this._customOnScroll.bind(this));
    this.state.headerOffsetY.addListener(this._customOnHeaderOffset.bind(this));
  }

  componentWillUnmount () {
    this.state.scroll.removeAllListeners();
    // TODO: Figure out how to perform below WITHOUT crashing app
    // this.state.headerOffsetY.removeAllListeners();
  }

  // componentDidUpdate () {
  //   console.log("Component Updated");
  //   console.log(this._tabPaneScroller);
  //   console.log(this._tabPanes);
  //   this._tabPaneRef.getNode().forceUpdate();
  //   for (const elem in this._tabPanes) {
  //     // elem.forceUpdate();
  //   }
  // }

  _setHeaderHeight (event) {
    console.log(`setHeight: ${event.nativeEvent.layout.height}`);
    // this.setState({headerDimensions: null});
    this.setState({headerDimensions: event.nativeEvent.layout}, this._initAnimations);
    // this.setState({headerHeight: event.nativeEvent.layout.height});
    // this.state.headerHeightAnim.setValue(event.nativeEvent.layout.height);
    // this.state.headerHeightAnim.setOffset(event.nativeEvent.layout.height);
    // this.setState({headerHeightAnim: new Animated.Value(event.nativeEvent.layout.height)});
    // this.setState({
    //   headerOffsetY: Animated.multiply(
    //     Animated.diffClamp(this.state.scroll, 0, Animated.subtract(this.state.headerDimensions.height, TAB_BAR_HEIGHT)),
    //     -1
    //   )});
    // setTimeout(() => this._tabPanes.forceUpdate(), 200);
    // this._tabPanes.getNode().forceUpdate();
  }

  _initAnimations () {
    // this.testPad.setOffset(this.state.headerDimensions.height + TAB_BAR_HEIGHT);
    this.setState({
      headerOffsetY: Animated.multiply(
        Animated.diffClamp(this.state.scroll, 0, Animated.subtract(this.state.headerDimensions.height, TAB_BAR_HEIGHT)),
        -1
      )});
    for (const ref of this._tabPanes) {
      // ref.getNode().forceUpdate();
      // ref.forceUpdate();
      // console.log(ref);
    }
    // for (const ref of this._padders) {
    // ref.getNode().forceUpdate();
    // ref.forceUpdate();
    // console.log(ref);
    // }
  }

  _setPageHeight (event) {
    this.setState({pageHeight: event.nativeEvent.layout.height});
  }

  _customOnScroll (event) {
    if (this.props.onScroll instanceof Function) { this.props.onScroll(event); }
  }

  _customOnHeaderOffset () {
    if (this.props.onHeaderOffset instanceof Function) { this.props.onHeaderOffset(this._headerOffsetYValue); }
  }

  _changePage (index) {
    this.setState({activeTab: index});
    this._tabPaneRef.getNode().scrollToIndex({index});
    this._tabPanes[index].getNode().scrollToIndex({index: 0});
    this.state.scroll.setValue(0);
  }

  _renderPadder (props) {
    return (
      <TabContext.Consumer>
        {(context) =>
          <View
            style={{height: context.headerDimensions.height}}
            // ref={(ref) => { props._padders[props.index] = ref; }}
          />}
      </TabContext.Consumer>

    // <View style={{transform: [{scaleY: (props.height / 10) + 1}], height: 10}} />
    );
  }

  _renderPage ({item, index}) {
    const RenderItem = item.renderItem || this.props.renderItem;
    // const headerHeightTransform = [{scaleY: this.state.headerHeightAnim}];
    return (
      <View style={{width: SCREEN_WIDTH}}>
        {/* <Animated.View style={{transform: [{scaleY: this.state.headerDimensions.height}], height: 1}} /> */}
        {/* <this._renderPadder height={this.state.headerDimensions.height}/> */}
        <AnimatedFlatList
          data={item.data}
          keyExtractor={(item, index) => "key" + index}
          renderItem={RenderItem}
          // style={{height: this.state.pageHeight - this.state.headerHeight}}
          // style={{height: this.state.pageHeight - this.state.headerDimensions.height}}
          // ListHeaderComponent={<Animated.View style={{transform: [{scaleY: this.testPad}], height: 1}} />}
          ListHeaderComponent={
            <this._renderPadder
              index={index}
              height={this.state.headerDimensions.height}
              // _padders={this._padders}
            />}
          // contentContainerStyle={{paddingTop: this.state.headerDimensions.height}}
          scrollEventThrottle={1}
          ref={(ref) => {
            //  console.log(Object.keys(component.props));
            // console.log(component.props);
            // console.log(index);
            this._tabPanes[index] = ref;
          }}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: this.state.scroll}}}],
            {useNativeDriver: true},

          )}
        />
      </View>
    );
  }

  _renderTabBar () {
    const containerStyle = [
      styles.tabContainer,
      this.props.tabContainerStyle
    ];
    const tabStyle = [
      styles.tab,
      this.props.tabStyle,
    ];
    const tabActiveStyle = [
      styles.tab,
      this.props.tabStyle,
      styles.tabActive,
      this.props.tabActiveStyle
    ];
    return (
      <View
        style={containerStyle}>
        {this.state.tabData.map((item, index) =>
          <TouchableWithoutFeedback
            onPress={() => { this._changePage(index); }}
            key={item.header}>
            <Text
              style={[this.state.activeTab === index ? tabActiveStyle : tabStyle]}>
              {item.header}
            </Text>
          </TouchableWithoutFeedback>
        )}
      </View>
    );
  }

  render () {
    return (
      // Using a context provider to get around flatlists not propogating state changes
      <TabContext.Provider value={{
        headerDimensions: this.state.headerDimensions
      }}>
        {this._render()}
      </TabContext.Provider>
    );
  }

  _render () {
    return (
      <View onLayout={(event) => this._setPageHeight(event)} style={{flex: 1}}>
        {/* <this._renderPadder height={this.state.headerHeight}/> */}
        <Animated.View
          onLayout={(event) => this._setHeaderHeight(event)}
          style={{
            width: "100%",
            position: "absolute",
            zIndex: 1,
            transform: [
              {
                translateY: this.state.headerOffsetY,
              },
            ],
          }}
        >
          {this.props.headerComponent ? <this.props.headerComponent /> : null}
          <View>
            {this._renderTabBar()}
          </View>
        </Animated.View>
        {this.state.headerDimensions ? <AnimatedFlatList horizontal pagingEnabled removeClippedSubviews
          scrollEnabled={false}
          data={this.state.tabData}
          keyExtractor={(item) => item.header }
          renderItem={this._renderPage.bind(this)}
          showsHorizontalScrollIndicator={false}
          ref={(ref) => { this._tabPaneRef = ref; }}
        /> : null}
      </View>
    );
  }
}

export default StickyTabTemplate;

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: TAB_BAR_HEIGHT,
    backgroundColor: "#efefef",
  },
  tab: {
    flex: 1,
    height: TAB_BAR_HEIGHT,
    justifyContent: "center",
    borderBottomWidth: 4,
    borderBottomColor: "#00000000",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 16,
    fontWeight: "bold"
  },
  tabActive: {
    borderBottomWidth: 4,
    borderBottomColor: "#ff6f00",
    color: "#ff6f00"
  }
});

// TODO: Ensure propogation of status changes.
// TODO: Scroll to top of tab on tab change
