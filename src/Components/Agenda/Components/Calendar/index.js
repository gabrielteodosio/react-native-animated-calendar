import React, { useState, useEffect } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, LayoutAnimation, UIManager } from 'react-native';

import styles from './styles';

// Only used for vocabulary
const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril',
  'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro',
  'Novembro', 'Dezembro'];

// Only used for vocabulary
const weekDays = [
  'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb',
];

// Get actual year
const year = moment().year();

// Get the quantity of days for a specific date
const nDays = [
  moment([year, 0, 1]).daysInMonth(),  // January
  moment([year, 1, 1]).daysInMonth(),  // February
  moment([year, 2, 1]).daysInMonth(),  // March
  moment([year, 3, 1]).daysInMonth(),  // April
  moment([year, 4, 1]).daysInMonth(),  // May
  moment([year, 5, 1]).daysInMonth(),  // June
  moment([year, 6, 1]).daysInMonth(),  // July
  moment([year, 7, 1]).daysInMonth(),  // August
  moment([year, 8, 1]).daysInMonth(),  // September
  moment([year, 9, 1]).daysInMonth(),  // October
  moment([year, 10, 1]).daysInMonth(), // November
  moment([year, 11, 1]).daysInMonth(), // December
];

/**
 * The following function generates a matrix of days in
 * the format that is human readable. If it is needed to know
 * how it works, please read about it at:
 *
 * https://code.tutsplus.com/tutorials/how-to-create-a-react-native-calendar-component--cms-33664
 *
 * @param moment
 * @returns {[*]}
 */
function generateMatrix(moment) {
  const matrix = [weekDays];

  const month = moment.month();
  const firstDay = new Date(year, month, 1).getDay();

  let counter = 1;
  const maxDays = nDays[month];

  for (let row = 1; row < 7; row++) {
    matrix[row] = [];
    for (let col = 0; col < 7; col++) {
      matrix[row][col] = -1;
      if (row === 1 && col >= firstDay) {
        matrix[row][col] = counter++;
      } else if (row > 1 && counter <= maxDays) {
        matrix[row][col] = counter++;
      }
    }
  }

  return matrix;
}

