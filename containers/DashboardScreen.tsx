/* eslint-disable global-require */
import React, { useEffect, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
// @ts-ignore
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesome5 } from '@expo/vector-icons';

import * as Device from 'expo-device';
// import { SortableContainer, SortableGrid, SortableTile } from './drag-and-sort';
// import SortableGrid from 'react-native-sortable-grid';
import { ApplicationStyles, Colors, Fonts } from '../theme';
import { RootStackParamList } from '../navigation/RootStackParamList';
import { getUser, resetUser, setStrapiID } from '../redux/user';
import SearchBar from '../components/SearchBar';
import FeatureTile from '../components/FeatureTile';
import DashboardLibraryTile from '../components/DashboardLibraryTile';
import AccountDetailsPanel from '../components/AccountDetailsPanel';

import { useGetFoldersStrapiQuery, useGetMeQuery } from '../services/wpApi';
import { getRootFolders } from '../utils/getRootFolders';
import MiniButton from '../components/MiniButton';
import logoutAsync from '../redux/user/logoutAsync';
import { getOrder, setOrder } from '../redux/dashboard';
import SearchResults from '../components/SearchResults';
import { getCanShowItems } from '../utils/getCanShowItems';
import {
  appendLog,
  clearLog,
  getPersistLog,
  getPushToken,
} from '../redux/persist';
import { format } from 'date-fns';
import loadActivitiesAsync from '../redux/user/loadActivitiesAsync';
import { useFocusEffect } from '@react-navigation/native';

type DashboardScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'DashboardScreen'
>;

type Props = {
  navigation: DashboardScreenNavigationProp;
};

