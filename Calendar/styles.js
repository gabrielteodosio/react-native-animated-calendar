import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    zIndex: 2,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.1)',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    minHeight: 40,
  },
  headerMonth: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerYear: {
    fontSize: 18,
    textAlign: 'center',
  },
  arrowLeftContainer: { padding: 10 },
  arrowRightContainer: { padding: 10 },
  day: {
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  week: {
    flex: 1,
    paddingVertical: 20,
    borderRadius: 18.5,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  knob: {
    height: 8,
    width: 50,
    marginTop: 5,
    borderRadius: 4,
    alignSelf: 'center',
  },
});

export default styles;
