const APIKey = `e5037c0a46804d8483a225943240201`;
const rowData = document.getElementById("rowData");
const searchInput = document.getElementById("searchWeather");

async function getWeather(city = "Cairo") {
  if (city.length < 3 && isNaN(city)) return;

  try {
    const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${APIKey}&q=${city}&days=3`);
    const data = await res.json();

    rowData.innerHTML = data.forecast.forecastday.map((day, i) => {
      const isToday = i === 0;
      const date = new Date(day.date);
      const weekDay = date.toLocaleDateString("en-US", { weekday: "long" });
      const dayNum = date.getDate();
      const month = date.toLocaleDateString("en-US", { month: "long" });

      return `
        <div class="col-md-4">
          <div class="custom-card p-3 h-100 ${isToday ? 'bg-main' : 'bg-secondary'} shadow-sm">
            <div class="d-flex justify-content-between mb-2">
              <span>${weekDay}</span>
              ${isToday ? `<span>${dayNum} ${month}</span>` : ''}
            </div>
            
            ${isToday ? `<h5 class="text-info">${data.location.name}</h5>` : ''}

            <div class="text-center my-2">
              <img src="${isToday ? data.current.condition.icon : day.day.condition.icon}" 
                   alt="weather icon" style="width: 64px;" />
            </div>

            <div class="text-center">
              ${isToday ? `<h2 class="fw-bold">${data.current.temp_c}°C</h2>` : `
                <p class="mb-1">Max: ${day.day.maxtemp_c}°C</p>
                <p class="mb-1">Min: ${day.day.mintemp_c}°C</p>`}
            </div>

            <p class="text-center">${isToday ? data.current.condition.text : day.day.condition.text}</p>

            ${isToday ? `
              <div class="d-flex justify-content-between text-center small mt-3">
                <span><i class="fa-solid fa-umbrella"></i> ${day.day.daily_chance_of_rain}%</span>
                <span><i class="fa-solid fa-wind"></i> ${data.current.wind_kph} km/h</span>
                <span><i class="fa-solid fa-compass"></i> ${data.current.wind_dir}</span>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join("");

  } catch (error) {
    rowData.innerHTML = `<div class="alert alert-danger text-center">⚠️ Error loading data</div>`;
  }
}

searchInput.addEventListener("input", (e) => {
  const city = e.target.value.trim();
  if (city.length >= 3) {
    getWeather(city);
  }
});

navigator.geolocation.getCurrentPosition(
  (pos) => getWeather(`${pos.coords.latitude},${pos.coords.longitude}`),
  () => getWeather()
);
