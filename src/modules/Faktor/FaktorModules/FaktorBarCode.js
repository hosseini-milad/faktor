import { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
function BarCodeFaktor(){
    const [barCode,setBarCode] = useState('')
    return(<div className="barCodeHolder">
        <p>{barCode}</p>
        <BarcodeScannerComponent
        width={400}
        height={400}
        onUpdate={(err, result) => {
            console.log(err)
          if (result) setBarCode(result.text);
          else setBarCode("Not Found");
        }}
      />
      </div>
    )
}
export default BarCodeFaktor