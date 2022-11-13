
const onlyServicesAccess = ()=>{


    return (req, res, next)=>{
        console.log(req.headers)
        if(req.headers['client-key']){
            // this is from the client 
            next()
        }else
        // service access
        if(req.headers['service-key']){
            next()
        }else{
            return res.json({
                success: false,
                auth: false,
                message: " Access rejected",

            });
        }
    }
}

module.exports = onlyServicesAccess ;