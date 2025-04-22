module.exports=(fu)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(next)

    }
}