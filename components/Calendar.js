import { StyleSheet, Text, View,ScrollView } from 'react-native'
import React ,{useState,useEffect} from 'react'
import moment from 'moment'
import Date from './Date'

const Calendar = ({ onSelectDate, selected,selectedSport,setSelectedTime }) => {
    const [dates, setDates] = useState([])
  const [scrollPosition, setScrollPosition] = useState(0)
  const [currentMonth, setCurrentMonth] = useState();
  const getCurrentMonth = () => {
    const month = moment(dates[0]).add(scrollPosition / 60, 'days').format('MMMM')
    setCurrentMonth(month)
  }
  const getDates = () => {
    const _dates = []
    for (let i = 0; i <10; i++) {
      const date = moment().add(i, 'days');

      _dates.push(date)
    }
    setDates(_dates)
  }

  useEffect(() => {
    getDates()
  }, [])
  useEffect(() => {
    getCurrentMonth()
  }, [scrollPosition]);



  return (
    <>
      <View style={styles.centered}>
        <Text style={styles.title}>{currentMonth}</Text>
        <Text>{selectedSport}</Text>
      </View>
      <View style={styles.dateSection}>
        <View style={styles.scroll}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            // onScroll is a native event that returns the number of pixels the user has scrolled
            scrollEventThrottle={16}
            onScroll={(e) => setScrollPosition(e.nativeEvent.contentOffset.x)}
          >
            {dates.map((date, index) => (
              <Date
                key={index}
                date={date}
                setSelectedTime={setSelectedTime}
                onSelectDate={onSelectDate}
                selected={selected}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </>
  )
}

export default Calendar

const styles = StyleSheet.create({
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
        
        
      },
      title: {
        fontSize: 18,
        marginTop:6,

        fontWeight: '600',
      },
      dateSection: {
        width: '100%',
        padding: 15,
        justifyContent:"center",
        alignItems:"center"
        
      },
      
})