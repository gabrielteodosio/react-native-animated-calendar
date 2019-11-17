import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FlatList, View, ActivityIndicator } from 'react-native';

import Calendar, { CalendarPropTypes } from './Components/Calendar';

function Agenda({
  onSelectDate,
  calendarProps,
  loading,
  refreshing,
  refreshControl,
  data,
  dataTitle,
  onPressItem,
  renderItem,
  activityIndicatorProps,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [lastSelectedDate, setLastSelectedDate] = useState(null);

  function renderScrollItems({ item, index }) {
    return renderItem(item, index);
  }

  function handleSelectDate(date) {
    if (!lastSelectedDate || lastSelectedDate !== date) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }

    if (typeof calendarProps.onSelectDate === 'function') {
      calendarProps.onSelectDate(date);
    } else {
      onSelectDate(date);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <Calendar
        {...calendarProps}
        collapsed={collapsed}
        onSelectDate={handleSelectDate}
      />
      {loading ? (
        <ActivityIndicator {...activityIndicatorProps} />
      ) : (
        <>
          {typeof dataTitle === 'string' ? (
            <Text>{dataTitle}</Text>
          ) : undefined}
          <FlatList
            data={data}
            refreshing={refreshing}
            renderItem={renderScrollItems}
            refreshControl={refreshControl}
            style={{ flex: 1, paddingVertical: 5 }}
            keyExtractor={(item, index) => `$agenda-item-${index}`}
          />
        </>
      )}
    </View>
  );
}

Agenda.propTypes = {
  data: PropTypes.array,
  dataTitle: PropTypes.string,
  onSelectDate: PropTypes.func,
  calendarProps: PropTypes.shape({
    ...CalendarPropTypes,
  }),
};

Agenda.defaultProps = {
  onSelectDate: () => {
  },
  calendarProps: undefined,
};

export default Agenda;
