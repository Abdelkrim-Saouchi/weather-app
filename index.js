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

function getCurrentTime(dateStr) {
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

// Display functions
function displayCity(obj) {
  const cityDiv = document.querySelector('[data-city]');
  const cityName = obj.name;
  cityDiv.textContent = cityName;
}

function displayCountry(obj) {
  const countryDiv = document.querySelector('[data-country]');
  const { country } = obj;
  countryDiv.textContent = country;
}

function displayCurrentDate(obj) {
  const dateDiv = document.querySelector('[data-date]');
  const dateStr = obj.localtime;
  const dateInString = getFormattedDate(dateStr);
  dateDiv.textContent = dateInString;
}

function displayCurrentTime(obj) {
  const timeDiv = document.querySelector('[data-time]');
  const dateStr = obj.localtime;
  const timeInString = getCurrentTime(dateStr);
  timeDiv.textContent = timeInString;
}

function displayWeatherConditionText(obj) {
  const para = document.querySelector('[data-condition-text]');
  const conditionText = obj.condition.text;
  para.textContent = conditionText;
}

function displayWeatherConditionIcon(obj) {
  const ConditionIcon = obj.condition.icon;
  const conditionDiv = document.querySelector('[data-condition]');
  let img = conditionDiv.querySelector('img');
  if (img == null) {
    img = document.createElement('img');
    img.classList.add('info-container__condition-icon');
    conditionDiv.appendChild(img);
  }
  img.src = ConditionIcon;
}

function displayTemperature(obj) {
  const temperatureDiv = document.querySelector('[data-temperature]');
  const tempInC = obj.temp_c;
  temperatureDiv.textContent = `${tempInC} °C`;
}

function displayHumidity(obj) {
  const humidityDiv = document.querySelector('[data-humidity]');
  const { humidity } = obj;
  createWeatherComponent(
    humidity,
    humidityDiv,
    './assets/droplets-01-svgrepo-com.svg',
    'Humidity',
    '%'
  );
}

function displayWindSpeed(obj) {
  const windDiv = document.querySelector('[data-wind]');
  const windSpeed = obj.wind_kph;
  createWeatherComponent(
    windSpeed,
    windDiv,
    './assets/wind-svgrepo-com.svg',
    'Wind Speed',
    'Km/h'
  );
}

function displayLocationInfo(obj) {
  if (obj == null) return;
  displayCity(obj);
  displayCountry(obj);
  displayCurrentDate(obj);
  displayCurrentTime(obj);
}

function displayWeatherCondition(obj) {
  if (obj == null) return;
  displayWeatherConditionText(obj);
  displayWeatherConditionIcon(obj);
}

function displayWeatherMeasures(obj) {
  if (obj == null) return;
  displayTemperature(obj);
  displayHumidity(obj);
  displayWindSpeed(obj);
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
  if (input.value !== '') {
    setDisplayInfoContainer('none');
    displayLoaderComponent();
    const current = await getCurrent(input.value);
    const location = await getLocation(input.value);
    clearWeatherComponents();

    if (!current || !location) {
      displayLoaderComponent();
      setDisplayInfoContainer('none');
      displayNotFoundMsg();
      setDisplayNotFoundMsg('block');
      return;
    }
    displayLoaderComponent();
    displayLocationInfo(location);
    displayWeatherCondition(current);
    displayWeatherMeasures(current);
    setDisplayNotFoundMsg('none');
    setDisplayInfoContainer('grid');
  }
}

// Event listeners
submitBtn.addEventListener('click', globalHandler);
