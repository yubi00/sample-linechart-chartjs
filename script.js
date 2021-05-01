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
  console.log(labels, countries, populations);

  let myChart = document.getElementById("myChart").getContext("2d");
  let colors = ["blue", "green", "red"];

  return new Chart(myChart, {
    type: "line", //bar, horizontal bar, pie, line, dougnut, radar, polar area
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
      }
    }
  });
};

const filterData = (data, property) => {
  return [...new Set(data.map((d, i) => d[property]))];
};

const getPopulationByCountry = (data, property) => {
  let population = [];
  const res = data.reduce((acc, curr, i) => {
    if (acc[curr[property]]) {
      population.push(curr.Value);
      acc[curr[property]] = population;

      if (i < data.length - 1 && data[i + 1][property] !== curr[property]) {
        //resset population for different country
        population = [];
      }
    } else {
      acc[curr[property]] = [...population, curr.Value];
    }

    return acc;
  }, {});

  return res;
};

createChart();
