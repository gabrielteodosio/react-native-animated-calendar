import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  Text,
  View,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  TouchableNativeFeedback,
} from 'react-native';

import Calendar, { CalendarDefaultProps, CalendarPropTypes } from './Components/Calendar';
import styles from './styles';

function TouchableAndroid({ disabled, onPress, useForeground, rippleColor, borderless, children, ...props }) {
  return (
    <TouchableNativeFeedback
      {...{ onPress, useForeground, disabled }}
      background={TouchableNativeFeedback.Ripple(rippleColor, borderless)}
    >
      <View {...props}>
        {children}
      </View>
    </TouchableNativeFeedback>
  );
}

const TouchableContainer = Platform.select({
  ios: TouchableOpacity,
  android: TouchableAndroid,
});

function Agenda({
  onSelectDate,
  calendarProps,
  loading,
  refreshing,
  refreshControl,
  data,
  items,
  dataTitle,
  dataStyle,
  renderItem,
  vocabulary,
  hasToggleButton,
  toggleButtonIcon,
  appointmentListStyle,
  activityIndicatorProps,
}) {
  const calendarRef = useRef();
  const [expanded, setExpanded] = useState(CalendarDefaultProps.defaultExpanded);

  function renderScrollItems({ item, index }) {
    return renderItem(item, index);
  }

  function handleSelectDate(date) {
    if (typeof calendarProps.onSelectDate === 'function') {
      calendarProps.onSelectDate(date);
    } else {
      onSelectDate(date);
    }
  }

  function toggleCalendar() {
    calendarRef.current.changeLayout();
  }

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{ paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Text style={{ fontSize: 33, color: dataStyle === 'light' ? 'rgb(36, 42, 50)' : 'white' }}>
          Agenda
        </Text>
        {hasToggleButton && toggleButtonIcon ? (
          <View
            style={{
              overflow: 'hidden',
              borderRadius: 20,
            }}
          >
            <TouchableContainer
              onPress={toggleCalendar}
              style={{
                height: 40,
                width: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {toggleButtonIcon(expanded)}
            </TouchableContainer>
          </View>
        ) : null}
      </View>
      <Calendar
        {...calendarProps}
        ref={calendarRef}
        items={items}
        dataStyle={dataStyle}
        onChangeExpanded={setExpanded}
        onSelectDate={handleSelectDate}
        vocabulary={{ ...CalendarDefaultProps.vocabulary, ...vocabulary }}
      />
      {loading ? (
        <ActivityIndicator {...activityIndicatorProps} />
      ) : (
        <>
          {dataTitle}
          <FlatList
            data={data}
            refreshing={refreshing}
            renderItem={renderScrollItems}
            refreshControl={refreshControl}
            style={{ ...styles.appointmentList, ...appointmentListStyle }}
            keyExtractor={(item, index) => `$agenda-item-${index}`}
          />
        </>
      )}
    </View>
  );
}

Agenda.propTypes = {
  data: PropTypes.array,
  items: PropTypes.array,
  dataTitle: PropTypes.element,
  onSelectDate: PropTypes.func,
  hasToggleButton: PropTypes.bool,
  toggleButtonIcon: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element
  ]),
  appointmentListStyle: PropTypes.object,
  calendarProps: PropTypes.object,
  dataStyle: PropTypes.oneOf(['light', 'dark']),
};

Agenda.defaultProps = {
  onSelectDate: () => {
  },
  calendarProps: undefined,
  items: [],
  hasToggleButton: true,
  toggleButtonIcon: undefined,
  appointmentListStyle: undefined,
  dataStyle: 'light',
};

export default Agenda;
