
const lib = require('lib',)({token: process.env.STDLIB_SECRET_TOKEN});
const axios = require('axios');
/**
* An HTTP endpoint that acts as a webhook for HTTP(S) request event
* @returns {object} result Your return value
*/
module.exports = async (context) => {
  let result = {}

  console.log('params:', context.params);
  
  //Find number of tests to iterate through
  let numTests = (context.params.journeys.length);
  console.log(numTests);
  
  
  for (let i = 0; i < numTests; i++) {
    
    console.log('Test'+i, context.params.journeys[i].id);
    console.log('Test'+i + 'Status',context.params.results[i].success);
    console.log('Testcase id' + i, context.params.journey_executions[i].test_cases[0].id)
    
    //Build api endpoint and request data
    var testResult = context.params.results[i].success;
    var status_id;
    if (testResult== false){
      status_id = 5;
    }
    else if(testResult == true){
      status_id = 1;
    }
    else{
      status_id = 2;
    }
    
    
    var tcId = context.params.journey_executions[i].test_cases[0].id;
    var url = "https://myInstance.testrail.com/index.php?/api/v2/add_result/" + tcId;
    var uname = process.env.uname;
    var pass = process.env.pass;
    
    let postData = JSON.stringify({
      "status_id": status_id,
      "comment": "This is an automatic mabl result from webhooks"
    })
    console.log(postData);
    let resp = await axios.post(url, postData, {
        auth: {
          username: uname,
          password: pass
        },
        headers: {
            'Content-Type': 'application/json' 
          }
      });
      console.log(resp);    
  }
  console.log('headers:', context.http.headers);
  console.log('body:', context.http.body);
  
    
  return result;
};

