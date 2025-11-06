import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Gera uma cor RGB pastel a partir de uma string (nome do bairro)
const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const r = (hash >> 0) & 0xff;
  const g = (hash >> 8) & 0xff;
  const b = (hash >> 16) & 0xff;
  // tornar as cores mais suaves (pastel)
  const pastel = (v) => Math.round((v + 255) / 2);
  return `rgba(${pastel(r)}, ${pastel(g)}, ${pastel(b)}, 0.75)`;
};

const ObrasGraph = ({ obras }) => {
  const bairrosCount = obras.reduce((acc, obra) => {
    const bairro = obra.bairro && obra.bairro.trim() !== '' ? obra.bairro : 'Não informado';
    acc[bairro] = (acc[bairro] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(bairrosCount).sort((a, b) => bairrosCount[b] - bairrosCount[a]);
  const dataValues = labels.map((l) => bairrosCount[l]);
  const backgroundColor = labels.map((l) => stringToColor(l));

  const data = {
    labels,
    datasets: [
      {
        label: 'Obras por Bairro',
        data: dataValues,
        backgroundColor,
        borderColor: backgroundColor.map((c) => c.replace(/0\.75\)$/, '1)')),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Distribuição de Obras por Bairro',
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 0,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default ObrasGraph;
