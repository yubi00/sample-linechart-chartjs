const loadData = async () => {
  const res = await fetch("data.json");
  const data = await res.json();

  const labels = filterData(data.population, "Year");
  const countries = filterData(data.population, "Country Name");
  const populations = getPopulationByCountry(data.population, "Country Name");

  return {
    labels,
    countries,
    populations
  };
};

const createChart = async () => {
  const { labels, countries, populations } = await loadData();

  let myChart = document.getElementById("myChart").getContext("2d");
  let colors = ["blue", "green", "red"];

  return new Chart(myChart, {
    type: "line",
    data: {
      labels,
      datasets: countries.map((country, i) => {
        return {
          label: country,
          data: populations[Object.keys(populations)[i]],
          fill: false,
          borderColor: colors[i]
        };
      })
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Population by Country in the last 59 years",
          font: {
            weight: "bold",
            size: 30
          }
        },
        legend: {
          position: "top",
          labels: {
            color: "#000"
          }
        }
      },
      scales: {
        y: {
          min: 0,
          max: 1600000000,
          ticks: {
            stepSize: 100000000,
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              return value;
            }
          }
        }
      }
    }
  });
};

const filterData = (data, property) => {
  return [...new Set(data.map((d, i) => d[property]))];
};

const getPopulationByCountry = (data, property) => {
  const res = data.reduce((acc, curr, i) => {
    if (!acc[curr[property]]) {
      acc[curr[property]] = [];
    }

    acc[curr[property]].push(curr.Value);

    return acc;
  }, {});

  return res;
};

createChart();
