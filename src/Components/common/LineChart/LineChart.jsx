import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; // Import Chart object from chart.js

const LineChart = ({ x = [], y = [] }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      // Ensure previous chart instance is destroyed before creating a new one
      if (chartInstance.current !== null) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [
            {
              label: 'Wash Fastness',
              data: y,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: 'category',
              labels: x,
              title: {
                display: true,
                // text: 'Months',
              },
            },
            y: {
              ticks: {
                // min: 50,
                // max: 110,
                // stepSize: 10,
                // callback: function (value, index, ticks) {
                //   return '$' + value;
                // },
              },
            },
          },
        },
      });
    }

    // Clean up function to destroy the chart when component unmounts
    return () => {
      if (chartInstance.current !== null) {
        chartInstance.current.destroy();
      }
    };
  }, [x, y]);

  return (
    <div>
      {/* <h2>Line Chart</h2> */}
      <canvas ref={chartRef} />
    </div>
  );
};

export default LineChart;
