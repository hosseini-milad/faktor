import { useEffect, useState } from "react"
import { Line ,Doughnut} from 'react-chartjs-2';
import env from "../../env"

function ChartItem(props){
    const [report,setReport] = useState('')
    const [error,setError] = useState({message:'',color:"brown"})
    const [labels,setLabels] = useState([])
    const [itemsList,setItemsList] = useState('')

    const token = props.token
    useEffect(()=>{
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({search:"search"})
          }
        fetch(env.siteApi + "/form/report-board",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                if(result.error){
                    setError({message:result.error,color:"brown"})
                    
                }
                else{
                    var items = result.outputReport.map((item,i)=>
                        (item.title+"\n("+item.sku+")"))
                    setLabels(items.splice(0,5))
                    setItemsList(result.outputReport)
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
                label: 'فروش',
                data: labels.map((label,i) => i<5&&itemsList&&itemsList[i].count),
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                    'rgb(55, 99, 132)',
                    'rgb(154, 62, 135)',
                    'rgb(155, 105, 186)'
                  ],
                backgroundColor: [
                    'rgba(255, 99, 132 ,.5)',
                    'rgba(54, 162, 235 ,.5)',
                    'rgba(255, 205, 86 ,.5)',
                    'rgba(55, 99, 132 ,.5)',
                    'rgba(154, 62, 135 ,.5)',
                    'rgba(155, 105, 186 ,.5)'
                  ],
              }
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
        <Doughnut data={data} options={options}/>
    )
}
export default ChartItem