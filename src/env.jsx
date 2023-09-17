const env={
    //siteApi:'http://localhost:4090/api',
    siteApi:'https://faktoradmin.dkmehr.com/api',
    //siteApi:'https://saleadmin.sharifoilco.com/api',

    //siteApiUrl:'http://localhost:4090',
    siteApiUrl:'https://faktoradmin.dkmehr.com',
    //siteApiUrl:'https://saleadmin.sharifoilco.com',

    columnOrder:['lead','informations','fiin','property','seguros',
        'escritura','commissions','suspended']
}
export default env
var fulldays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const dayFromNow=(originDate)=>{
    var dt = new Date(originDate),
        time=formatAMPM(dt),
        date = dt.getDate(),
        month = months[dt.getMonth()],
        timeDiff = originDate - Date.now(),
        diffDays = new Date().getDate() - date,
        diffMonths = new Date().getMonth() - dt.getMonth(),
        diffYears = new Date().getFullYear() - dt.getFullYear();

    if(diffYears === 0 && diffDays === 0 && diffMonths === 0){
      return `Today at ${time}` ;
    }else if(diffYears === 0 && diffDays === 1) {
      return `Yesterday at ${time}`;
    }else if(diffYears === 0 && diffDays === -1) {
      return "Tomorrow";
    }else if(diffYears === 0 && (diffDays < -1 && diffDays > -7)) {
      return fulldays[dt.getDay()];
    }else if(diffYears >= 1){
      return month + " " + date + ", " + new Date(originDate).getFullYear();
      }else {
        return month + " " + date;
      }
}
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

export const normalDate=(dateObj)=>{
  return(dateObj.year+'/'+dateObj.month+'/'+dateObj.day)
}
export const splitDate=(dateRaw)=>{
  try{
    const dateArray = dateRaw.split('/')
  return({year:parseInt(dateArray[0]),
    month:parseInt(dateArray[1]),
    day:parseInt(dateArray[2])})
  }
  catch{return}
}
export function normalPrice(priceText){
  if(!priceText||priceText === null||priceText === undefined) return("")
  
  var rawPrice = priceText.toString().replace(/\D/g,'')
  //console.log(rawPrice,priceText)
  return(
    (rawPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",").replace( /^\D+/g, ''))
  )
}
export function normalPriceCount(priceText,count){
  if(!priceText||priceText === null||priceText === undefined) return("")
  var rawCount = parseFloat(count.toString())
  var rawPrice = Math.round(parseInt(priceText.toString().replace(/\D/g,''))*rawCount)
  rawPrice = parseInt(rawPrice)
  return(
    (rawPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",").replace( /^\D+/g, ''))
  )
}
export function defferPrice(priceText,minus){
  if(!priceText||priceText === null||priceText === undefined) return("")
  var rawMinus = parseInt(minus.toString().replace(/\D/g,''))
  var rawPrice = parseInt(priceText.toString().replace(/\D/g,''))
  //console.log(rawPrice,priceText)

  return(
    ((rawPrice>rawMinus?"+":"-")+
      (rawPrice-rawMinus).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",").replace( /^\D+/g, ''))
  )
}
