import React from "react";
import { StyleSheet, View } from "react-native";
import BookingList from "../../../components/ui/bookings/BookingList";

const BookingTab = () => {
  return (
    <View style={styles.container}>
      <BookingList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", backgroundColor: "transparent" },
});

export default BookingTab;

