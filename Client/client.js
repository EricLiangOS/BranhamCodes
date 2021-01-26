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


window.onload = function WindowLoad(event) {
    const urlParams = new URLSearchParams(window.location.search)
    const queryString = window.location.search;
    console.log(queryString)
    if(urlParams.get('user_string')){
        console.log(urlParams.get('user_string'))
        localStorage.setItem('user_string',urlParams.get('user_string'))
        localStorage.setItem('avatar_url',urlParams.get('avatar_url'))
        localStorage.setItem('username',urlParams.get('username'))
        socket.emit("get_user_problems", urlParams.get('user_string'));
    }
    else{
        socket.emit("get_user_problems", "guest");
    }
}


socket.on("get_user_problems", (user_graph)=>{
    graph = user_graph;
    jsonGraph = graphToJson(graph);
    config.dataSource = jsonGraph;
    alchemy.begin(config);
})

