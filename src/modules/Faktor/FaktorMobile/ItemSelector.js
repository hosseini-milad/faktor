import { useState } from "react"
import env from "../../../env"
import { useEffect } from "react"
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import stylisRTLPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import CircularProgress from '@mui/material/CircularProgress';

function ItemSelector(props){
    const token = props.token
    const [itemPrice,setItemPrice] = useState()
    const [filterItems,setFilterItems] = useState()
    
    const [loading,setLoading] = useState("1")
    const [search,setSearch] = useState('')

    const searchItem=(searchPhrase)=>{
        searchPhrase.length>2&&
        setSearch(searchPhrase)
    }
    const cacheRtl = createCache({
        key: "muirtl",
        stylisPlugins: [stylisRTLPlugin]
      });
    useEffect(()=>{
        if(search.length<3){
            setLoading(0)
            setFilterItems('')
            return}
        setLoading(1)
        //console.log(search)
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({search:search})
          }
        fetch(env.siteApi + "/product/find-products",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                if(result.products)
                    setLoading(0)
                if(result.error){
                    props.setError({message:result.error,color:"brown"})
                    
                }
                else{
                    for(var p=0;p<result.products.length;p++)
                        result.products[p].newTitle=result.products[p].title+" | "+
                        result.products[p].sku+" | "+result.products[p].count.quantity
                    setFilterItems(result.products)
                }
                
            },
            (error) => {
                console.log(error)
            })
    },[search])
    useEffect(()=>{
        setSearch('')
        props.setItem('')
        setFilterItems('')
    },[props.clear])
    return(
        <CacheProvider value={cacheRtl}>
            <Autocomplete
            disablePortal
            getOptionLabel={((option) => option?option.newTitle:'')}
            //className={stylisRTLPlugin}
            noOptionsText='Search...'  
            options={filterItems||[]}
            onChange={(e,value)=>props.setItem(value)}
            defaultValue={props.item||''}
            renderInput={(params) => 
            <TextField {...params} label="شرح کالا" 
                InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                    <>
                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                    </>
                    ),
                }}
                onChange={(e)=>searchItem(e.target.value)}
            />}
            />
        </CacheProvider>
    )
}
export default ItemSelector