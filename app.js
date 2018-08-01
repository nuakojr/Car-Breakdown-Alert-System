const express =require('express');
const Firebase = require('firebase');
const bodyParser = require('body-parser');
const morgan= require('morgan');

const app = express();

const port = 3000;

Firebase.initializeApp({
    databaseURL: "https://car-breakdown-alert-system.firebaseio.com/",
    serviceAccount: './serviceAccountKey.json',

})
var db= Firebase.database();
var usersRef= db.ref("users");

app.use(express.static(__dirname + '/public'));
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type:'application/vnd.api+json'}));



app.get('/',function(req, res){
    res.sendfile('./index.html')

})

app.post('/api/createUser', function(req, res){
    var data = req.body;
    usersRef.push(data, function(err){
        if (err){
            res.send(err)
        } else {
            res.json({message: "Success, User Saved.", result: true})
        }
    })
})

usersRef.once('value', function (snap) {
    snap.forEach(function (childSnap) {
     console.log('user', childSnap.val());
    });
   });

app.listen(3000, () => {
    console.log("The server is live on " + port);
})




var distance = require('./index.js');

var origins = ['KNUST', '6.673233,-1.5654951'];
var destinations = ['Tafo', '6.660409,-1.5839236'];

function onMatrix(err, distances) {
    if (err) {
        return console.log(err);
    }
    if (distances.error_message) {
        return console.log(distances.error_message);
    }
    if(!distances) {
        return console.log('no distances');
    }
    if (distances.status == 'OK') {
        for (var i=1; i < origins.length; i++) {
            for (var j = 0; j < destinations.length; j++) {
                var origin = distances.origin_addresses[i];
                var destination = distances.destination_addresses[j];
                if (distances.rows[0].elements[j].status == 'OK') {
                    var distance = distances.rows[i].elements[j].distance.text;
                    console.log('Distance from ' + origin + ' to ' + destination + ' is ' + distance);
                } else {
                    console.log();
                }
            }

        }

    }
}
distance.units('imperial');
distance.mode('driving');
distance.matrix(origins, destinations, onMatrix);