import { normalPriceCount } from "../../../env"

function PriceSet(props){
    const item = props.item
    const priceData = item.priceData&&
        item.priceData.find(item=>item.saleType===props.payValue).price
    
    return(
        <table>
            <tbody>
                <tr>
                    <td>فی</td>
                    <td>{normalPriceCount(priceData,1)}</td>
                </tr>
                <tr>
                    <td>مالیات</td>
                    <td>{normalPriceCount(priceData,"0.09",props.count)}</td>
                </tr>
                <tr>
                    <td>جمع کل</td>
                    <td>{normalPriceCount(priceData,"1.09",props.count)}</td>
                </tr>
            </tbody>
        </table>
    )
}
export default PriceSet