export default function DashboardScreen({ navigation }: Props) {
  const user = useSelector(getUser);
  const logs = useSelector(getPersistLog);
  // console.log(
  //   '🚀 ~ file: DashboardScreen.tsx ~ line 61 ~ DashboardScreen ~ user',
  //   user
  // );
  StatusBar.setBarStyle('light-content', true);
  const dispatch = useDispatch();

  // console.log(`user:: ${user?.displayName}`);
  const { data: me } = useGetMeQuery();
  // console.log('🚀 ~ file: DashboardScreen.tsx ~ line 69 ~ useEffect ~ me', me);

  useEffect(() => {
    if (me) {
      dispatch(setStrapiID(me.id));
    }
    // console.log(
    //   '🚀 ~ file: DashboardScreen.tsx ~ line 47 ~ DashboardScreen ~ user',
    //   user
    // );
  }, [dispatch, me, user]);

  const {
    data: quickLinks,
    isFetching, // refetching
    isLoading, // initial load
    error,
    refetch,
  } = useGetFoldersStrapiQuery();
  // console.log(
  //   '🚀 ~ file: DashboardScreen.tsx ~ line 70 ~ DashboardScreen ~ quickLinks',
  //   quickLinks
  // );
  // console.log(
  //   '🚀 ~ file: DashboardScreen.tsx ~ line 54 ~ DashboardScreen ~ `Bearer ${user?.token}`',
  //   `Bearer ${user?.token}`
  // );
  // console.log(
  //   '🚀 ~ file: DashboardScreen.tsx ~ line 54 ~ DashboardScreen ~ error',
  //   error
  // );
  // console.log(
  //   '🚀 ~ file: DashboardScreen.tsx ~ line 26 ~ DashboardScreen ~ quickLinks',
  //   quickLinks
  // );

  const weightedFolders = getRootFolders(quickLinks)?.filter((ele) => {
    // console.log('weight', ele.weight);
    return ele.weight !== null;
  });

  const rootFolders = getRootFolders(
    quickLinks?.filter((ele) => {
      if (ele.weight === null) {
        return true;
      }
      //   const datenow = new Date().setHours(0, 0, 0, 0);

      //   if (ele?.startDate) {
      //     const parts = ele?.startDate.toString().split('-');
      //     const parsedStartDate = new Date(
      //       parts[0],
      //       parts[1] - 1,
      //       parts[2]
      //     ).getTime();

      //     if (parsedStartDate > datenow) {
      //       return false;
      //     }
      //   }
      //   if (ele?.endDate) {
      //     const parts = ele?.endDate.toString().split('-');
      //     const parsedEndDate = new Date(
      //       parts[0],
      //       parts[1] - 1,
      //       parts[2]
      //     ).getTime();
      //     if (parsedEndDate < datenow) {
      //       return false;
      //     }
      //   }
      //   return true;
      // }
      return false;
    })
  );

  const rootFoldersDate = getCanShowItems(
    rootFolders,
    me?.email,
    me?.location?.location
  );

  // rootFolders.sort(sortByKeys('weight', 'name', 'desc'));

  // console.log(
  //   '🚀 ~ file: DashboardScreen.tsx ~ line 71 ~ DashboardScreen ~ rootFolders',
  //   rootFolders
  // );

  const handleLogout = () => {
    dispatch(logoutAsync());
  };
  const [isDragging, setIsDragging] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [accountDetailsVisible, setAccountDetailsVisible] = useState(false);
  const [orientation, setOrientation] = useState('PORTRAIT');
  const [landscapeWidth, setLandscapeWidth] = useState('20%');
  const [portraitWidth, setPortraitWidth] = useState('25%');
  const [isPhone, setIsPhone] = useState(false);

  const [searchText, setSearchText] = useState('');

  const determineAndSetOrientation = () => {
    const { width } = Dimensions.get('window');
    const { height } = Dimensions.get('window');

    if (width < height) {
      setOrientation('PORTRAIT');
    } else {
      setOrientation('LANDSCAPE');
    }
  };

  useEffect(() => {
    determineAndSetOrientation();
    Dimensions.addEventListener('change', determineAndSetOrientation);
    Device.getDeviceTypeAsync().then((deviceType) => {
      if (deviceType === Device.DeviceType.PHONE) {
        setLandscapeWidth('33%');
        setPortraitWidth('50%');
        setIsPhone(true);
      } else if (deviceType === Device.DeviceType.TABLET) {
        setLandscapeWidth('20%');
        setPortraitWidth('25%');
        setIsPhone(false);
      }
    });

    return () => {
      Dimensions.removeEventListener('change', determineAndSetOrientation);
    };
  }, []);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     // const timeout = setTimeout(() => {
  //     dispatch(loadActivitiesAsync());
  //     // }, 200);
  //     return () => {
  //       // if (timeout) clearTimeout(timeout);
  //     };
  //   }, [dispatch])
  // );

  const features = [
    {
      id: 'Sales Mockup',
      name: 'Sales Mockup',
      url: 'SalesMockupScreen',
      icon: require('../assets/img/icon-camera.png'),
      type: 'features',
    },
    {
      id: 'Image gallery',
      name: 'Image gallery',
      url: 'ImageGalleryScreen',
      icon: require('../assets/img/icon-gallery.png'),
      type: 'features',
    },
    {
      id: 'Maximizing Profitability',
      name: 'Maximizing Profitability',
      url: 'MaximizingProfitabilityScreen',
      icon: require('../assets/img/icon-profit.png'),
      type: 'features',
    },
    // {
    // id: 3,

    //   name: 'Freestyle profitability',
    //   url: 'FreestyleProfitabilityScreen',
    //   icon: require('../assets/img/icon-freestyle.png'),
    // },
    {
      id: 'Reports',
      name: 'Reports',
      url: 'ReportsScreen',
      icon: require('../assets/img/icon-report.png'),
      type: 'features',
    },
    // {
    //   name: 'channel presentations',
    //   url: 'ChannelPresentationsScreen',
    //   icon: require('../assets/img/icon-presentations.png'),
    // },
    // {
    //   name: 'Freestyle',
    //   url: 'FreestyleScreen',
    //   icon: require('../assets/img/icon-quick-link-presentation.png'),
    // },
    // {
    //   name: 'Testimonials',
    //   url: 'TestimonialsScreen',
    //   icon: require('../assets/img/icon-quick-link-video.png'),
    // },
  ];
  const width = orientation === 'PORTRAIT' ? portraitWidth : landscapeWidth;
  const reOrderTile = (pos: any, unordered?: any) => {
    let sortable: any[][] = [];
    Object.keys(pos).forEach((key) => {
      if (unordered) {
        const ifExist = unordered.filter((tile) => {
          return tile.id.toString() === key;
        });
        if (ifExist.length > 0) {
          sortable.push([key, pos[key]]);
        }
      } else {
        sortable.push([key, pos[key]]);
      }
    });

    sortable.sort(function (a, b) {
      return a[1] - b[1];
    });
    console.log(
      '🚀 ~ file: DashboardScreen.tsx ~ line 272 ~ Object.keys ~ sortable',
      sortable.length
    );

    let tilePositions: {};
    for (let i = 0; i < sortable.length; i++) {
      console.log(
        '🚀 ~ file: DashboardScreen.tsx ~ line 675 ~ sortable[i]',
        sortable[i][1]
      );
      if (i === sortable[i][1]) {
        tilePositions = {
          ...tilePositions,
          [sortable[i][0]]: sortable[i][1],
        };
      } else {
        tilePositions = {
          ...tilePositions,
          [sortable[i][0]]: i,
        };
      }
    }
    return tilePositions;
  };
  let tileOrder = useSelector(getOrder);
  const [savedPosition, setSavedPosition] = useState(null);
  // console.log(
  //   '🚀 ~ file: DashboardScreen.tsx ~ line 228 ~ DashboardScreen ~ tileOrder',
  //   tileOrder
  // );
  const unorderedTiles = [...features, ...weightedFolders, ...rootFoldersDate];
  console.log(
    '🚀 ~ file: DashboardScreen.tsx ~ line 274 ~ unorderedTiles',
    unorderedTiles?.length
  );
  let tiles: any[] = [];

  if (tileOrder) {
    console.log(
      '🚀 ~ file: DashboardScreen.tsx ~ line 277 ~ tileOrder',
      tileOrder
    );

    if (Object.keys(tileOrder).length > unorderedTiles.length) {
      tileOrder = reOrderTile(tileOrder, unorderedTiles);
      dispatch(setOrder(tileOrder));

      console.log(
        '🚀 ~ file: DashboardScreen.tsx ~ line 317 ~ reOrderTile',
        tileOrder
      );
    }

    let newTileCount = 0;
    unorderedTiles.forEach((tile) => {
      let newTile = false;
      Object.keys(tileOrder).forEach((key) => {
        if (tile.id.toString() === key) {
          newTile = true;
          console.log(
            '🚀 ~ file: DashboardScreen.tsx ~ line 283 ~ unorderedTiles.forEach ~ tileOrder[key]',
            tileOrder[key]
          );

          tiles[tileOrder[key]] = tile;
        }
      });
      if (!newTile) {
        console.log(
          '🚀 ~ file: DashboardScreen.tsx ~ line 301 ~ unorderedTiles.forEach ~ Object.keys(tileOrder).length',
          Object.keys(tileOrder).length
        );

        tiles[Object.keys(tileOrder).length + newTileCount] = tile;
        newTileCount += 1;
      }
    });

    // Object.keys(tileOrder).forEach((key) => {
    //   unorderedTiles.forEach((tile) => {
    //     if (tile.id.toString() === key) {
    //       console.log(
    //         '🚀 ~ file: DashboardScreen.tsx ~ line 283 ~ unorderedTiles.forEach ~ tileOrder[key]',
    //         tileOrder[key]
    //       );

    //       tiles[tileOrder[key]] = tile;
    //     }
    //   });
    // });
  } else {
    tiles = unorderedTiles;
  }

  console.log(
    '🚀 ~ file: DashboardScreen.tsx ~ line 226 ~ DashboardScreen ~ tiles',
    tiles.length
  );

  if (error) {
    console.log(
      '🚀 ~ file: DashboardScreen.tsx ~ line 195 ~ DashboardScreen ~ error',
      error
    );
    return (
      <View style={ApplicationStyles.mainContainer}>
        <View style={styles.container}>
          <Text>
            Error: {error?.error || error?.data?.message || 'unknown error'}
          </Text>
          <View style={{ height: 20 }} />
          <MiniButton onPress={() => dispatch(resetUser())} text="Logout" />
        </View>
      </View>
    );
  }

  if (isSearching && searchText !== '') {
    return (
      <View style={ApplicationStyles.mainContainer}>
        <SearchBar
          setSearchText={setSearchText}
          searchText={searchText}
          onClose={() => {
            setSearchText('');
            setIsSearching(false);
          }}
          onPress={() => {
            if (searchText !== '') {
              setIsSearching(true);

              // navigation.navigate('SearchResultScreen', { searchText });
            }
          }}
        />

        <View style={styles.container}>
          <ScrollView
            style={{ width: '100%' }}
            refreshControl={
              <RefreshControl
                refreshing={isFetching}
                onRefresh={async () => {
                  await refetch();
                }}
              />
            }
          >
            <View
              style={{
                ...styles.tileContainer,
              }}
            >
              <SearchResults searchText={searchText} />
            </View>
          </ScrollView>
          {isPhone ? (
            <View style={styles.footer}>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  // height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  // margin: 20,
                  marginLeft: 10,
                  marginRight: 5,
                  width: '50%',
                }}
              >
                <FontAwesome5
                  name="user-alt"
                  size={35}
                  color={Colors.swireLightGray}
                />
                <View>
                  <Text
                    style={{
                      ...Fonts.style.text20,
                      textAlign: 'left',
                      // color: Colors.swireRed,
                      marginLeft: 10,
                    }}
                  >
                    Hello
                  </Text>
                  <Text
                    style={{
                      ...Fonts.style.text20,
                      color: Colors.swireSuperDarkGray,
                      marginLeft: 10,
                      textAlign: 'left',
                    }}
                  >
                    {user?.displayName}
                  </Text>
                </View>
              </View>
              <View
                style={
                  {
                    // position: 'absolute',
                    // right: 30,
                    // bottom: 20,
                    // alignSelf: 'flex-end',
                  }
                }
              >
                <TouchableOpacity
                  style={styles.accountDetailsBtn}
                  onPress={() => {
                    setAccountDetailsVisible(true);
                  }}
                >
                  <Text
                    style={{
                      ...Fonts.style.tileText,
                      color: Colors.white,
                      paddingHorizontal: 5,
                    }}
                  >
                    ACCOUNT DETAILS
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.footer}>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'flex-start',
                  // height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 20,
                  marginLeft: 40,
                }}
              >
                <FontAwesome5
                  name="user-alt"
                  size={50}
                  color={Colors.swireLightGray}
                />
                <Text
                  style={{
                    ...Fonts.style.text20,
                    // color: Colors.swireRed,
                    marginLeft: 20,
                  }}
                >
                  Hello
                </Text>
                <Text
                  style={{
                    ...Fonts.style.text20,
                    color: Colors.swireSuperDarkGray,
                    marginLeft: 10,
                  }}
                >
                  {user?.displayName}
                </Text>
              </View>
              <View
                style={{
                  position: 'absolute',
                  right: 30,
                  // bottom: 20,
                }}
              >
                <TouchableOpacity
                  style={styles.accountDetailsBtn}
                  onPress={() => {
                    setAccountDetailsVisible(true);
                  }}
                >
                  <Text
                    style={{
                      ...Fonts.style.tileText,
                      color: Colors.white,
                      paddingHorizontal: 10,
                    }}
                  >
                    ACCOUNT DETAILS
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <AccountDetailsPanel
          setVisibility={setAccountDetailsVisible}
          visibility={accountDetailsVisible}
          logout={handleLogout}
        />
      </View>
    );
  }
  return (
    <View style={ApplicationStyles.mainContainer}>
      <SearchBar
        setSearchText={setSearchText}
        searchText={searchText}
        onClose={() => {
          setSearchText('');
          setIsSearching(false);
        }}
        onPress={() => {
          if (searchText !== '') {
            setIsSearching(true);

            // navigation.navigate('SearchResultScreen', { searchText });
          }
        }}
      />
      <View style={styles.container}>
        {isDragging && (
          <View
            style={{
              // borderWidth: 1,
              justifyContent: 'center',
              alignItems: 'flex-end',
              display: 'flex',
              width: '100%',
              paddingBottom: 10,
              // position: 'absolute',
              // top: 0,
              // left: 0,
              // right: 0,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setIsDragging(false);
                dispatch(setOrder(savedPosition));
              }}
              style={{
                backgroundColor: Colors.swireRed,
                paddingHorizontal: 15,
                paddingVertical: 10,
                marginRight: 10,
                // position: 'absolute',
                // left: 0,
              }}
            >
              <Text
                style={{
                  fontFamily: Fonts.type.base,
                  color: Colors.white,
                  fontSize: isPhone ? 15 : 20,
                }}
              >
                Done
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <ScrollView
          style={{ width: '100%' }}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={async () => {
                await Promise.all([refetch(), dispatch(loadActivitiesAsync())]);
              }}
            />
          }
        >
          {/* {logs?.map(({ ts, message }) => (
            <Text key={`log_${ts}`}>
              {format(new Date(ts), 'LLL-d hh:mm:ss aaa')}: {message}
            </Text>
          ))}
          <MiniButton
            onPress={() => dispatch(appendLog('hello'))}
            text="append log"
          ></MiniButton>
          <MiniButton
            onPress={() => dispatch(clearLog())}
            text="clear logs"
          ></MiniButton> */}
          {isDragging ? (
            <View style={{ position: 'relative' }}>
              {/* <View
                style={{
                  // borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  display: 'flex',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setIsDragging(false);
                    dispatch(setOrder(savedPosition));
                  }}
                  style={{
                    backgroundColor: Colors.swireRed,
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    marginRight: 10,
                    // position: 'absolute',
                    // left: 0,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Fonts.type.base,
                      color: Colors.white,
                      fontSize: isPhone ? 15 : 20,
                    }}
                  >
                    Done
                  </Text>
                </TouchableOpacity>
              </View> */}

              <View
                style={{
                  ...styles.tileContainer,
                  // paddingTop: 50,
                  // borderWidth: 2,
                  // borderColor: 'black',
                  // paddingLeft: 10,
                  // flexDirection: 'column',
                  // flex: 1,
                }}
              >
                <SortableContainer
                  customconfig={{
                    COL: orientation === 'LANDSCAPE' ? 5 : 4,
                    MARGIN: 10,
                    SIZE:
                      (Dimensions.get('window').width * parseFloat(width)) /
                        100 -
                      10,
                  }}
                >
                  <SortableGrid
                    editing
                    onDragEnd={(positions) => {
                      console.log(JSON.stringify(positions, null, 2));
                      const tilePositions = reOrderTile(positions);

                      setSavedPosition(tilePositions);
                    }}
                  >
                    {tiles.map((tile: any, index) => {
                      if (tile?.type === 'features') {
                        return (
                          <SortableTile
                            onLongPress={() => {
                              console.log('long press');
                            }}
                            key={`feature_id_${tile.name}${tile.url}`}
                            id={tile.id}
                          >
                            <FeatureTile
                              // key={`feature_id_${feature.name}${feature.url}`}
                              name={tile.name}
                              icon={tile.icon}
                              width={width}
                              onLongPress={() => {
                                console.log(
                                  '🚀 ~ file: DashboardScreen.tsx ~ line 326 ~ {tiles.map ~ setIsDragging(true)'
                                );
                                setIsDragging(true);
                              }}
                              onPress={() => {
                                if (tile.name === 'channel presentations') {
                                  console.log(
                                    'entering channel presentations page'
                                  );
                                  navigation.navigate('FolderStackNavigation', {
                                    screen: 'FolderScreen',
                                    params: {
                                      termID: weightedFolders[0].id,
                                      folderName: weightedFolders[0].name,
                                    },
                                  });
                                } else if (tile.name === 'Freestyle') {
                                  console.log('entering freestyle page');

                                  navigation.navigate('FolderStackNavigation', {
                                    screen: 'FolderScreen',
                                    params: {
                                      termID: weightedFolders[2].id,
                                      folderName: weightedFolders[2].name,
                                    },
                                  });
                                } else if (tile.name === 'Testimonials') {
                                  console.log('entering Testimonials page');

                                  navigation.navigate('FolderStackNavigation', {
                                    screen: 'FolderScreen',
                                    params: {
                                      termID: weightedFolders[1].id,
                                      folderName: weightedFolders[1].name,
                                    },
                                  });
                                } else if (tile.name === 'Sales Mockup') {
                                  navigation.navigate('SalesMockupScreen', {
                                    clear: new Date().valueOf(),
                                  });
                                } else {
                                  navigation.navigate(tile.url);
                                }
                              }}
                            />
                          </SortableTile>
                        );
                      }
                      return (
                        <SortableTile
                          onLongPress={() => {
                            console.log('long press');
                          }}
                          key={`sortable_id_${tile.name}${tile.url}`}
                          id={tile.id}
                        >
                          <DashboardLibraryTile
                            // key={`library_id_${quickLink.id}`}
                            folder={tile}
                            width={width}
                            onPress={() => {
                              // Start Navigation in the FolderStack
                              navigation.navigate('FolderStackNavigation', {
                                screen: 'FolderScreen',
                                params: {
                                  termID: tile.id,
                                  folderName: tile.name,
                                },
                              });
                            }}
                          />
                        </SortableTile>
                      );
                    })}
                  </SortableGrid>
                </SortableContainer>
              </View>
            </View>
          ) : (
            <View style={styles.tileContainer}>
              {tiles.map((tile: any, index) => {
                if (tile?.type === 'features') {
                  return (
                    <FeatureTile
                      key={`feature2_id_${tile.name}${tile.url}`}
                      name={tile.name}
                      icon={tile.icon}
                      width={width}
                      onLongPress={() => {
                        console.log(
                          '🚀 ~ file: DashboardScreen.tsx ~ line 326 ~ {tiles.map ~ setIsDragging(true)'
                        );
                        setIsDragging(true);
                      }}
                      onPress={() => {
                        if (tile.name === 'channel presentations') {
                          console.log('entering channel presentations page');
                          navigation.navigate('FolderStackNavigation', {
                            screen: 'FolderScreen',
                            params: {
                              termID: weightedFolders[0].id,
                              folderName: weightedFolders[0].name,
                            },
                          });
                        } else if (tile.name === 'Freestyle') {
                          console.log('entering freestyle page');

                          navigation.navigate('FolderStackNavigation', {
                            screen: 'FolderScreen',
                            params: {
                              termID: weightedFolders[2].id,
                              folderName: weightedFolders[2].name,
                            },
                          });
                        } else if (tile.name === 'Testimonials') {
                          console.log('entering Testimonials page');

                          navigation.navigate('FolderStackNavigation', {
                            screen: 'FolderScreen',
                            params: {
                              termID: weightedFolders[1].id,
                              folderName: weightedFolders[1].name,
                            },
                          });
                        } else if (tile.name === 'Sales Mockup') {
                          navigation.navigate('SalesMockupScreen', {
                            clear: new Date().valueOf(),
                          });
                        } else {
                          navigation.navigate(tile.url);
                        }
                      }}
                    />
                  );
                }
                return (
                  <DashboardLibraryTile
                    key={`sortable2_id_${tile.name}${tile.url}`}
                    folder={tile}
                    width={width}
                    onLongPress={() => {
                      console.log(
                        '🚀 ~ file: DashboardScreen.tsx ~ line 326 ~ {tiles.map ~ setIsDragging(true)'
                      );
                      setIsDragging(true);
                    }}
                    onPress={() => {
                      // Start Navigation in the FolderStack
                      navigation.navigate('FolderStackNavigation', {
                        screen: 'FolderScreen',
                        params: {
                          termID: tile.id,
                          folderName: tile.name,
                        },
                      });
                    }}
                  />
                );
              })}
            </View>
          )}
        </ScrollView>
        {isPhone ? (
          <View style={styles.footer}>
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                // height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                // margin: 20,
                marginLeft: 10,
                marginRight: 5,
                width: '50%',
              }}
            >
              <FontAwesome5
                name="user-alt"
                size={35}
                color={Colors.swireLightGray}
              />
              <View>
                <Text
                  style={{
                    ...Fonts.style.text20,
                    textAlign: 'left',
                    // color: Colors.swireRed,
                    marginLeft: 10,
                  }}
                >
                  Hello
                </Text>
                <Text
                  style={{
                    ...Fonts.style.text20,
                    color: Colors.swireSuperDarkGray,
                    marginLeft: 10,
                    textAlign: 'left',
                  }}
                >
                  {user?.displayName}
                </Text>
              </View>
            </View>
            <View
              style={
                {
                  // position: 'absolute',
                  // right: 30,
                  // bottom: 20,
                  // alignSelf: 'flex-end',
                }
              }
            >
              <TouchableOpacity
                style={styles.accountDetailsBtn}
                onPress={() => {
                  setAccountDetailsVisible(true);
                }}
              >
                <Text
                  style={{
                    ...Fonts.style.tileText,
                    color: Colors.white,
                    paddingHorizontal: 5,
                  }}
                >
                  ACCOUNT DETAILS
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.footer}>
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'flex-start',
                // height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                margin: 20,
                marginLeft: 40,
              }}
            >
              <FontAwesome5
                name="user-alt"
                size={50}
                color={Colors.swireLightGray}
              />
              <Text
                style={{
                  ...Fonts.style.text20,
                  // color: Colors.swireRed,
                  marginLeft: 20,
                }}
              >
                Hello
              </Text>
              <Text
                style={{
                  ...Fonts.style.text20,
                  color: Colors.swireSuperDarkGray,
                  marginLeft: 10,
                }}
              >
                {user?.displayName}
              </Text>
            </View>
            <View
              style={{
                position: 'absolute',
                right: 30,
                // bottom: 20,
              }}
            >
              <TouchableOpacity
                style={styles.accountDetailsBtn}
                onPress={() => {
                  setAccountDetailsVisible(true);
                }}
              >
                <Text
                  style={{
                    ...Fonts.style.tileText,
                    color: Colors.white,
                    paddingHorizontal: 10,
                  }}
                >
                  ACCOUNT DETAILS
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <AccountDetailsPanel
        setVisibility={setAccountDetailsVisible}
        visibility={accountDetailsVisible}
        logout={handleLogout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.swireLightGray,
    paddingVertical: 10,
  },
  tileContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 90,
    display: 'flex',
    // marginLeft: 20,
  },

  footer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    width: '100%',
    height: 90,
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
  accountDetailsBtn: {
    backgroundColor: Colors.swireRed,
    padding: 10,
    marginRight: 30,
  },
  accountDetailsText: {
    color: 'white',
    fontSize: 20,
  },
  greetingText: {
    fontSize: 20,
    color: Colors.swireDarkGray,
    fontWeight: 'bold',
  },
  tile: {
    backgroundColor: 'green',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 90,
  },
  text: {
    fontSize: 28,
    color: 'blue',
    fontWeight: 'bold',
  },
});
