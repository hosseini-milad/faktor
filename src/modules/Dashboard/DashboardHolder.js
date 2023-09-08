import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { useEffect } from 'react';
import { useState } from 'react';
import Cookies from 'universal-cookie';
import env from '../../env';
const cookies = new Cookies();

const faker = require('faker');

function DashBoardHolder(){
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    const [saleReport,setSaleReport] = useState('')
    const [error,setError] = useState({message:'',color:"brown"})
    const token=cookies.get('faktor-login')
    useEffect(()=>{
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({search:"search"})
          }
        fetch(env.siteApi + "/form/report-sale",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                if(result.error){
                    setError({message:result.error,color:"brown"})
                    
                }
                else{
                    setSaleReport(result.saleReport)
                }
                
            },
            (error) => {
                console.log(error)
            })
        },[])

    const data = {
        labels,
        datasets: [
          {
            label: 'Sale',
            data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
          {
            label: 'Purchase',
            data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
        ],
      };
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        ArcElement,
        Title,
        Tooltip,
        Legend
      );
      
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
      console.log(saleReport)
    return(
        <main className="container-fluid">
            <div className="boards">
                <h2>DashBoard</h2>
                <div className='charts'>
                    <Line data={data} options={options}/>
                </div>
            </div>
        </main>
    )
}
export default DashBoardHolder