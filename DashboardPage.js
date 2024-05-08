// DashboardPage.js
import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, Button, Alert } from 'react-native';
import {SERVER_URL} from './config';

const DashboardPage = () => {
  const [label, setLabel] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [recentTripsData, setRecentTripsData] = useState([]);
  const [chargingStationsData, setChargingStationsData] = useState([]);

  const stationsEndpoint = SERVER_URL + 'show_stations';
  const tripsEndpoint = SERVER_URL + 'show_trips';
  console.log('Stations endpoint:', stationsEndpoint);

  useEffect(() => {
    const fetchRecentTrips = async () => {
      try {
        const response = await fetch(tripsEndpoint);
        if (response.ok) {
          const data = await response.json();
          const newData  = data.map(x => {
            return {
              id: x.id,
              startLocation: JSON.stringify(x.startLocation),
              endLocation: JSON.stringify(x.endLocation)
            }
          })
          setRecentTripsData(newData);
        } else {
          console.error('Error fetching recent trips:', response.statusText);
          throw new Error('Error fetching recent trips');
        }
      } catch (error) {
        console.error('Error fetching recent trips:', error);
        throw new Error('Error fetching recent trips');
      }
    };

    const fetchChargingStations = async () => {
      try {
        const response = await fetch(stationsEndpoint);
        if (response.ok) {
          const data = await response.json();
          const newData = data.map(x => {
            return {
              id: x.id,
              name: x.label,
              location: JSON.stringify(x.location)
            };
          });
          setChargingStationsData(newData);
        } else {
          console.error('Error fetching charging stations:', response.statusText);
          throw new Error('Error fetching charging stations');
        }
      } catch (error) {
        console.error('Error fetching charging stations:', error);
        throw new Error('Error fetching charging stations');
      }
    };

    fetchRecentTrips();
    fetchChargingStations();
  }, []);

  const handleAddStation = async () => {
    // Check if any of the input fields are empty
    if (!label || !latitude || !longitude) {
      Alert.alert('Incomplete Details', 'Please fill in all station details.');
      return;
    }

    try {
      // Construct the request payload
      const requestData = {
        label: label,
        location: {
          latitude: parseFloat(latitude), // Parse latitude as a float
          longitude: parseFloat(longitude), // Parse longitude as a float
        },
      };

      console.log('Request data to add station:', requestData);
      const endpoint = SERVER_URL + 'add_stations';

      // Use a temporary variable to store the response
      let response;

      try {
        // Call the function to send data to the endpoint
        const fetchResponse = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        response = await fetchResponse.json();
        console.log('Add stations response from server:', response);
      } catch (error) {
        // Handle errors that may occur during the data sending process
        console.error('Error in sending data to endpoint:', error);
        throw new Error('Error in sending data to endpoint');
      }

      // Check if there is no 'error' field in the response
      if (!response || !response.error) {
        Alert.alert('Success', 'A new station has been added successfully.');
      } else {
        // Handle the case where the server returns an error
        Alert.alert('Error', response.error);
      }
    } catch (error) {
      // Handle unexpected errors during the add station process
      console.error('Error in handleAddStation:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Recent Trips Table */}
      <ScrollView style={{ height: 200, marginBottom: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Recent Trips</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Table header */}
          <View style={{ flexDirection: 'row', marginBottom: 8 }}>
            <Text style={{ width: 50 }}>ID</Text>
            <Text style={{ width: 150 }}>Start Location</Text>
            <Text style={{ width: 150 }}>End Location</Text>
          </View>

          {/* Table data */}
          {recentTripsData.map((trip) => (
            <View key={trip.id} style={{ flexDirection: 'row', marginBottom: 8 }}>
              <Text style={{ width: 50 }}>{trip.id}</Text>
              <Text style={{ width: 150 }}>{trip.startLocation}</Text>
              <Text style={{ width: 150 }}>{trip.endLocation}</Text>
            </View>
          ))}
        </ScrollView>
      </ScrollView>

      {/* Charging Stations Table */}
      <ScrollView style={{ height: 200, marginBottom: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Charging Stations</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Table header */}
          <View style={{ flexDirection: 'row', marginBottom: 8 }}>
            <Text style={{ width: 100 }}>ID</Text>
            <Text style={{ width: 150 }}>Name</Text>
            <Text style={{ width: 100 }}>Location</Text>
          </View>

          {/* Table data */}
          {chargingStationsData.map((station) => (
            <View key={station.id} style={{ flexDirection: 'row', marginBottom: 8 }}>
              <Text style={{ width: 100 }}>{station.id}</Text>
              <Text style={{ width: 150 }}>{station.name}</Text>
              <Text style={{ width: 100 }}>{station.location}</Text>
            </View>
          ))}
        </ScrollView>
      </ScrollView>

      {/* Line 1: Enter Label and Add Station */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
        <TextInput
          style={{ flex: 1, marginRight: 8, padding: 8, borderColor: 'gray', borderWidth: 1 }}
          placeholder="Enter Label"
          value={label}
          onChangeText={text => setLabel(text)}
        />
        <Button title="Add Station" onPress={handleAddStation} />
      </View>

      {/* Line 2: Enter Latitude and Enter Longitude */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextInput
          style={{ flex: 1, marginRight: 8, padding: 8, borderColor: 'gray', borderWidth: 1 }}
          placeholder="Enter Latitude"
          value={latitude}
          onChangeText={text => setLatitude(text)}
        />
        <TextInput
          style={{ flex: 1, marginRight: 8, padding: 8, borderColor: 'gray', borderWidth: 1 }}
          placeholder="Enter Longitude"
          value={longitude}
          onChangeText={text => setLongitude(text)}
        />
      </View>
    </View>
  );
};

export default DashboardPage;
