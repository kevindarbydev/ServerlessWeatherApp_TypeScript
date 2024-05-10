import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [enteredLocation, setEnteredLocation] = useState<string>("");
  const [weatherData, setWeatherData] = useState<{
    location: string;
    temp: number;
    windSpeed: number;
    feelsLike: number;
    humidity: number;
    description: string;
    celsiusOrFarenheit: "C" | "F";
    milesOrKilometers: "km/h" | "mph";
  }>({
    location: "",
    temp: 0,
    windSpeed: 0,
    feelsLike: 0,
    humidity: 0,
    description: "",
    celsiusOrFarenheit: "C",
    milesOrKilometers: "km/h",
  });

  const today = new Date();
  const day = today.toString();
  const arrayOfWords = day.split(" ");
  const myDate =
    arrayOfWords[0] + ", " + arrayOfWords[1] + " " + arrayOfWords[2];

  const convertCelsius = (temp: number): number => {
    return Number(((temp - 32) * 0.5556).toFixed(2));
  };

  const milesToKm = (miles: number): number => (miles * 1.609344).toFixed() as unknown as number;

  const searchLocation = async (event) => {
    if (event.key === "Enter") {
      const apiGateway = `https://5xxs8tdalb.execute-api.us-east-1.amazonaws.com/default/FetchWeather?location=${enteredLocation}`;
      try {
        const response = await fetch(apiGateway);
        if (response.ok) {
          const data = await response.json();

          const cityAndCountry = data.name + ", " + data.sys.country;
          if (data.sys.country == "US") {
            setWeatherData({
              location: cityAndCountry,
              temp: data.main.temp,
              feelsLike: data.main.feels_like,
              windSpeed: data.wind.speed,
              humidity: data.main.humidity,
              description: data.weather[0].main,
              celsiusOrFarenheit: "F",
              milesOrKilometers: "mph",
            });
          } else {
            setWeatherData({
              location: cityAndCountry,
              temp: convertCelsius(data.main.temp) as number,
              feelsLike: convertCelsius(data.main.feels_like) as number,
              windSpeed: milesToKm(data.wind.speed),
              humidity: data.main.humidity as number,
              description: data.weather[0].main,
              celsiusOrFarenheit: "C",
              milesOrKilometers: "km/h",
            });
          }

          const iconData = data.weather[0].icon;
          document.querySelector(".icon").src =
            "https://openweathermap.org/img/wn/" + iconData + "@2x.png";
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
  };

  async function fetchWeatherAtHome() {
    try {
      const response = await fetch(
        "https://5xxs8tdalb.execute-api.us-east-1.amazonaws.com/default/FetchMontreal"
      );

      if (response.ok) {
        const data = await response.json();
        const cityAndCountry = data.name + ", " + data.sys.country;
        setWeatherData({
          location: cityAndCountry,
          temp: data.main.temp.toFixed(),
          feelsLike: data.main.feels_like,
          windSpeed: data.wind.speed,
          humidity: data.main.humidity,
          description: data.weather[0].main,
          celsiusOrFarenheit: "C",
          milesOrKilometers: "mph",
        });
      } else {
        console.error("Failed to fetch weather data");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  useEffect(() => {
    fetchWeatherAtHome();
  }, []);

  return (
    <div className="app">
      <div className="container">
        <div className="search">
          <input
            id="searchInput"
            value={enteredLocation}
            onChange={(event) => setEnteredLocation(event.target.value)}
            onKeyPress={searchLocation}
            placeholder="Enter Location"
            type="text"
          />
        </div>
        <h2 className="location">
          {myDate}
          &nbsp;&nbsp;
          {weatherData.location}
        </h2>
        <div className="temp">
          {weatherData.temp} °
          <span id="tempSpan">{weatherData.celsiusOrFarenheit}</span>{" "}
        </div>
        <img src="" className="icon"></img>
        <div className="description">{weatherData.description}</div>
        <div className="bottom">
          <div className="feelsLike">
            Feels like:&nbsp;
            {weatherData.feelsLike} °
            <span id="celsiusBtm">{weatherData.celsiusOrFarenheit}</span>
          </div>
          <div className="humidity">Humidity: {weatherData.humidity}%</div>
          <div className="wind">
            Wind speed: {weatherData.windSpeed} {weatherData.milesOrKilometers}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
