import { useState } from "react"
import Paging from "../../components/Paging"
import ProductNewItem from "./ProductNewItem"
import { useEffect } from "react"
import Cookies from 'universal-cookie';
import env from "../../env";
const cookies = new Cookies();

function ProductRegTable(props){
    const [productList,setProductList] = useState([]) 
    const [newItem,setNewItem] = useState()
    const [error,setError] = useState({message:'',color:"brown"})
    console.log(productList)
    const token=cookies.get('fiin-login')
    useEffect(()=>{
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({})
          }
        fetch(env.siteApi + "/product/products",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                if(result.error){
                    setError({message:result.error,color:"brown"})
                    
                }
                else{
                    setProductList(result.products)
                }
                
            },
            (error) => {
                console.log(error)
            })
    },[])
    const saveFunction=()=>{
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify(newItem)
          }
        fetch(env.siteApi + "/product/update-product",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                if(result.error){
                    setError({message:result.error,color:"brown"})
                    
                }
                else{
                    setProductList(result.products)
                }
                
            },
            (error) => {
                console.log(error)
            })
    }
    return(<>
        <table>
            <thead>
                <tr>
                    <th width="7.5%">Row</th>
                    <th width="7.5%">Item</th>
                    <th width="10%">SKU</th>
                    <th width="10%">Desc</th>
                    <th width="10%">Count</th>
                </tr>
            </thead>
            <tbody>
                <ProductNewItem setNewItem={setNewItem} newItem={newItem} saveFunction={saveFunction}/>
                {productList.length?productList.map((product,i)=>(
                <tr key={i} style={{backgroundColor:"lightGreen"}}>
                    <td>{i+1}</td>
                    <td>{product.sku}</td>
                    <td>{product.title}</td>
                    <td>{product.sku}</td>
                    <td><a href={"/profile/"+product.sku}>Editar</a></td>
                </tr>)):
                <tr><td>Waiting</td></tr>}
                
            </tbody>
        </table>
        <Paging size={props.users&&props.users.size} 
            setPageNumber={props.setPageNumber} 
            pageNumber={props.pageNumber} perPage={5}
            setDoFilter={props.setDoFilter}/>
            
        </>
        
    )
}
export default ProductRegTable