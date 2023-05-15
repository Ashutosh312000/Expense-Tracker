const obj1={}
const removeInnerObjects=(obj)=>{
    const keys=Object.keys(obj);
    const values=Object.values(obj);

  console.log(keys,values)
 }

removeInnerObjects({name:"siva"
,address:{state:"ap",capital:"amaravathi",mandal:"Atchampeta"},
education:{ssc:"jaibharat",inter:"lalitha",btech:"KL University"}});

