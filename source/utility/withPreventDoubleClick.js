import React from 'react';
import debounce from 'lodash.debounce';
import {TouchableOpacity} from 'react-native';
const withPreventDoubleClick = () => {
  class PreventDoubleClick extends React.PureComponent {
    debouncedOnPress = () => {
      this.props.onPress && this.props.onPress();
    };

    onPress = debounce(this.debouncedOnPress, 500, {
      leading: true,
      trailing: false,
    });
    // onPress = debounce()

    render() {
      return (
        <TouchableOpacity
          {...this.props}
          onPress={this.onPress}
          activeOpacity={0.9}
        />
      );
    }
  }

  PreventDoubleClick.displayName = `withPreventDoubleClick(${
    TouchableOpacity.displayName || TouchableOpacity.name
  })`;
  return PreventDoubleClick;
};

export default withPreventDoubleClick;
