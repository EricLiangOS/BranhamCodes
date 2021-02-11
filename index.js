require('dotenv').config()
const fs = require("fs");
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const clientPath = `${__dirname}/Client`;
const clientId = process.env.GITHUB_ID;
const clientSecret = process.env.GITHUB_SECRET;
const axios = require('axios');
const db_manager = require("./database.js");
const { add_user_problem } = require('./database.js');
db_manager.debug()
var problems = fs.readFileSync('problems.txt','utf-8').split("\n")
var answers = (fs.readFileSync('answers.txt','utf-8').split("\n")).map(x => parseInt(x))
app.use(express.static(clientPath));

var total_graph = new Array(100).fill(0).map(()=>new Array());
for (var x = 0; x < problems.length; x++){
    console.log(problems[x])
    var root = problems[x].split(":")[0];
    var leaves = problems[x].split(":")[1].split(",");
    for (var y = 0; y < leaves.length; y++){
        total_graph[parseInt(root) - 1].push(leaves[y].trim());
    }
}

//github login redirect
app.get('/login', (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${clientId}`);
});
//github redirect with code, exchange code for token
app.get('/oauth-callback', (req, res) => {
  const body = {
    client_id: clientId,
    client_secret: clientSecret,
    code: req.query.code
  };
  const opts = { headers: { accept: 'application/json' } };
  axios.post(`https://github.com/login/oauth/access_token`, body, opts).
    then(res => res.data['access_token']).
    then(async function(_token) {
        console.log('My token:', _token);
        var username = "";
        var avatar_url = "";
        var user_string = "";
        //get the username and image
        axios({
            method: "get",
            url: `https://api.github.com/user`,
            headers: {
                Authorization: `token ${_token}`,
                "Content-Type": "application/json"
            },
            })
            .then(async function(result) {
                //attempt to add user to the database
                username = result.data.login
                avatar_url = result.data.avatar_url
                await db_manager.add_user(result.data.login, result.data.avatar_url)
                await db_manager.print_users()
                user_string = await db_manager.get_user_string(username)
                console.log(username)
                res.redirect(`/?username=${username}&avatar_url=${avatar_url}&user_string=${user_string}`);
            })
            .catch(err => {
                console.log(err);
            });
       
    }).
    catch(err => res.status(500).json({ message: err.message }));
});

io.on('connection', function (socket) {
    socket.on('get_user_problems',async (user_string)=>{
        var graph = new Array(100).fill(0).map(()=>new Array());
        if (await db_manager.check_user_string(user_string)){
            var unlocked_problems = (await db_manager.get_user_problems(user_string)).map(x => x.toString());
            for (var x = 0; x < problems.length; x++){
                var root = problems[x].split(":")[0];
                if (unlocked_problems.includes(root)){
                    var leaves = problems[x].split(":")[1].split(",");
                    for (var y = 0; y < leaves.length; y++){
                        if (unlocked_problems.includes(leaves[y].trim())){
                            graph[parseInt(root) - 1].push(leaves[y].trim());
                        }
                    }
                }
            }
        }
        socket.emit("get_user_problems", graph);
    })
    socket.on("submit_answer", async (answer_object) => {
        var user_string = answer_object.user_string
        var problem = answer_object.problem
        var answer = answer_object.answer
        if (problem < answers.length && parseInt(answers[problem - 1]) == parseInt(answer)){
            if (user_string == "guest"){
                socket.emit("correct_guest")
            }
            else{
                //make sure the user hasn't submitted less the one minute ago
                if (await db_manager.check_submit_time(user_string, Date.now())){
                    //add new problems to the user
                    if (await db_manager.check_user_string(user_string)){
                        //make sure the user has the problem
                        unlocked = false;
                        for (var x = 0; x < problem; x++){
                            if (total_graph[x].includes(problem.toString())){
                                if (await db_manager.check_user_problem(user_string, x + 1)){
                                    unlocked = true;
                                }
                            }
                        }
                        if (problem == 1){
                            unlocked = true;
                        }
                        //if problem is unlocked then give it to the user
                        if (unlocked){
                            console.log(problem)
                            for (var x = 0; x < total_graph[problem - 1].length; x++){
                                await db_manager.add_user_problem(user_string, total_graph[problem - 1][x])
                            }
                            await db_manager.add_user_problem(user_string, problem)
                            //send corrent alert to the user and reload the page
                            socket.emit("correct")
                        }
                    }
                }
                else{
                    console.log("submitted too soon")
                }
            }
        }
        else{
            socket.emit("wrong_answer")
        }
    })
})

server.listen(process.env.PORT, () =>{
    console.log(`Server started on ${process.env.PORT}`);
});