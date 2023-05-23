// Global variables
const input = document.querySelector('[data-input]');
const submitBtn = document.querySelector('[data-submit-button]');

// API functions
async function getJsonData(location) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=1486a96373104c46bc6142904230304&q=${location}`,
      { mode: 'cors' }
    );
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const jsonData = await response.json();
    return jsonData;
  } catch {
    throw new Error('fetch aborted! invalid location name!');
  }
}

async function getCurrent(location) {
  try {
    const jsonData = await getJsonData(location);
    const currentObj = await jsonData.current;
    return currentObj;
  } catch {
    return null; // to stop error propagation through promises
  }
}

async function getLocation(location) {
  try {
    const jsonData = await getJsonData(location);
    const locationObj = await jsonData.location;
    return locationObj;
  } catch {
    return null; // to stop error propagation through promises
  }
}

// Utility functions
function getFormattedDate(dateStr) {
  const date = new Date(dateStr);
  const options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

  return formattedDate;
}

function getTime(dateStr) {
  const copyDate = dateStr;
  const timeStr = copyDate.split(' ')[1];

  return timeStr;
}

function createWeatherIcon(src, className) {
  const img = document.createElement('img');
  img.src = src;
  img.classList.add(className);
  return img;
}

function createWeatherTextDiv(
  measureName,
  textDivClass,
  titleClass,
  title,
  valueParaClass,
  valueUnit
) {
  const textDiv = document.createElement('div');
  textDiv.classList.add(textDivClass);

  const textTitle = document.createElement('p');
  textTitle.classList.add(titleClass);
  textTitle.textContent = title;
  textDiv.appendChild(textTitle);

  const valuePara = document.createElement('p');
  valuePara.classList.add(valueParaClass);
  valuePara.textContent = `${measureName} ${valueUnit}`;
  textDiv.appendChild(valuePara);

  return textDiv;
}

function createWeatherComponent(measureName, parent, imgSrc, title, valueUnit) {
  const img = createWeatherIcon(imgSrc, 'info-container__icon');

  parent.appendChild(img);

  const textDiv = createWeatherTextDiv(
    measureName,
    'info-container__text',
    'info-container__title',
    title,
    'info-container__value',
    valueUnit
  );

  parent.appendChild(textDiv);
}

function clearWeatherComponents() {
  const humidityDiv = document.querySelector('[data-humidity]');
  const windDiv = document.querySelector('[data-wind]');
  humidityDiv.innerHTML = '';
  windDiv.innerHTML = '';
}

function setDisplayInfoContainer(display) {
  document.querySelector('[data-info-container]').style.display = display;
}

function setDisplayNotFoundMsg(display) {
  document.querySelector('[data-error-msg-container]').style.display = display;
}

function getInputValue() {
  return input.value;
}

function getCity(obj) {
  return obj.name;
}

function getCountry(obj) {
  return obj.country;
}
function displayCurrentDate(date) {
  const dateDiv = document.querySelector('[data-date]');
  dateDiv.textContent = date;
}

function getCurrentDate(obj) {
  const dateStr = obj.localtime;
  return getFormattedDate(dateStr);
}

function getCurrentTime(obj) {
  const dateStr = obj.localtime;
  return getTime(dateStr);
}

function getWeatherConditionText(obj) {
  return obj.condition.text;
}

function getWeatherConditionIcon(obj) {
  return obj.condition.icon;
}

function getTemperature(obj) {
  return obj.temp_c;
}

function getHumidity(obj) {
  return obj.humidity;
}

function getWindSpeed(obj) {
  return obj.wind_kph;
}

function getLocationInfo(obj) {
  if (!obj) return null;
  const city = getCity(obj);
  const country = getCountry(obj);
  const currentDate = getCurrentDate(obj);
  const currentTime = getCurrentTime(obj);
  return {
    city,
    country,
    currentDate,
    currentTime,
  };
}

function getWeatherCondition(obj) {
  if (!obj) return null;
  const weatherConditionText = getWeatherConditionText(obj);
  const weatherConditionIcon = getWeatherConditionIcon(obj);
  return {
    weatherConditionText,
    weatherConditionIcon,
  };
}

function getWeatherMeasures(obj) {
  if (!obj) return null;
  const temperature = getTemperature(obj);
  const humidity = getHumidity(obj);
  const windSpeed = getWindSpeed(obj);

  return {
    temperature,
    humidity,
    windSpeed,
  };
}

// Display functions
function displayCity(cityName) {
  const cityDiv = document.querySelector('[data-city]');
  cityDiv.textContent = cityName;
}

function displayCountry(country) {
  const countryDiv = document.querySelector('[data-country]');
  countryDiv.textContent = country;
}

function displayCurrentTime(time) {
  const timeDiv = document.querySelector('[data-time]');
  timeDiv.textContent = time;
}

function displayWeatherConditionText(conditionText) {
  const para = document.querySelector('[data-condition-text]');
  para.textContent = conditionText;
}

function displayWeatherConditionIcon(ConditionIcon) {
  const conditionDiv = document.querySelector('[data-condition]');
  let img = conditionDiv.querySelector('img');
  if (img == null) {
    img = document.createElement('img');
    img.classList.add('info-container__condition-icon');
    conditionDiv.appendChild(img);
  }
  img.src = ConditionIcon;
}

function displayTemperature(tempInC) {
  const temperatureDiv = document.querySelector('[data-temperature]');
  temperatureDiv.textContent = `${tempInC} °C`;
}

function displayHumidity(humidity) {
  const humidityDiv = document.querySelector('[data-humidity]');
  createWeatherComponent(
    humidity,
    humidityDiv,
    './assets/droplets-01-svgrepo-com.svg',
    'Humidity',
    '%'
  );
}

function displayWindSpeed(windSpeed) {
  const windDiv = document.querySelector('[data-wind]');
  createWeatherComponent(
    windSpeed,
    windDiv,
    './assets/wind-svgrepo-com.svg',
    'Wind Speed',
    'Km/h'
  );
}

function displayData(data) {
  const {
    city,
    country,
    currentDate,
    currentTime,
    weatherConditionText,
    weatherConditionIcon,
    temperature,
    humidity,
    windSpeed,
  } = data;

  displayCity(city);
  displayCountry(country);
  displayCurrentDate(currentDate);
  displayCurrentTime(currentTime);
  displayWeatherConditionText(weatherConditionText);
  displayWeatherConditionIcon(weatherConditionIcon);
  displayTemperature(temperature);
  displayHumidity(humidity);
  displayWindSpeed(windSpeed);
}

function displayNotFoundMsg() {
  const msgDiv = document.querySelector('[data-error-msg-container]');
  msgDiv.textContent = 'Data Not Found!';
}

function displayLoaderComponent() {
  document.querySelector('[data-loader]').classList.toggle('loader--hidden');
}

// Event handler functions
async function globalHandler(e) {
  e.preventDefault();
  const searchInput = getInputValue();
  if (searchInput !== '') {
    setDisplayInfoContainer('none');
    displayLoaderComponent();
    const current = await getCurrent(searchInput);
    const location = await getLocation(searchInput);
    clearWeatherComponents();

    if (!current || !location) {
      displayLoaderComponent();
      setDisplayInfoContainer('none');
      displayNotFoundMsg();
      setDisplayNotFoundMsg('block');
      return;
    }
    displayLoaderComponent();
    const locationInfo = getLocationInfo(location);
    const weatherCondition = getWeatherCondition(current);
    const weatherMeasures = getWeatherMeasures(current);

    const data = {
      ...locationInfo,
      ...weatherCondition,
      ...weatherMeasures,
    };

    displayData(data);
    setDisplayNotFoundMsg('none');
    setDisplayInfoContainer('grid');
  }
}

// Event listeners
submitBtn.addEventListener('click', globalHandler);
