var  express = require("express");
var app = express();
var path = require('path');
app.use(express.static(__dirname+'/public'));

var bodyParser = require('body-parser');
var _ = require('underscore');
var exec = require("child_process").exec;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));


var port = process.env.PORT || 8088;
var fs = require("fs");

//------------------------------------
//var cs3013=[
//    {seller: 'John Snow', ecopy:"Yes", email:"ylu6@wpi.edu"},
//    {seller: 'the Imp', ecopy:"No", email:"ylu6@wpi.edu"},
//];

var cs4445=[
    {seller: 'John Snow', ecopy:"Yes", email:"xxu3@wpi.edu"},
    {seller: 'the Imp', ecopy:"No", email:"xxu3@wpi.edu"},
];

//var courses=[cs3013,cs4445];

var courseName = fs.readFileSync(__dirname+'/public/allCourses').toString().trim().split("\n");
//------------------------------------

app.get('/',function(req,res){
    sendFile(res,'index.html');
});
app.get('/index',function(req,res){
    sendFile(res,'index.html');
});
app.get('/newSeller',function(req,res){
    res.sendFile(path.join(__dirname, 'newSeller.html'));

});
app.post('/search',function(req,res){

    var query=req.body.courseNum;

    var target = findCourse(query);
    if(target>=0){
     //   res.send(JSON.stringify(courses[target]));
        sendJSON(req, res, query+'.json');
    }
    else{
        res.send('not found');
    }
    res.end();
});

app.post('/add',function(req,res){
   // console.log('add seller info');
    var cname=req.body.courseName;
    var sname=req.body.sellerName;
    var ecopy=req.body.ecopy;
    var email=req.body.email;
    var target= findCourse(cname);
    if(target>=0){
        var newInfo={seller: sname, ecopy:ecopy, email:email};
        courses[target].push(newInfo);
        res.sendFile(path.join(__dirname, '/public/confirm.html'));
    }
    else{
        res.send('Course not found, please enter again');
    }


});
app.post('/upload.php', function(req, res){
    exec("php upload.php", function (error, stdout, stderr) {res.send(stdout);});
});
app.listen(port, function() {
    console.log('App is listening on port ' + port);
});
//-------------------------------------
var book = _.template(
    "<div class='book'>" +
    "<h2><%= seller %></h2>" +
    "<p>electronic copy? <%= ecopy %></p>" +
    "<p><%= email %></p>" +
    "</div>"
);

function sendFile(res, filename) {
    res.writeHead(200, {'Content-type': 'text/html'});

    var stream = fs.createReadStream(filename);

    stream.on('data', function(data) {
        res.write(data);
    });

    stream.on('end', function(data) {
        res.end();
        return;
    });
}
function sendJSON(req, res, filename) {
    var course = fs.readFileSync(filename);
    console.log(course);
    var courseinfo;
    if(!_.isEmpty(course)){
        courseinfo = JSON.parse(course);
    }
    console.log(courseinfo);
    var str = "";
    courseinfo.forEach(function(p){
        if(p!==null){
            str += book(p);
        }
    });
    res.send(str);
    res.end();

}
function findCourse(key){

    var index = courseName.indexOf(key);

    if(index>=0){
        return index;
    }else{
        return -1;
    }
}