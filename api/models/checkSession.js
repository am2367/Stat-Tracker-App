const checkSession = (req) => {
  //console.log('checking session')
  try{
    if(req.session.username){
      return true
    }
    else{
      return false
    }
  }
  catch(err){
    console.log(err.message);
  }
}

module.exports = checkSession;