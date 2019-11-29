import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
} from 'react-native';

import styles from './styles';

// Get actual year
const year = moment().year();

// Get the quantity of days for a specific date
const nDays = [
  moment([year, 0, 1]).daysInMonth(), // January
  moment([year, 1, 1]).daysInMonth(), // February
  moment([year, 2, 1]).daysInMonth(), // March
  moment([year, 3, 1]).daysInMonth(), // April
  moment([year, 4, 1]).daysInMonth(), // May
  moment([year, 5, 1]).daysInMonth(), // June
  moment([year, 6, 1]).daysInMonth(), // July
  moment([year, 7, 1]).daysInMonth(), // August
  moment([year, 8, 1]).daysInMonth(), // September
  moment([year, 9, 1]).daysInMonth(), // October
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
function generateMatrix(weekDays, moment) {
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

class Calendar extends React.Component {
  constructor(props) {
    super(props);

    const activeDate = moment();
    const selectedDate = moment();
    const {
      vocabulary: { weekDays },
    } = props;

    this.state = {
      activeDate,
      selectedDate,
      matrix: generateMatrix(weekDays, activeDate),
      expanded: props.defaultExpanded,
    };

    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {
    const { activeDate } = this.state;
    this.handleDatePress(activeDate.date());
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.expanded !== this.state.expanded) {
      this.props.onChangeExpanded(this.state.expanded);
    }
  }

  setActiveDate = (activeDate, callback) =>
    this.setState({ activeDate }, callback);

  setSelectedDate = (selectedDate, callback) =>
    this.setState({ selectedDate }, callback);

  setMatrix = (matrix, callback) => this.setState({ matrix }, callback);

  getIsExpanded = () => this.state.expanded;

  handleDatePress = (item) => {
    const { activeDate, selectedDate } = this.state;
    const { onSelectDate } = this.props;

    const date = moment([activeDate.year(), activeDate.month(), item]);

    if (date.isSame(selectedDate)) {
      this.changeLayout();
    } else {
      onSelectDate(date);
      this.setSelectedDate(date);
    }
  };

  handleNextPress = () => {
    const { activeDate } = this.state;
    const {
      onChangeMonth,
      vocabulary: { weekDays },
    } = this.props;

    this.setActiveDate(activeDate.add(moment.duration(1, 'month')), () =>
      onChangeMonth(this.state.activeDate),
    );
    this.setMatrix(generateMatrix(weekDays, activeDate));
  };

  handlePreviousPress = () => {
    const { activeDate } = this.state;
    const {
      onChangeMonth,
      vocabulary: { weekDays },
    } = this.props;

    this.setActiveDate(activeDate.subtract(moment.duration(1, 'month')), () =>
      onChangeMonth(this.state.activeDate),
    );
    this.setMatrix(generateMatrix(weekDays, activeDate));
  };

  // Collapse and Reverse
  changeLayout = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState((oldState) => ({ expanded: !oldState.expanded }));
  };

  // TODO: Implement a better way of rendering dots
  renderDot = (item) => {
    const { activeDate } = this.state;
    const { markers } = this.props;

    const date = moment([activeDate.year(), activeDate.month(), item]).format(
      'YYYY-MM-DD',
    );

    if (markers.includes(date)) {
      return (
        <View
          style={{
            width: 4,
            bottom: 5,
            height: 4,
            borderRadius: 2,
            position: 'absolute',
            backgroundColor: 'rgb(255, 208, 0)',
          }}
        />
      );
    }

    return null;
  };

  render() {
    const {
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
      hasKnob,
      knobColor,
      dataStyle,
      vocabulary: { months },
      fontFamily,
    } = this.props;

    const { activeDate, selectedDate, expanded, matrix } = this.state;

    return (
      <View style={{ ...styles.container, ...style }}>
        <View style={{ ...styles.headerContainer, ...headerContainerStyle }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={[
                { ...styles.headerMonth, ...headerMonthStyle },
                { color: dataStyle === 'light' ? 'black' : 'white' },
                fontFamily ? { fontFamily } : undefined,
              ]}
            >
              {months[activeDate.month()]} &nbsp;
            </Text>
            <Text
              style={[
                { ...styles.headerYear, ...headerYearStyle },
                { color: dataStyle === 'light' ? 'black' : 'white' },
                fontFamily ? { fontFamily } : undefined,
              ]}
            >
              {activeDate.year()}
            </Text>
          </View>

          {typeof this.props.renderControlButtons === 'function' ? (
            this.props.renderControlButtons(
              this.handlePreviousPress,
              this.handleNextPress,
            )
          ) : expanded ? (
            <View
              style={{ flexDirection: 'row', minHeight: 37, maxHeight: 40 }}
            >
              <TouchableOpacity
                disabled={!expanded}
                onPress={this.handlePreviousPress}
                style={{
                  ...styles.arrowLeftContainer,
                  ...arrowLeftContainerStyle,
                }}
              >
                {leftArrow || (
                  <Text
                    style={{
                      color:
                        dataStyle === 'light'
                          ? 'rgb(19, 27, 34)'
                          : 'rgb(232, 232, 232)',
                    }}
                  >
                    {'<'}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                disabled={!expanded}
                onPress={this.handleNextPress}
                style={{
                  ...styles.arrowRightContainer,
                  ...arrowRightContainerStyle,
                }}
              >
                {rightArrow || (
                  <Text
                    style={{
                      color:
                        dataStyle === 'light'
                          ? 'rgb(19, 27, 34)'
                          : 'rgb(232, 232, 232)',
                    }}
                  >
                    {'>'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        {/* Calendar rendering */}
        {matrix.map((row, rowIndex) => {
          const rowSelected =
            selectedDate.month() === activeDate.month() &&
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
            const Touchable =
              isWeekDays || item === -1 ? View : TouchableOpacity;

            const itemStyle = !itemSelected
              ? {
                color: isWeekDays
                  ? dataStyle === 'light'
                    ? 'rgba(19, 27, 34, 0.2)'
                    : 'rgba(232, 232, 232, 0.2)'
                  : dataStyle === 'light'
                    ? 'rgb(19, 27, 34)'
                    : 'rgb(232, 232, 232)',
              }
              : {
                color:
                    dataStyle === 'light'
                      ? 'rgb(19, 27, 34)'
                      : 'rgb(232, 232, 232)',
                fontWeight: 'bold',
              };

            // A unique day
            return (
              <Touchable
                style={{ flex: 1 }}
                key={`col-${colIndex}`}
                onPress={() => this.handleDatePress(item, rowIndex)}
              >
                <View
                  style={{
                    ...styles.day,
                    ...dayStyle,
                    height:
                      !rowSelected && !expanded && rowIndex !== 0 ? 0 : 40,
                    backgroundColor: itemSelected
                      ? selectedDateBackgroundColor
                      : undefined,
                  }}
                >
                  <Text
                    style={[
                      itemStyle,
                      { fontSize: 14 },
                      fontFamily ? { fontFamily } : undefined,
                    ]}
                  >
                    {item !== -1 ? item : undefined}
                  </Text>
                  {this.renderDot(item)}
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
                  backgroundColor: rowSelected
                    ? selectedWeekBackgroundColor
                    : undefined,
                }}
              >
                {rowItems}
              </View>

              {/* Simple horizontal bar */}
              {rowIndex === 0 && (
                <View
                  style={{
                    height: 1,
                    backgroundColor: 'rgba(0,0,0,.1)',
                    width: '100%',
                  }}
                />
              )}
            </View>
          );
        })}

        {hasKnob && (
          /* Knob Component */
          <TouchableOpacity
            onPress={this.changeLayout}
            style={{ ...styles.knob, backgroundColor: knobColor }}
          />
        )}
      </View>
    );
  }
}

export const CalendarPropTypes = (Calendar.propTypes = {
  onSelectDate: PropTypes.func,
  markers: PropTypes.array,
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
  defaultExpanded: PropTypes.bool,
  hasToggleButton: PropTypes.bool,
  toggleButtonIcon: PropTypes.element,
  vocabulary: PropTypes.shape({
    weekDays: PropTypes.arrayOf(PropTypes.string),
    months: PropTypes.arrayOf(PropTypes.string),
  }),
  dataStyle: PropTypes.oneOf(['light', 'dark']),
  onChangeExpanded: PropTypes.func.isRequired,
  fontFamily: PropTypes.string,
  onChangeMonth: PropTypes.func,
});

export const CalendarDefaultProps = (Calendar.defaultProps = {
  onSelectDate: () => {},
  markers: [],
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
  defaultExpanded: false,
  hasToggleButton: true,
  vocabulary: {
    months: [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ],
    weekDays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  },
  dataStyle: 'light',
  onChangeMonth: () => {},
});

export default Calendar;
