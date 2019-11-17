import './Config/ReactotronConfig';

import React, { useState, useCallback, useEffect } from 'react';
import { SafeAreaView, View, RefreshControl, ActivityIndicator } from 'react-native';

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
    return <View style={{ height: ITEM_HEIGHT, width: ITEM_WIDTH }}/>;
  }

  const refreshControl = (
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['rgba(251, 131, 51, 1)']}/>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Agenda
        data={[1, 2, 3]}
        loading={fetchingData}
        renderItem={renderItem}
        refreshControl={refreshControl}
        activityIndicatorProps={{
          size: 'large',
          style: { flex: 1 },
          color: 'rgba(251, 131, 51, 1)',
        }}
        calendarProps={{
          onSelectDate: fakeFetch,
          items: ['2019-11-15', '2019-11-21'],
          selectedDateBackgroundColor: 'rgba(251, 131, 51, 1)',
          selectedWeekBackgroundColor: 'rgba(251, 131, 51, 0.1)',
        }}
      />
    </SafeAreaView>
  );
}

export default App;
