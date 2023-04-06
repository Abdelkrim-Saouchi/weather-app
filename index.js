async function getJsonData(location) {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=1486a96373104c46bc6142904230304&q=${location}`,
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

async function getCurrentObj(location) {
  try {
    const jsonData = await getJsonData(location);
    const currentObj = await jsonData.current;
    return currentObj;
  } catch {
    throw new Error('get current obj fails!');
  }
}

async function getLocationObj(location) {
  try {
    const jsonData = await getJsonData(location);
    const locationObj = await jsonData.location;
    return locationObj;
  } catch {
    throw new Error('get location obj fails!');
  }
}

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

function getFormatedDate(dateStr) {
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

function displayCurrentDate(obj) {
  const dateDiv = document.querySelector('[data-date]');
  const dateStr = obj.localtime;
  const dateInString = getFormatedDate(dateStr);
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

const input = document.querySelector('[data-input]');

async function globalEventsHandler(e) {
  e.preventDefault();
  const current = await getCurrentObj(input.value);
  const location = await getLocationObj(input.value);
  console.log(current);
  console.log(location);

  displayCity(location);
  displayCountry(location);
  displayCurrentDate(location);
  displayCurrentTime(location);
  displayWeatherConditionText(current);
  displayWeatherConditionIcon(current);
}

const submitBtn = document.querySelector('[data-submit-button]');
submitBtn.addEventListener('click', globalEventsHandler);
