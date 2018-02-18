var request = require('request');

var headers = {
    'App-Id': '16e79581',
    'App-Key': 'b14a2bfab21d89c6e1867b34303eb890',
    'Content-Type': 'application/json'
};

var dataString = '{"text": "I have a runny nose and my head hurts and my stomach hurts"}';
//console.log(dataString.text);

var options = {
    url: 'https://api.infermedica.com/v2/parse',
    method: 'POST',
    headers: headers,
    body: dataString
};

function callback(error, response, body) {
    //console.log(JSON.parse(body));
    if (!error && response.statusCode == 200) {
        var json_body = JSON.parse(body);
        console.log(json_body);
        var symp_arr = [];

        for (i in json_body['mentions']) {
            symp_arr[i] = json_body['mentions'][i]['name'];
        }

        var final_string = "My diagnosis shows that you have symptoms of " + symp_arr.toString();
        console.log(final_string);
    }
}

request(options, callback);