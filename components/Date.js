import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import moment from "moment";

const Date = ({ date, onSelectDate, selected ,setSelectedTime}) => {
  const day =
    moment(date).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD")
      ? "Today"
      : moment(date).format("ddd");
  // get the day number e.g 1, 2, 3, 4, 5, 6, 7
  const dayNumber = moment(date).format("D");

  // get the full date e.g 2021-01-01 - we'll use this to compare the date to the selected date
  const fullDate = moment(date).format("YYYY-MM-DD");
  console.log(fullDate);
  return (
    <TouchableOpacity
      onPress={() => {
        setSelectedTime([]);
        onSelectDate(fullDate)
      } }
      style={[
        styles.card,
        selected === fullDate && { backgroundColor: "#07bc0c" },
      ]}
    >
      <Text style={[styles.big, selected === fullDate && { color: "#fff" }]}>
        {day}
      </Text>
      <View style={{ height: 10 }} />
      <Text
        style={[
          styles.medium,
          selected === fullDate && {
            color: "#fff",
            fontWeight: "bold",
            fontSize: 24,
          },
        ]}
      >
        {dayNumber}
      </Text>
    </TouchableOpacity>
  );
};

export default Date;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#e0e0e0",

    borderRadius: 10,
    borderColor: "#ddd",
    padding: 10,
    marginVertical: 10,
    alignItems: "center",
    height: 90,
    width: 80,
    marginHorizontal: 5,
  },
  big: {
    fontWeight: "bold",
    fontSize: 20,
  },
  medium: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
