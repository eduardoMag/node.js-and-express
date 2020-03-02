//  FORMS


//basic form processing
app.post('/process-contact', (req, res)=>{
  console.log('Received contact from '+req.body.name+' <'+req.body.email+'>');
//save to database...
res.redirect(303, '/thank-you');
});

//more robust form processing
app.post('/process-contact', (req, res)=>{
  console.log('Received contact from '+req.body.name+' <'+req.body.email+'>');
  try{
    //save to database...
    return res.xhr ?
    res.render({success: true}) :
    res.redirect(303, '/thank-you');
  } catch(ex){
    return res.xhr ?
    res.json({error: 'Database error'}) :
    res.redirect(303, '/database-error');
  }
});