function Calendar({
  onSelectDate,
  leftArrow,
  rightArrow,
  style,
  headerContainerStyle,
  headerMonthStyle,
  headerYearStyle,
  arrowLeftContainerStyle,
  arrowRightContainerStyle,
  dayStyle,
  selectedDateBackgroundColor,
  selectedWeekBackgroundColor,
  items,
  hasKnob,
  knobColor,
  ...props
}) {
  const [activeDate, setActiveDate] = useState(moment());
  const [selectedRow, setSelectedRow] = useState(undefined);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [matrix, setMatrix] = useState(generateMatrix(activeDate));
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    handleDatePress(activeDate.date());

    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  function handleDatePress(item, rowIndex) {
    const date = moment([activeDate.year(), activeDate.month(), item]);

    if (date.isSame(selectedDate)) {
      changeLayout();
    }

    onSelectDate(date);
    setSelectedDate(date);
    setSelectedRow(rowIndex);
  }

  function handleNextPress() {
    setActiveDate(activeDate.add(moment.duration(1, 'month')));
    setMatrix(generateMatrix(activeDate));
  }

  function handlePreviousPress() {
    setActiveDate(activeDate.subtract(moment.duration(1, 'month')));
    setMatrix(generateMatrix(activeDate));
  }

  // Collapse and Reverse
  function changeLayout() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setExpanded(!expanded);
  }

  // TODO: Implement a better way of rendering dots
  function renderDot(item) {
    const date = moment([activeDate.year(), activeDate.month(), item]).format('YYYY-MM-DD');

    if (items.includes(date)) {
      return <View style={{
        width: 4,
        bottom: 5,
        height: 4,
        borderRadius: 2,
        position: 'absolute',
        backgroundColor: 'rgb(255, 208, 0)',
      }}/>;
    }

    return null;
  }

  return (
    <View style={{ ...styles.container, ...style }}>
      <View style={{ ...styles.headerContainer, ...headerContainerStyle }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ ...styles.headerMonth, ...headerMonthStyle }}>
            {months[activeDate.month()]} &nbsp;
          </Text>
          <Text style={{ ...styles.headerYear, ...headerYearStyle }}>
            {activeDate.year()}
          </Text>
        </View>

        {props.renderControlButtons ?
          props.renderControlButtons(handlePreviousPress, handleNextPress) : (
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={handlePreviousPress}
                style={{ ...styles.arrowLeftContainer, ...arrowLeftContainerStyle }}
              >
                {leftArrow || <Text>{'<'}</Text>}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNextPress}
                style={{ ...styles.arrowRightContainer, ...arrowRightContainerStyle }}
              >
                {rightArrow || <Text>{'>'}</Text>}
              </TouchableOpacity>
            </View>
          )}
      </View>

      {/* Calendar rendering */}
      {matrix.map((row, rowIndex) => {
        const rowSelected = selectedDate.month() === activeDate.month() &&
          selectedDate.year() === activeDate.year() &&
          row.includes(selectedDate.date());

        const rowItems = row.map((item, colIndex) => {
          // item is the date on a slot
          const itemSelected =
            item === selectedDate.date() &&
            selectedDate.month() === activeDate.month() &&
            selectedDate.year() === activeDate.year();

          // Sunday, Monday, Tuesday, Wednesday, Thursday, Friday
          const isWeekDays = rowIndex === 0;

          // If `isWeekDay` is true, then it's not a Touchable component
          const Touchable = isWeekDays || item === -1 ? View : TouchableOpacity;

          // A unique day
          return (
            <Touchable
              style={{ flex: 1 }}
              key={`col-${colIndex}`}
              onPress={() => handleDatePress(item, rowIndex)}
            >
              <View
                style={{
                  ...styles.day, ...dayStyle,
                  height: !rowSelected && !expanded && rowIndex !== 0 ? 0 : 40,
                  backgroundColor: itemSelected ? selectedDateBackgroundColor : undefined,
                }}
              >
                <Text
                  style={[
                    itemSelected ?
                      { color: '#fff', fontWeight: 'bold' } :
                      { color: isWeekDays ? 'rgba(0,0,0,.2)' : 'rgba(0,0,0,1)' },
                    { fontSize: 14 },
                  ]}
                >
                  {item !== -1 ? item : undefined}
                </Text>
                {renderDot(item)}
              </View>
            </Touchable>
          );
        });

        return (
          <View
            key={`row-${rowIndex}`}
            style={{
              height: !rowSelected && !expanded && rowIndex !== 0 ? 0 : 40,
              marginBottom: rowIndex === 0 ? 5 : undefined,
            }}
          >
            {/* Week line */}
            <View
              style={{
                ...styles.week,
                backgroundColor: rowSelected ? selectedWeekBackgroundColor : undefined,
              }}
            >
              {rowItems}
            </View>

            {/* Simple horizontal bar */}
            {rowIndex === 0 && (
              <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,.1)', width: '100%' }}/>
            )}
          </View>
        );
      })}

      {hasKnob && (
        /* Knob Component */
        <TouchableOpacity
          onPress={changeLayout}
          style={{ ...styles.knob, backgroundColor: knobColor }}
        />
      )}
    </View>
  );
}

export const CalendarPropTypes = Calendar.propTypes = {
  onSelectDate: PropTypes.func,
  items: PropTypes.array,
  renderControlButtons: PropTypes.func,
  style: PropTypes.object,
  headerContainerStyle: PropTypes.object,
  headerMonthStyle: PropTypes.object,
  headerYearStyle: PropTypes.object,
  arrowLeftContainerStyle: PropTypes.object,
  arrowRightContainerStyle: PropTypes.object,
  dayStyle: PropTypes.object,
  rightArrow: PropTypes.element,
  leftArrow: PropTypes.element,
  selectedDateBackgroundColor: PropTypes.string,
  selectedWeekBackgroundColor: PropTypes.string,
  hasKnob: PropTypes.bool,
  knobColor: PropTypes.string,
};

export const CalendarDefaultProps = Calendar.defaultProps = {
  onSelectDate: () => {
  },
  items: [],
  renderControlButtons: undefined,
  rightArrow: undefined,
  leftArrow: undefined,
  style: {},
  headerContainerStyle: {},
  headerMonthStyle: {},
  headerYearStyle: {},
  arrowLeftContainerStyle: {},
  arrowRightContainerStyle: {},
  dayStyle: { borderRadius: 20, overflow: 'hidden' },
  selectedDateBackgroundColor: 'rgba(0,0,0,1)',
  selectedWeekBackgroundColor: 'rgba(0,0,0,.1)',
  hasKnob: false,
  knobColor: 'rgba(0,0,0,1)',
};

export default Calendar;
