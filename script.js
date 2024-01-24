let yourWeatherButton=document.getElementById('your-weather-button');
let searchWeatherButton=document.getElementById('search-weather-button');

let grantPermissionTab=document.querySelector('.grant-permission-tab');
let searchTab=document.querySelector('.search-tab');
let showWeather=document.querySelector('.show-weather');
let loadingTab=document.querySelector('.loading-tab');

let searchButton=document.getElementById('search-button');
let searchBar=document.getElementById('search-bar');

let grantAccessButton=document.getElementById('grant-access-button');

let errorMessage=document.getElementById('error-message');
let errorTab=document.querySelector('.error-tab');

let errorInYourWeatherTab=false;

const apiKey= '07d1c2ed2eeb53c18f733004430d17c7';
let currentButton=yourWeatherButton;

currentButton.classList.add('current-button');

getCoordinatesFromSessionStorage();

yourWeatherButton.addEventListener('click',()=>{
    switchTabs(yourWeatherButton);//1st way of passing the target
});


searchWeatherButton.addEventListener('click', (e)=>{
    switchTabs(e.target);//2nd way of passing the target
});

function switchTabs(clickedButton){
 
    if(clickedButton!=currentButton){
        currentButton.classList.remove('current-button');
        currentButton=clickedButton;
        currentButton.classList.add('current-button');

        if(errorTab.classList.contains('active')){
            errorTab.classList.remove('active');
        }

        if(clickedButton==yourWeatherButton){
            searchTab.classList.remove('active');

            if(showWeather.classList.contains('active')){
                showWeather.classList.remove('active');
            }

             getCoordinatesFromSessionStorage();//Iske according pata chala ki kya dikhana hai
        }

        else{
            if(grantPermissionTab.classList.contains('active')){
                grantPermissionTab.classList.remove('active');
            }

            else{
                showWeather.classList.remove('active');
            }

            searchTab.classList.add('active');

        }

        
    }
}

function getCoordinatesFromSessionStorage(){
    const lat=sessionStorage.getItem('Latitude');
    const long=sessionStorage.getItem('Longitude');

    if(lat){
       fetchCurrentLocationDetail(parseInt(lat),parseInt(long));
    }

    else{
        if(errorInYourWeatherTab){

            if(grantPermissionTab.classList.contains('active')){
                grantPermissionTab.classList.remove('active');
            }
            errorTab.classList.add('active');
            errorMessage.innerText="User denied the request for Geolocation";
        }

        else{
            grantPermissionTab.classList.add('active');
        }
        
    }
}


async function fetchCurrentLocationDetail(lat,long){

    if(grantPermissionTab.classList.contains('active')){
        grantPermissionTab.classList.remove('active');
    }
    

    loadingTab.classList.add('active');

    try{

        let response= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`);

        let value=await response.json();

        loadingTab.classList.remove('active');

        showWeather.classList.add('active');
    
        renderOnUI(value);
    }

    catch(err){
        loadingTab.classList.remove('active');


        if(!errorTab.classList.contains('active')){
            errorTab.classList.add('active')
        }
        errorMessage.innerText('Unable to Detect current location weather');

    }
 
}

function renderOnUI(value){
  let cityName=document.getElementById('city-name');
  let countryFlag=document.getElementById('country-flag');
  let weatherDescription=document.getElementById('weather-description');
  let weatherIcon=document.getElementById('weather-icon');
  let temperature =document.getElementById('temperature');
  let windspeed =document.getElementById('windspeed-data');
  let humidity=document.getElementById('humidity-data');
  let clouds=document.getElementById('clouds-data');

  console.log(value);

  cityName.innerText=value?.name;

  countryFlag.src=`https://flagcdn.com/144x108/${value?.sys?.country.toLowerCase()}.png`
  
  weatherDescription.innerText=value?.weather?.[0]?.description;

  weatherIcon.src=`https://openweathermap.org/img/w/${value?.weather?.[0].icon}.png`

  temperature.innerText=value?.main?.temp + '°C';

  windspeed.innerText=value?.wind?.speed + 'm/s';

  humidity.innerText=value?.main?.humidity + '%';

  clouds.innerText=value?.clouds?.all + '%';

}

searchButton.addEventListener('click',()=>{
    
    if(searchBar.value!=''){
        fetchCityLocationDetails();
    }
   

});

async function fetchCityLocationDetails(){
   
    if(showWeather.classList.contains('active')){
        showWeather. classList.remove('active');
    }

    if(errorTab.classList.contains('active')){
        errorTab.classList.remove('active');
    }

    loadingTab.classList.add('active');

    try{
        const city=searchBar.value;
    
        let response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);

      
        let value=await response.json();

        loadingTab.classList.remove('active');

        if(value.cod==200){
           
            showWeather.classList.add('active');
        
            renderOnUI(value);
        }

        else{
           if(!errorTab.classList.contains('active')){
            errorTab.classList.add('active');
           }

           errorMessage.innerText='City not found';
        }

    }

    catch(err){

        loadingTab.classList.remove('active');
      
        if(!errorTab.classList.contains('active')){
            errorTab.classList.add('active');
        }

        errorMessage.innerText='Unable to fetch Details';

    }
}

grantAccessButton.addEventListener('click',()=>{
     
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(successCallback,errorCallback,{
            enableHighAccuracy:true,
            timeout:5000,
        });
    }

    else{
        if(!errorTab.classList.contains('active')){
            errorTab.classList.add('active');
        }
        
        errorMessage.innerText('Geolocation API not supported in your device/browser');
    }
});

function successCallback(position) {
    
    const lat=position.coords.latitude;
    const long=position.coords.longitude;

    sessionStorage.setItem('Latitude',lat);
    sessionStorage.setItem('Longitude',long);

    fetchCurrentLocationDetail(lat,long);
}

  function errorCallback(error) {

    grantPermissionTab.classList.remove('active');

    if(!errorTab.classList.contains('active')){
        errorTab.classList.add('active');
    }

    errorInYourWeatherTab=true;
    
    switch (error.code) {
      case 1:
        errorMessage.innerText="User denied the request for Geolocation";
        break;
      case 2:
        errorMessage.innerText="Location information is unavailable";
        break;
      case 3:
        errorMessage.innerText="The request to get user location timed out";
        break;
      default:
        errorMessage.innerText="An unknown error occurred";
        break;
    }
  }







