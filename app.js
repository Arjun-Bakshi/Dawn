window.addEventListener('load', () => {
    let long;
    let lat;
    let temperatureDescription = document.querySelector(".temperature-description");
    let temperatureDegree = document.querySelector(".temperature-degree");
    let locationTimezone = document.querySelector(".location-timezone");
    let temperatureSection = document.querySelector('.temperature');
    let timeStatement = document.querySelector('.time-statement');
    const temperatureSpan = document.querySelector('.temperature span');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;
            const proxy = 'https://cors-anywhere.herokuapp.com/';
            const api = `${proxy}https://api.darksky.net/forecast/adb128f4a8a2545bbebde49eee83a45a/${lat},${long}`;
            fetch(api)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    const { temperature, summary, icon, time } = data.currently;
                    // Formula for Celsius
                    let celsius = (temperature - 32) * (5 / 9);
                    // Convert time
                    let date = new Date(time * 1000);
                    let hours = date.getHours();
                    let minutes = "0" + date.getMinutes();
                    let seconds = "0" + date.getSeconds();
                    let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                    if (hours >= 19 || hours <= 5) {
                        document.body.className = "night";
                    } else if (hours > 5 && hours < 7) {
                        document.body.className = "sunrise";
                    } else if ((hours >= 7 && hours < 17) || (hours <= 17 && hours > 7)) {
                        document.body.className = "day";
                    } else if (hours > 17 && hours < 19) {
                        document.body.className = "sunset";
                    }
                    // Set DOM Elements from the API
                    temperatureDegree.textContent = celsius.toFixed(2);
                    temperatureDescription.textContent = summary;
                    locationTimezone.textContent = data.timezone.replace(/\//g, "\n");
                    timeStatement.textContent = "Weather Last Updated: " + formattedTime;
                    // Set Icon
                    setIcons(icon, document.querySelector(".icon"));
                    // Change temperature to Celsius/Fahrenheit
                    temperatureSection.addEventListener("click", () => {
                        if (temperatureSpan.textContent === "C") {
                            temperatureSpan.textContent = "F";
                            temperatureDegree.textContent = temperature;
                        } else {
                            temperatureSpan.textContent = "C";
                            temperatureDegree.textContent = celsius.toFixed(2);
                        }
                    });
                });
        });
    }
    function setIcons(icon, iconID) {
        const skycons = new Skycons({ color: "white" });
        const currentIcon = icon.replace(/-/g, "_").toUpperCase();
        skycons.play();
        return skycons.set(iconID, Skycons[currentIcon]);
    }
});