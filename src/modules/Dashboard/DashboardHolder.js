
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    registerables ,
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
import ChartDaily from './ChartDaily';
import ChartSale from './ChartSale';
import ChartItem from './ChartItem';
const cookies = new Cookies();

const faker = require('faker');

function DashBoardHolder(){
    const [labelSale,setSaleLabels] = useState([])
    const [labelDaily,setDailyLabels] = useState([])
    //const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    const [saleReport,setSaleReport] = useState('')
    const [saleDaily,setDailyReport] = useState('')
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
                console.log(result)
                if(result.error){
                    setError({message:result.error,color:"brown"})
                    
                }
                else{
                    setSaleReport(result.cartTotal)
                    var dates = result.outputReport.map(item=>new Date(item.date).toLocaleDateString('fa-IR'))
                    setSaleLabels(dates)
                    
                    setDailyReport(result.cart)
                    var users = result.cart.map(item=>
                        item.userData[0]?item.userData[0].username:item.adminData[0].username)
                    setDailyLabels(users)
                }
                
            },
            (error) => {
                console.log(error)
            })
        },[])

    
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        ArcElement,
        Title,
        Tooltip,
        Legend,
        ...registerables
      );
      ChartJS.defaults.font.family = "Vazir";
    return(
        <main className="container-fluid">
            <div className="chartHolder">
                <div className='charts'>
                  <ChartDaily labels={labelDaily} data={saleDaily}
                    cartTotal={saleReport} ChartJS={ChartJS}/>
                    

                </div>
                {/*<div className='charts'>
                  <ChartSale labels={labelSale} data={saleReport} ChartJS={ChartJS}/>
                    
    </div>*/}
                <div className='charts'>
                  <ChartItem token={token}/>
                  <small></small>
                </div>
            </div>
        </main>
    )
}
export default DashBoardHolder