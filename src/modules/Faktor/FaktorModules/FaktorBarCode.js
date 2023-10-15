import { useState } from "react";
import BarcodeScannerComponent from "react-webcam-barcode-scanner";
import env from "../../../env";
function BarCodeFaktor(props){
    const [barCode,setBarCode] = useState('ُSearching')
    const findProduct=(sku)=>{
      const postOptions={
        method:'post',
        headers: { 'Content-Type': 'application/json'},
        body:JSON.stringify({search:sku})
      }
      fetch(env.siteApi + "/product/find-products",postOptions)
    .then(res => res.json())
    .then(
        (result) => {
            if(result.error){
                setBarCode(result.error)
                setTimeout(()=>setBarCode(''),3000)
            }
            else{
                setBarCode("کالا پیدا شد")
                setTimeout(()=>setBarCode(''),1000)
                
                props.setItem(result)
                props.setBarCodeMode(0);
            }
        },
        (error) => {
            console.log(error)
        })
    }
    return(<div className="barCodeHolder">
        <p>{barCode}</p>
        <BarcodeScannerComponent
        width="100%"
        height="100%"
        onUpdate={(err, result) => {
          if (result){
            findProduct(result.text)
          }
        }}
      />
      </div>
    )
}
export default BarCodeFaktor