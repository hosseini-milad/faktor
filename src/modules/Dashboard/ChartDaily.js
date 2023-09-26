import { Bar } from 'react-chartjs-2';
import { normalPrice, normalPriceCount } from '../../env';
function ChartDaily(props){
    const labels = props.labels
    const saleReport = props.data
    const cartTotal = props.cartTotal
    const data = {
        labels,
        datasets: [
          {
            label: 'فروش روزانه',
            data: labels.map((label,i) => saleReport&&saleReport[i].countData.totalPrice),
            barPercentage: 0.5,
            barThickness: 6,
            maxBarThickness: 8,
            minBarLength: 2,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)'
            ],
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
            text: 'جزئیات فروش روزانه',
          },
        },
      };
    return(<>
        <Bar data={data} options={options}/>
        <div className='chartDesc'>
          <br/>
          <ul>
            <li><small>جمع فروش روزانه: </small>
            <strong>{normalPrice(cartTotal.cartPrice)} </strong>
            </li>
            <br/>
            <li><small>جمع فروش با احتساب مالیات: </small>
            <strong>{normalPriceCount(cartTotal.cartPrice,"1.09")} </strong>
            </li>
            <li><small>تعداد فروش روزانه: </small>
            <strong>{cartTotal.cartCount} </strong>
            </li>
          </ul>
        </div>
        </>
    )
}
export default ChartDaily