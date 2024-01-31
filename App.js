import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet , ActivityIndicator,Image,ScrollView} from 'react-native';

import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const [celsius, setCelsius] = useState([]);
  const [celsiusScroll, setCelsiusScroll] = useState([]);
  const [dates, setDate] = useState([]);



  const getWeather = async () => {
    try {
      const response = await fetch('https://api.openweathermap.org/data/2.5/weather?id=524901&lang=fr&lat=45.7820397&lon=4.7482029&appid=c4c9a553ff94147f96950978710cb7ce&units=metric');
      const json = await response.json();
      setData(json);
      setCelsius(Math.round(json.main.temp))
      
       console.log(json.weather[0].icon)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getForecast = async () => {
    try {
      const response = await fetch('https://api.openweathermap.org/data/2.5/forecast?id=524901&lang=fr&lat=45.7820397&lon=4.7482029&appid=c4c9a553ff94147f96950978710cb7ce&units=metric');
      const json = await response.json();
   
      
      for (let index = 0; index < 40; index++) {
        // console.log(json.list[index].main.temp)
        // setDate(json.list[index].dt_txt)
        setCelsiusScroll(Math.round(json.list[index].main.temp))
        setDate( (dates) => [
          ...dates,
          { id: index , date : json.list[index].dt_txt , img : json.list[index].weather[0].icon , temp : json.list[index].weather[0].description }

          
        ]);
      
      }
   
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      //  console.log(dates)
    }
  };

  useEffect(() => {
    getWeather()

  }, []);
  
  useEffect(() => {
    getForecast()
    
  }, []);
  
  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      ``
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    
    
     
    <View style={styles.container}>
     
     {isLoading ? (
      <ActivityIndicator />
    ) : (
    
      <>
      <View style = {styles.mainBlock}>
      <Text style={styles.title}> {data.name} </Text>
      <Text style={styles.titleBlock}>{celsius}°C</Text>
      <Image style={styles.image} source={{uri:`http://openweathermap.org/img/w/${data.weather[0].icon}.png`}} />
      <Text style={styles.paragraph}> {data.weather[0].description} </Text>
      </View>
      <ScrollView style={styles.scrollView}>
      
      {dates.map((date,i) => {
       
     
          return (
          <View style={styles.container} key={i}>
          <View style = {styles.block}>
          <Text   style={styles.titleBlock}> {date.date}</Text> 
          <Text   style={styles.titleBlock}> {celsiusScroll}°C</Text> 
          <Image style={styles.image} source={{uri:`http://openweathermap.org/img/w/${date.img}.png`}}/>
          <Text   style={styles.titleBlock}> {date.temp}</Text> 
          
          </View>
          </View>
          ) 
         
          
          })}
        
        </ScrollView>
      </>
      
     
     
    
    )}
   
      
  
   
    </View> 
    

 
  );
}


const styles = StyleSheet.create({ 
  container: { 
      flex: 1, 
      backgroundColor : "#CBE4F9",
      justifyContent: 'center',
      alignItems: 'center',
  }, 
  image : {
    width : 150,
    height : 150,
  },
  block : {
  backgroundColor:"#ffffffce",
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius : 10,
  marginTop :10,
  width : 300,

  },
  mainBlock : {
  backgroundColor:"#ffffffce",
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius : 10,
  marginTop :70,
  width : 300
  },
  title : {
  fontSize: 20,
  fontWeight: "bold" ,
  marginTop :10,
  },
  titleBlock : {
  fontSize: 15,
  fontWeight: "bold" ,
  marginTop :10,
  },


  
}); 



