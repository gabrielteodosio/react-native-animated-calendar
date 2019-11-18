import './Config/ReactotronConfig';

import moment from 'moment';
import React, { useState, useCallback, useEffect } from 'react';
import { SafeAreaView, View, RefreshControl, Text, Image } from 'react-native';

import { data } from './Utils/mock';
import Agenda from './Components/Agenda';

const ITEM_HEIGHT = 80, ITEM_WIDTH = '100%';

function wait(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

function App() {
  const [fetchingData, setFetchingData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fakeFetch = useCallback(() => {
    setFetchingData(true);

    wait(1000).then(() => setFetchingData(false));
  }, [fetchingData]);

  useEffect(fakeFetch, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    wait(2000).then(() => setRefreshing(false));
  }, [refreshing]);

  function renderItem(item, index) {
    return (
      <View style={{ width: ITEM_WIDTH, height: ITEM_HEIGHT, flexDirection: 'row', alignItems: 'center' }}>
        {/* Date/time */}
        <View style={{ width: 80, alignItems: 'center', height: '100%' }}>
          <Text>{moment(item.period).format('HH:mm')}</Text>
        </View>
        {/* Content */}
        <View style={{ flexDirection: 'row', padding: 10, backgroundColor: 'rgba(241, 245, 251, 0.4)' }}>
          <Image
            resizeMode={'contain'}
            resizeMethod={'resize'}
            source={{ uri: item.profileImage }}
            style={{ width: 60, height: 60, borderRadius: 30 }}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            {/* Status Component */}
            <View style={{ backgroundColor: 'rgb(189, 219, 1)', width: 110, borderRadius: 5 }}>
              <Text style={{ textAlign: 'center', textTransform: 'uppercase' }}>
                {item.status}
              </Text>
            </View>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
              {item.name}
            </Text>
            <Text style={{ fontSize: 14, color: 'rgba(19,27,34,0.5)', textTransform: 'uppercase' }}>
              {item.location}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  const refreshControl = (
    <RefreshControl style={{ zIndex: -1 }} refreshing={refreshing} onRefresh={onRefresh}
                    colors={['rgba(251, 131, 51, 1)']}/>
  );

  const items = [...new Set(data.map((e) => moment(e.period).format('YYYY-MM-DD')))];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Agenda
        data={data}
        items={items}
        hasToggleButton
        dataStyle={'light'}
        loading={fetchingData}
        renderItem={renderItem}
        refreshControl={refreshControl}
        toggleButtonIcon={(isExpanded) => {
          console.tron.log({ isExpanded });
          return (
            <Text style={{ color: isExpanded ? 'rgba(251, 131, 51, 1)' : 'black' }}>Hello</Text>
          );
        }}
        vocabulary={{
          weekDays: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
        }}
        activityIndicatorProps={{
          size: 'large',
          style: { flex: 1 },
          color: 'rgba(251, 131, 51, 1)',
        }}
        calendarProps={{
          onSelectDate: fakeFetch,
          knobColor: 'rgba(251, 131, 51, 1)',
          selectedDateBackgroundColor: 'rgba(251, 131, 51, 1)',
          selectedWeekBackgroundColor: 'rgba(251, 131, 51, 0.1)',
        }}
      />
    </SafeAreaView>
  );
}

export default App;
