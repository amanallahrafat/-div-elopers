const trimMonogoObj=(obj,deletedProperties)=>{
   return Object.keys(obj).reduce((object, key) => {
        if (!deletedProperties.includes(key)  ) {
          object[key] = obj[key]
        }
        return object
      }, {})
}

module.exports={
    trimMonogoObj,
}