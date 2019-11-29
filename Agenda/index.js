import React, { useRef, useState } from 'react';
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

import Calendar, { CalendarDefaultProps, CalendarPropTypes } from '../Calendar';
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
  fontFamily,
  header,
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
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {typeof header === 'function' ? (
          header(expanded)
        ) : header}
        {hasToggleButton && toggleButtonIcon ? (
          <View style={{ overflow: 'hidden', borderRadius: 20 }}>
            <TouchableContainer
              onPress={toggleCalendar}
              style={{
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {typeof toggleButtonIcon === 'function' ? (
                toggleButtonIcon(expanded)
              ) : toggleButtonIcon}
            </TouchableContainer>
          </View>
        ) : null}
      </View>
      <Calendar
        {...calendarProps}
        items={items}
        ref={calendarRef}
        dataStyle={dataStyle}
        fontFamily={fontFamily}
        onChangeExpanded={setExpanded}
        onSelectDate={handleSelectDate}
        vocabulary={{ ...CalendarDefaultProps.vocabulary, ...vocabulary }}
      />
      {loading ? (
        <ActivityIndicator {...activityIndicatorProps} />
      ) : (
        <>
          {typeof dataTitle === 'function' ? (
            dataTitle(expanded)
          ) : dataTitle}
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
  dataTitle: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element
  ]),
  onSelectDate: PropTypes.func,
  hasToggleButton: PropTypes.bool,
  toggleButtonIcon: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element
  ]),
  appointmentListStyle: PropTypes.object,
  calendarProps: PropTypes.object,
  dataStyle: PropTypes.oneOf(['light', 'dark']),
  fontFamily: PropTypes.string,
  header: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element
  ]),
};

Agenda.defaultProps = {
  onSelectDate: () => {},
  items: [],
  dataStyle: 'light',
  hasToggleButton: true,
};

export default Agenda;
