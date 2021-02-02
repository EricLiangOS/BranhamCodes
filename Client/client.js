/*kdraw.canvas.width = window.innerWidth
kdraw.canvas.height = window.innerHeight
width = kdraw.canvas.width
height = kdraw.canvas.width*/

const socket = io("")
const config = {
    nodeCaption: function(node){
        return "Problem  " + node.name;
    },
    fixNodes:false,
    nodeCaptionsOnByDefault: true,
    nodeTypes: { "type": 
                ["solved", "unsolved"] 
            }, 
    fixRootNodes:true,
    nodeRadius:20,
    rootNodeRadius:70,
    initialTranslate: [0,0],
    nodeStyle: {
        "solved": {
            "radius": function(d) {
                if(d.getProperties().root)
                return 20; else return 10 
            }, 
            "color"  : function(d) {
                if(d.getProperties().root)
                return "#0366fc"; else return "#68B9FE" 
            },
            "borderColor": "none"
        },
        "unsolved":{
            "radius": function(d) {
                if(d.getProperties().root)
                return 20; else return 10 
            }, 
            "color"  : function(d) {
                return "#ff3333" 
            },
            "borderColor": "none",
            "opacity": 0.2
        }
    },
    edgeStyle: {
        "all": {
          "width": 4,
          "color": "#CCC",
          "opacity": 0.2,
          "selected": {
            },
          "highlighted": {
                "color": "#CCC",
            },
          "hidden": {
                "color": "#CCC",
            }
        }
      }
}
function graphToJson(graph){
    var nodes = [1];
    //gather all individual nodes from graph
    for (var x = 0; x < graph.length; x++){
        for (var y = 0; y < graph[x].length; y++){
            if (!nodes.includes(graph[x][y])){
                nodes.push(graph[x][y]);
            }
        }
    }
    var jsonGraph = {
        "nodes":[],
        "edges":[]
    };
    //push all the individual nodes into the jsonGraph
    for (var x = 0; x < nodes.length; x++){
        jsonGraph.nodes.push(
            {
                "name":nodes[x],
                "id":nodes[x]
            }
        )
        if (nodes[x] == 1){
            jsonGraph.nodes[jsonGraph.nodes.length - 1].root = true;
        }
        if (graph[nodes[x] - 1].length == 0){
            jsonGraph.nodes[jsonGraph.nodes.length - 1].type = "unsolved";
        }
        else{
            jsonGraph.nodes[jsonGraph.nodes.length - 1].type = "solved";
        }
    }
    //push all the individual edges into the jsonGraph
    for (var x = 0; x < graph.length; x++){
        for (var y = 0; y < graph[x].length; y++){
            jsonGraph.edges.push(
                {
                    "source": x + 1,
                    "target": graph[x][y]
                }
            )
        }
    }
    //return the built json
    return jsonGraph;
}

//function to set user's profile image and name
function set_name(name, link){
    document.getElementById("username").innerHTML = name
    document.getElementById("profile_pic").src = link
    console.log(name, link)
}
//check if user is logged in and send them their problems
window.onload = function WindowLoad(event) {
    if (localStorage.getItem('user_string') != null){
        set_name(localStorage.getItem('username'), localStorage.getItem('avatar_url'))
        socket.emit("get_user_problems", localStorage.getItem('user_string'));
    }
    else{
        const urlParams = new URLSearchParams(window.location.search)
        const queryString = window.location.search;
        if(urlParams.get('user_string')){
            console.log(urlParams.get('user_string'))
            localStorage.setItem('user_string',urlParams.get('user_string'))
            localStorage.setItem('avatar_url',urlParams.get('avatar_url'))
            localStorage.setItem('username',urlParams.get('username'))
            console.log(urlParams.get('avatar_url'))
            set_name(urlParams.get('username'), urlParams.get('avatar_url'))
            socket.emit("get_user_problems", urlParams.get('user_string'))
        }
        else{
            socket.emit("get_user_problems", "guest")
        }
    }
    //handle problem submits
    const urlParams = new URLSearchParams(window.location.search)
    for (var key of urlParams.keys()){
        if (key.substring(1) == "_submit"){
            var user_string;
            if(localStorage.getItem('user_string') != null){
                user_string = localStorage.getItem('user_string')
            }
            else{
                user_string = "guest"
            }
            var problem = parseInt(key)
            var answer = urlParams.get(key)
            socket.emit("submit_answer", {"problem":problem, "user_string":user_string, "answer":answer})
        }
    }
}

//generate graph when user problems have been sent
socket.on("get_user_problems", (user_graph)=>{
    graph = user_graph;
    jsonGraph = graphToJson(graph);
    config.dataSource = jsonGraph;
    alchemy.begin(config);
})

//handle correct answer
socket.on("correct", () =>{
    //clear url parameters
    window.history.pushState({}, document.title, "/");
    location.reload()
})



