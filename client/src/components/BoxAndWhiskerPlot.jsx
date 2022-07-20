import Chart from 'react-apexcharts';
import ReactLoading from 'react-loading';

const BoxAndWhiskerPlot = ({ data, loading }) => {
  if (!data || loading) {
    return <ReactLoading type='bubbles' color='black' />;
  }
  const options = {
    chart: {
      type: 'boxPlot',
      height: 350,
    },
    colors: ['#008FFB', '#FEB019'],
    title: {
      text: 'BoxPlot - Scatter Chart',
      align: 'left',
    },
    tooltip: {
      shared: false,
      intersect: true,
    },
  };

  data.series.forEach((d) => {
    d.data.forEach((p) => {
      p.x = Math.round(p.x);
      if (Array.isArray(p.y)) {
        p.y = p.y.map((num) => Math.round(num));
      } else {
        p.y = Math.round(p.y);
      }
    });
  });
  return (
    <Chart options={options} series={data.series} type='boxPlot' height={350} />
  );
};

export default BoxAndWhiskerPlot;
