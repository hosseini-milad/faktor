import { Line } from 'react-chartjs-2';
function ChartSale(props){
    const labels = props.labels
    const saleReport = props.data
    const data = {
        labels,
        datasets: [
          {
            label: 'فروش',
            data: labels.map((label,i) => saleReport&&saleReport[i].price),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          }/*,
          {
            label: 'Purchase',
            data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },*/
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
            text: 'Chart Description',
          },
        },
      };
    return(
        <Line data={data} options={options}/>
    )
}
export default ChartSale