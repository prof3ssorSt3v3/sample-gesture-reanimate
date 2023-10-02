import 'react-native-gesture-handler';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSpring } from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, SafeAreaView, View, FlatList } from 'react-native';
import { useWindowDimensions } from 'react-native';
import DATA from './data/beers.json';

export default function App() {
  const [beers, setBeers] = useState([]);
  const { height, width } = useWindowDimensions();

  useEffect(() => {
    setBeers(DATA);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Multi-Column List with Gestures</Text>
        <FlatList style={styles.list} data={beers} renderItem={({ item }) => <ListItem beer={item} />} numColumns={2} keyExtractor={(item) => item.uid} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

function ListItem({ beer }) {
  const { name, style, brand, uid } = beer;
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const tapGesture = Gesture.Tap()
    .numberOfTaps(1)
    .maxDuration(500)
    .maxDelay(500)
    .maxDistance(20)
    .onStart(() => {
      console.log('starting tap');
    })
    .onEnd(() => {
      scale.value = Math.random() + 0.5;
      opacity.value = Math.random();
    });

  const reStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, { duration: 400 }),
      transform: [
        {
          scale: withTiming(scale.value, {
            duration: 600,
          }),
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View style={[styles.item, reStyle]}>
        <View>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.itemtext}>{brand}</Text>
          <Text style={styles.itemtext}>{style}</Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'hsl(240, 50%, 50%)',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  list: {
    width: '100%',
    paddingVertical: 20,
  },
  title: {
    color: 'white',
    fontSize: 20,
  },
  itemtext: {
    fontSize: 15,
    color: '#eee',
  },
  item: {
    flex: 1,
    backgroundColor: 'cornflowerblue',
    padding: 10,
    margin: 5,
  },
});
