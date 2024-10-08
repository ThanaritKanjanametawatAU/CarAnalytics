import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './DashboardPage.css';
import carDataOG from '/src/assets/taladrod-cars.json';

// Registering necessary Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);


// DashboardPage component
const DashboardPage = () => {
    const [carData, setCarData] = useState(null);
    const [fullCarData, setFullCarData] = useState(null); // New state for full data
    const [collapsedBrands, setCollapsedBrands] = useState({});
    const [sortConfig, setSortConfig] = useState({ key: 'Car Model Name', direction: 'ascending' });
    const [colorMap, setColorMap] = useState({});
    const toggleBrandCollapse = (brand) => {
    setCollapsedBrands(prevState => ({
        ...prevState,
        [brand]: !prevState[brand],
    }));
  
    };



    // UseEffect to process the car data
    useEffect(() => {
        const processedData = processCarData(carDataOG.Cars);
        const fullProcessedData = processFullCarData(carDataOG.Cars); // Process full data

        setCarData(processedData);
        setFullCarData(fullProcessedData); // Set full data

        generateColorMap(fullProcessedData.brands);

        // Initialize all brands as collapsed
        const initialCollapseState = Object.keys(fullProcessedData.brands).reduce((acc, brand) => {
        acc[brand] = true; // true means collapsed
        return acc;
        }, {});
        setCollapsedBrands(initialCollapseState);
    }, []);




    // Function to process the full car data
    const processFullCarData = (cars) => {
    const brands = {};

    cars.forEach(car => {
        const brandName = car.NameMMT.split(' ')[0];
        const modelName = car.Model;
    
        // Convert the price string to a number
        const price = parseInt(car.Prc.replace(/,/g, ''), 10);

        if (!brands[brandName]) {
            brands[brandName] = {
                total: 0,
                value: 0,
                models: {},
            };
        }

        if (!brands[brandName].models[modelName]) {
            brands[brandName].models[modelName] = {
            count: 0,
            value: 0,  // Initialize value to accumulate model prices
        };
        }

        brands[brandName].total += 1;
        brands[brandName].value += price;  // Accumulate brand price
        brands[brandName].models[modelName].count += 1;
        brands[brandName].models[modelName].value += price;  // Accumulate model price
    });

    return { brands };
    };



    // Function to process the car data before Top 5 Brands
    const processCarData = (cars) => {
    const brands = {};

    // Initialize the brands object with each car's brand and model data
    cars.forEach(car => {
        const brandName = car.NameMMT.split(' ')[0];
        const modelName = car.Model;

        if (!brands[brandName]) {
            brands[brandName] = {
            total: 0,
            models: {},
            };
        }

        if (!brands[brandName].models[modelName]) {
            brands[brandName].models[modelName] = 0;
        }

        brands[brandName].total += 1;
        brands[brandName].models[modelName] += 1;
        });

        // Collect all unique models across all brands
        const allModels = new Set();
        Object.values(brands).forEach(brand => {
            Object.keys(brand.models).forEach(model => allModels.add(model));
        });


        // Ensure every brand has an entry for every model, even if it's 0
        Object.keys(brands).forEach(brand => {
            allModels.forEach(model => {
            if (!brands[brand].models[model]) {
                brands[brand].models[model] = 0;
            }
        });
        });

        return processTopBrands(brands);
    };



    // Function to process the top 5 brands
    const processTopBrands = (brands) => {
        // Sort brands by total number of cars
        const sortedBrands = Object.entries(brands).sort((a, b) => b[1].total - a[1].total);

        const topBrands = sortedBrands.slice(0, 5);
        const otherBrands = sortedBrands.slice(5);

        const topBrandsData = {};
        let otherTotal = 0;
        const otherModels = {};

        topBrands.forEach(([brand, data]) => {
            topBrandsData[brand] = data;
        });

        otherBrands.forEach(([brand, data]) => {
            otherTotal += data.total;
            Object.entries(data.models).forEach(([model, count]) => {
            if (!otherModels[model]) {
                otherModels[model] = 0;
            }
            otherModels[model] += count;
        });
        });

        topBrandsData["Other Brands"] = {
            total: otherTotal,
            models: otherModels,
        };

        return { brands: topBrandsData };
        };





  
  
    const generateColorMap = (brands) => {
    const colors = {};
    let index = 0;
    Object.keys(brands).forEach(brand => {
      Object.keys(brands[brand].models).forEach(model => {
        if (!colors[model]) {
          colors[model] = `hsl(${index * 137.5}, 70%, 60%)`; // Generates consistent colors
          index++;
        }
      });
    });
    setColorMap(colors);
  };

  
  
  
  

const sortTable = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
        direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedBrands = Object.keys(fullCarData.brands).sort((a, b) => {
        if (key === 'Car Model Name') {
            if (a < b) return direction === 'ascending' ? -1 : 1;
            if (a > b) return direction === 'ascending' ? 1 : -1;
            return 0;
        } else if (key === 'Quantity') {
            return direction === 'ascending'
                ? fullCarData.brands[a].total - fullCarData.brands[b].total
                : fullCarData.brands[b].total - fullCarData.brands[a].total;
        } else if (key === 'Value') {
            return direction === 'ascending'
                ? fullCarData.brands[a].value - fullCarData.brands[b].value
                : fullCarData.brands[b].value - fullCarData.brands[a].value;
        }
        return 0;
    });

    const sortedFullCarData = sortedBrands.reduce((acc, brand) => {
        const sortedModels = Object.keys(fullCarData.brands[brand].models).sort((a, b) => {
            if (key === 'Car Model Name') {
                if (a < b) return direction === 'ascending' ? -1 : 1;
                if (a > b) return direction === 'ascending' ? 1 : -1;
                return 0;
            } else if (key === 'Quantity' || key === 'Value') {
                return direction === 'ascending'
                    ? fullCarData.brands[brand].models[a].value - fullCarData.brands[brand].models[b].value
                    : fullCarData.brands[brand].models[b].value - fullCarData.brands[brand].models[a].value;
            }
            return 0;
        });

        acc[brand] = {
            ...fullCarData.brands[brand],
            models: sortedModels.reduce((modelAcc, model) => {
                modelAcc[model] = fullCarData.brands[brand].models[model];
                return modelAcc;
            }, {}),
        };
        return acc;
    }, {});

    setFullCarData({
        ...fullCarData,
        brands: sortedFullCarData,
    });
};




  // Check if the car data has been loaded
  if (!carData || !fullCarData) {
    return <div>Loading...</div>;
  }




  // Pie chart data
  const pieData = {
    labels: Object.keys(carData.brands),
    datasets: [
      {
        data: Object.values(carData.brands).map(brand => brand.total),
        backgroundColor: Object.keys(carData.brands).map(brand => colorMap[Object.keys(carData.brands[brand].models)[0]]),
      },
    ],
  };

