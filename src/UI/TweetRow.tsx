import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Colors from './Colors';

type PropType = {
  author: string;
  isDarkMode: boolean;
};

class TweetRow extends React.Component<PropType> {
  render(): JSX.Element {
    return (
      <View style={styles.sectionContainer}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: this.props.isDarkMode ? Colors.white : Colors.black,
            },
          ]}>
          {this.props.author}
        </Text>
        <Text
          style={[
            styles.sectionDescription,
            {
              color: this.props.isDarkMode ? Colors.light : Colors.dark,
            },
          ]}>
          {this.props.children}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default TweetRow;
