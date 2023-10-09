import {useEffect, useState} from 'react';
import './App.css';
import searchIcon from './images/search.png';
import locationIcon from './images/location.png';
import atmosphereIcon from './images/atmosphere.png';
import windIcon from './images/wind.png';
import clearskyIcon from './images/clear-sky.png';
import cloudsIcon from './images/clouds.png';
import drizzleIcon from './images/drizzle.png';
import heavyrainIcon from './images/heavy-rain.png';
import snowIcon from './images/snow.png';
import thunderstormIcon from './images/thunderstorm.png';
import humidityIcon from './images/humidity.png';


function App() {

  const [searchWord, setSearchWord] = useState('');
  const [weatherData, setWeatherData] = useState({
    id: '', city: 'City', country: 'Country', temp: '0°C', description: '', wind: '0 km/h', humidity: '0%', icon: atmosphereIcon
  })
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");

  function handleClick() {
    if (!window.navigator.onLine) {
      setError('You are offline. Please check your internet connection and try again.');
      return;
    }
    if (searchWord === '') {
      setError('Please enter city name!');
      return;
    }

    setError("");
    setLoading("Getting weather details...");

    fetchData(searchWord).then((response => handleResponse(response)));

  }

  useEffect(()=> {
    if (searchWord==="") {
      setWeatherData({
        id: '', city: 'City', country: 'Country', temp: '0°C', description: '', wind: '0 km/h', humidity: '0%', icon: atmosphereIcon
      });
    }
  }, [searchWord])

  function handleResponse(result) {
    if (result.cod === '404') {
      setLoading("");
      setError(`'${searchWord}' is not a valid city name!`);
      return;
    }

    setError("");
    setLoading("");

    const id = result.list[0].weather[0].id;
    const city = result.city.name;
    const country = result.city.country;
    const description = result.list[0].weather[0].description;
    const temp = Math.floor(result.list[0].main.temp-273.15) + "°C";
    const humidity = result.list[0].main.humidity + "%";
    const wind = result.list[0].wind.speed + "km/h";
    const icon = setIcon(id);

    setWeatherData({
      id: id, city: city, country: country, temp: temp, description:description, wind: wind, humidity: humidity, icon: icon
    });


  }

  async function fetchData() {
    const api_key = "54afcb1f1a8f482800c0379295f59d9e";
    let api = `https://api.openweathermap.org/data/2.5/forecast?q=${searchWord}&appid=${api_key}`;
    
    try {
        let response = await fetch(api);
        if (!response.ok) {
            console.log('error');
        }
        const data = await response.json();
        return data;
    }catch (error) {
        console.log(error);
    }
  }

  function setIcon(id) {
    if (id>=801 && id<=804) {
        return cloudsIcon;
    }
    else if (id>=200 && id<=232) {
        return thunderstormIcon;
    }
    else if (id>=300 && id<=321) {
        return drizzleIcon;
    }
    else if (id>=500 && id<=531) {
        return heavyrainIcon;
    }
    else if (id>=700 && id<=781) {
        return atmosphereIcon;
    }
    else if (id>=500 && id<=622) {
        return snowIcon;
    }
    else if (id===800) {
        return clearskyIcon;
    }
  }

  return (
    <div className="container">
      <div className="weather-app">
        <h1>Weather app</h1>
        <div className = {(error === '' && loading==="") ? 'msg' : (error!==""&& loading==="") ? 'msg error' : 'msg loading' }>{error}{loading}</div>
        <div className="search">
            <input type="text" 
              placeholder="Enter city name" 
              className="city"
              onChange={(e)=> {
                setSearchWord(e.target.value)
              }}
              />
            <button 
              className="search-icon"
              onClick={handleClick}
              > 
              <img src={searchIcon} alt='search'/>
            </button>
        </div>
        <div className="box1">
            <h2><img src={locationIcon} alt='location'/>{weatherData.city}, {weatherData.country}</h2>
            <img src={weatherData.icon} className="icon" alt='weather'/>
            <h1>{weatherData.temp}</h1>
            <h3>{weatherData.description}</h3>
        </div>
        <div className="box2">
            <div>
                <img src={windIcon} alt='wind'/>
                <h3>Wind</h3> <span>{weatherData.wind}</span>
            </div>
            <div>
                <img src={humidityIcon} alt='humidity'/>
                <h3>Humidity</h3> <span>{weatherData.humidity}</span>
            </div>
        </div>
      </div>
    </div>
  );
}

export default App;
