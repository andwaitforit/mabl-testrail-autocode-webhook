const lib = require('lib',)({token: process.env.STDLIB_SECRET_TOKEN});
const axios = require('axios');
/**
* An HTTP endpoint that acts as a webhook for HTTP(S) request event
* @returns {object} result Your return value
*/
module.exports = async (context) => {
  let result = {}

  console.log('params:', context.params);

  const user_name = process.env.user_name;
  const password = process.env.password;
  let base_url = "https://myexample.testrail.io/index.php?/api/v2/";
  
  //Find number of tests to iterate through
  let test_cases_executed = (context.params.journeys.length);
  console.log(test_cases_executed);
  
  
  for (let i = 0; i < test_cases_executed; i++) {
    
    console.log('Test'+i, context.params.journeys[i].id);
    console.log('Test'+i + 'Status',context.params.results[i].success);
    console.log('Testcase id' + i, context.params.journey_executions[i].test_cases[0].id)
    
    //Build api endpoint and request data
    let mabl_test_result_status = context.params.results[i].success;
    let testrail_test_case_result_status;
    if (mabl_test_result_status== false){
      testrail_test_case_result_status = 5;
    }
    else if(mabl_test_result_status == true){
      testrail_test_case_result_status = 1;
    }
    else{
      testrail_test_case_result_status = 2;
    }
    
    
    let testrail_test_case_id = context.params.journey_executions[i].test_cases[0].id;
    testrail_test_case_id = testrail_test_case_id.replace( /^\D+/g, '');

    
    let testrail_add_result_url = base_url + "add_result/" + testrail_test_case_id;
    
    //Generate the JSON body to pass to testrail api call to add result of mabl executed test case
    let testrail_add_result_body = JSON.stringify({
      "testrail_test_case_result_status": testrail_test_case_result_status,
      "comment": "This is an automatic mabl result from webhooks"
    })
    console.log(testrail_add_result_body);

    //Post request to testrail to add result to project test run with mabl execution results   
    let testrail_add_result_response = await axios.post(testrail_add_result_url, testrail_add_result_body, {
        auth: {
          username: user_name,
          password: password
        },
        headers: {
            'Content-Type': 'application/json' 
          }
      });
      console.log(testrail_add_result_response);    
  }
  console.log('headers:', context.http.headers);
  console.log('body:', context.http.body);
  
    
  return result;
};