// Stacked bar chart data
const barData = {
  labels: Object.keys(carData.brands),
  datasets: Object.keys(carData.brands[Object.keys(carData.brands)[0]].models)
    .map((model) => ({
      label: model,
      data: Object.keys(carData.brands).map(brand => carData.brands[brand].models[model] || 0),
      backgroundColor: colorMap[model],
    }))
    // Sort datasets by the total count in descending order
    .sort((a, b) => {
      const totalA = a.data.reduce((acc, value) => acc + value, 0);
      const totalB = b.data.reduce((acc, value) => acc + value, 0);
      return totalB - totalA; // Sort from most to least
    }),
};




  // Debugging: check the structure of barData
  console.log('Bar Data:', barData);



  
  return (
      <div style={{padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <h1 style={{textAlign: 'center'}}>Dashboard</h1>

          <h2>Top 5 Brands of the Month</h2>

          <div style={{display: 'flex', justifyContent: 'space-around', width: '100%'}}>


              {/* Pie Chart */}
              <div style={{width: '30%'}}>
                  <Pie data={pieData}/>
              </div>


              {/* Bar Chart */}
              <div style={{width: '60%'}}>
                  <Bar
                      data={barData}
                      options={{
                          scales: {
                              x: {
                                  stacked: true
                              },
                              y: {
                                  stacked: true,
                                  beginAtZero: true
                              }
                          },
                          plugins: {
                              legend: {
                                  display: false // This will disable the legend
                              }
                          }
                      }}
                  />
              </div>
          </div>


          {/* Table */}
          <div style={{marginTop: '100px', width: '80%'}}>
              <table border="1" cellPadding="10" cellSpacing="0" style={{width: '100%'}}>

                  {/*Table Header*/}
                  <thead>
                  <tr>
                      <th onClick={() => sortTable('Car Model Name')} style={{cursor: 'pointer', userSelect: 'none'}}>
                          Car Model
                          Name {sortConfig.key === 'Car Model Name' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '▼'}
                      </th>
                      <th onClick={() => sortTable('Quantity')} style={{cursor: 'pointer', userSelect: 'none'}}>
                          Quantity {sortConfig.key === 'Quantity' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '▼'}
                      </th>
                      <th onClick={() => sortTable('Value')} style={{cursor: 'pointer', userSelect: 'none'}}>
                          Value
                          (Baht) {sortConfig.key === 'Value' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '▼'}
                      </th>
                  </tr>
                  </thead>


                  {/*Table Body*/}
                  <tbody>
                  {Object.keys(fullCarData.brands).map((brand) => (
                      <React.Fragment key={brand}>
                          <tr
                              className="brand-row"
                              style={{cursor: 'pointer'}}
                              onClick={() => toggleBrandCollapse(brand)}
                          >
                              <td>
                                  <i className={`bi ${collapsedBrands[brand] ? 'bi-caret-right-fill' : 'bi-caret-down-fill'}`}
                                     style={{marginRight: '10px'}}></i>
                                  {brand}
                              </td>
                              <td className="number-cell">{fullCarData.brands[brand].total.toLocaleString()}</td>
                              <td className="number-cell">{fullCarData.brands[brand].value.toLocaleString()}</td>
                          </tr>
                          {!collapsedBrands[brand] && (
                              Object.keys(fullCarData.brands[brand].models).map((model) => (
                                  <tr key={model} className="model-row">
                                      <td>{model}</td>
                                      <td className="number-cell">{fullCarData.brands[brand].models[model].count.toLocaleString()}</td>
                                      <td className="number-cell">{fullCarData.brands[brand].models[model].value.toLocaleString()}</td>
                                  </tr>
                              ))
                          )}
                      </React.Fragment>
                  ))}
                  </tbody>


              </table>
          </div>


          {/*Total Cars*/}
          <h2>Total
              Cars: {Object.keys(fullCarData.brands).reduce((total, brand) => total + fullCarData.brands[brand].total, 0)}</h2>

      </div>
  );

};

export default DashboardPage;
