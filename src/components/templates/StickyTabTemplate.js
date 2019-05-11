import React from "react";
import {
  Animated,
  Dimensions,
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback
} from "react-native";

import _ from "lodash";

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
  _scrollValue = 0;
  _headerOffsetYValue = 0;

  constructor (props) {
    super(props);
    this.state = {
      scroll: new Animated.Value(0),
      headerOffsetY: new Animated.Value(0),
      pageHeight: 0,
      activeTab: 0,
      tabData: props.tabData,
      headerDimensions: null,
    };
  }

  static getDerivedStateFromProps (props, state) {
    return {tabData: props.tabData};
  }

  componentDidMount () {
    const throttled = _.throttle(this._customOnHeaderOffset.bind(this), 60);
    this.state.scroll.addListener(({value}) => {
      const diff = value - this._scrollValue;
      this._scrollValue = value;
      this._headerOffsetYValue = Math.min(
        Math.max(this._headerOffsetYValue + diff, 0),
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

  _setHeaderHeight (event) {
    this.setState({headerDimensions: event.nativeEvent.layout}, this._initAnimations);
  }

  _initAnimations () {
    this.setState({
      headerOffsetY: Animated.multiply(
        Animated.diffClamp(this.state.scroll, 0, Animated.subtract(this.state.headerDimensions.height, TAB_BAR_HEIGHT)),
        -1
      )});
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
    this._tabPanes[index].getNode().scrollToOffset({offset: 0});
    this.state.scroll.setValue(0);
  }

  _renderPadder (props) {
    return (
      <TabContext.Consumer>
        {(context) =>
          <View
            style={{height: context.headerDimensions.height}}
          />}
      </TabContext.Consumer>
    );
  }

  _renderPage ({item, index}) {
    const RenderItem = item.renderItem || this.props.renderItem;
    const RenderEmpty = item.renderEmpty || this.props.renderEmpty;
    return (
      <View style={{width: SCREEN_WIDTH}}>
        <AnimatedFlatList removeClippedSubviews
          data={item.data}
          keyExtractor={(item, index) => "key" + index}
          renderItem={RenderItem}
          ListEmptyComponent={RenderEmpty}
          ListHeaderComponent={
            <this._renderPadder
              index={index}
              height={this.state.headerDimensions.height}
            />}
          scrollEventThrottle={1}
          ref={(ref) => {
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
            backgroundColor: "#efefef"
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

// TODO: Changing to empty tabs causes error
