import React, { useState, useEffect, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const Piet = ({ startDate, endDate }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Expenses by Category',
        data: [],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  });

  const chartRef = useRef(null);

  useEffect(() => {
    const fetchChartData = async () => {
      if (startDate && endDate) {
        try {
          const response = await fetch(`/chart?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();

          if (data) {
            const labels = Object.keys(data);
            const values = Object.values(data);

            setChartData({
              labels,
              datasets: [
                {
                  label: 'Expenses by Category',
                  data: values,
                  backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                  ],
                },
              ],
            });
          }
        } catch (error) {
          console.error('Error fetching chart data:', error);
        }
      }
    };

    fetchChartData();
  }, [startDate, endDate]);

  const handleDownload = () => {
    try {
      const chart = chartRef.current;
      if (chart) {
        const base64Image = chart.toBase64Image();
        const link = document.createElement('a');
        link.href = base64Image;
        link.download = 'chart.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error('Chart reference is not available');
      }
    } catch (error) {
      console.error('Error during download:', error);
    }
  };

  return (
    <div>
      <Pie ref={chartRef} data={chartData} />
     
      <button name={'Download'}
                    onClick={handleDownload}>Download</button>
    </div>
  );
};

export default Piet;


