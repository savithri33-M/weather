import React, { useState } from 'react'
import axios from "axios"

const URL = "https://geocoding-api.open-meteo.com/v1/search"
function App() {
  const [city, setCity] = useState("")
  const [weather, setWeather] = useState(null)
  const [isloading, setIsloading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(event){
    event.preventDefault()
    setIsloading(true)
    setError("")
    setWeather(null)
    try{
    const response = await axios.get(URL,{
       params: {name:city    } })
    console.log(response.data)
      // console.log("City entered:", city)
      // console.log("API request URL:", response.config.url)
      // console.log("Request parameters:", response.config.params)


    const  result=response.data.results
      if (!result || result.length === 0) {
        setError("City not found. Please enter a valid city name.");
        return;
      }

    const first =result[0]
    console.log(first)

    const latitude=first.latitude

const longitude= first.longitude 
    const weatherResponse = await axios.get(
      "https://api.open-meteo.com/v1/forecast",
      {
        params: {
    latitude: latitude,
          longitude: longitude,
        current: "temperature_2m,relative_humidity_2m,wind_speed_10m"
        }
      }
    );

    console.log(weatherResponse.data)
      setWeather(weatherResponse.data)
  }catch(err){
    console.log(err)
      setError("Failed to fetch weather. Please try again.")
  }finally{
    setIsloading(false)
  }
}
  return (
    
  
  
    <div className='min-h-screen flex flex-col items-center justify-center bg-blue-200 px-4 py-10 gap-6'>
      <h1 className='text-4xl font-extrabold text-black tracking-wide'>  🌤️WEATHER APP</h1>
      {isloading && <p>Loading weather...</p>}
      {error && <p>{error}</p>}
      {weather && (
        <div className='w-full max-w-md rounded-2xl border
    p-6 text-white shadow-2xl backdrop-blur-md bg-blue-950' >
          <p>Temperature: {weather.current.temperature_2m}°C</p>
          <p>Humidity: {weather.current.relative_humidity_2m}%</p>
          <p>Wind Speed: {weather.current.wind_speed_10m} km/h</p>
        </div>
      )}

      <form className='flex w-full max-w-md gap-3'
      onSubmit={handleSubmit}
      >
      <input className='border px-3 bg-white'
      type='text'
      placeholder='Enter a City Name'
      value={city}
      onChange={(event)=>setCity(event.target.value)}

      ></input>
        <button className='min-w-0 flex-1 rounded-xl border border-white/40
bg-white px-4 py-3 text-gray-800'>SEARCH</button>
      </form>
    </div>
  )
}

export default App





