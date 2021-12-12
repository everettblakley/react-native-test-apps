import React, { FC, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, View, Text, FlatList } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import data from './data.json';
import tailwind from 'tailwind-rn';

enum DrawerState {
  open = 'open',
  preview = 'preview',
  closed = 'closed',
}

interface ListItemProps {
  _id: string;
  guid: string;
  name: string;
  about: string;
}

const ListItemView: FC<ListItemProps> = ({ name, about }) => {
  return (
    <View style={tailwind('py-2')}>
      <Text style={tailwind('text-gray-800 text-lg mb-2')}>{name}</Text>
    </View>
  );
};

export const RootPage: FC = () => {
  const [drawerState, setDrawerState] = useState<DrawerState>(
    DrawerState.closed
  );
  const { height } = useSafeAreaFrame();
  const { bottom } = useSafeAreaInsets();
  const drawerHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let newHeight: number;
    switch (drawerState) {
      case DrawerState.closed:
        newHeight = 0;
        break;
      case DrawerState.open:
        newHeight = height / 2;
        break;
      default:
        newHeight = height / 4;
        break;
    }

    Animated.spring(drawerHeight, {
      toValue: newHeight,
      useNativeDriver: false,
    }).start();
  }, [drawerState]);

  const toggleDrawer = () => {
    switch (drawerState) {
      case DrawerState.closed:
        setDrawerState(DrawerState.preview);
        break;
      case DrawerState.open:
        setDrawerState(DrawerState.closed);
        break;
      default:
        setDrawerState(DrawerState.open);
        break;
    }
  };

  return (
    <SafeAreaView
      edges={['left', 'right']}
      style={tailwind('flex-1 bg-blue-100')}
    >
      <Animated.View
        style={[
          tailwind('items-center justify-center'),
          {
            height: drawerHeight.interpolate({
              inputRange: [0, height],
              outputRange: [height, 0],
            }),
          },
        ]}
      >
        <Text style={tailwind('text-2xl font-medium mb-4')}>Main</Text>
        <Pressable
          style={({ pressed }) =>
            tailwind(
              `rounded bg-blue-${
                pressed ? 800 : 700
              } items-center justify-center px-4 py-2`
            )
          }
          onPress={toggleDrawer}
        >
          <Text style={tailwind('text-white font-semibold uppercase')}>
            {drawerState === DrawerState.closed
              ? 'Open Drawer'
              : drawerState === DrawerState.preview
              ? 'Open Drawer More'
              : 'Close Drawer'}
          </Text>
        </Pressable>
      </Animated.View>
      <View
        style={[
          tailwind(
            'flex-1 bg-white items-center justify-start bg-white pt-4 rounded-t-2xl'
          ),
          { paddingBottom: bottom + 8 },
        ]}
      >
        <Pressable
          style={({ pressed }) =>
            tailwind(
              `h-2 w-12 self-center bg-gray-${pressed ? 400 : 200} rounded-full`
            )
          }
        />
        <View style={tailwind('mt-8 self-stretch px-4')}>
          <FlatList
            contentContainerStyle={tailwind('w-full')}
            data={data}
            renderItem={({ item }: { item: ListItemProps }) => (
              <ListItemView key={item.guid} {...item} />
            )}
            ItemSeparatorComponent={() => (
              <View style={tailwind('border-b border-gray-100')} />
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
