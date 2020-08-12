const express = require('express'),
http = require('http'),
app = express(),
server = http.createServer(app),
io = require('socket.io').listen(server);

var playeruuid="";
var playerMessageSave="";
var turn = 0;
var player_turn = {game:{'turn':0}};
player_turn[game] = {'turn':0};
// var player_turn= {};
var pl1_round_score = 0;
var pl2_round_score = 0;
var pl3_round_score = 0;
var pl4_round_score = 0;
var seq_num = 0;
var round_num = 0;
var sequence_cards = 0;
var cards_on_table = {};
var tbl_cards = {};
var seqScore = {};
var roundScore = {};
var game = 0;
// var test = 0;
var watchers_list = [];
var watchers = [];

var mysql = require('mysql');
var con = mysql.createConnection({
   host: "khawajat.techozean.com", // ip address of server running mysql
   user: "khawajattechozea", // user name to your mysql database
   password: "5BR9Sbj3p6ts0b02:7q", // corresponding password
   database: "khawajat_db" // use the specified database
  
  // host: "localhost", // ip address of server running mysql
  // user: "root", // user name to your mysql database
  // password: "", // corresponding password
  // database: "khawajat_db" // use the specified database

});


con.connect(function(err) {
  if (err) throw err; console.log(err)
  // if Socket is created successful
  console.log("successful");
    // if any error while executing above query, throw error
  });





app.get('/', function(req, res){

res.send('Chat Server is running on port 5000')
});

app.get('/myname', function(req, res){

res.send('Mahwish')
});

var clients =[];

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function score_update(){
  player1_score = 50;
  player2_score = 0;
  player3_score = -50;
  player4_score = -100;
  pl1_round_score = pl1_round_score + player1_score;
  pl2_round_score = pl2_round_score + player2_score;
  pl3_round_score = pl3_round_score + player3_score;
  pl4_round_score = pl4_round_score + player4_score;
  //return player1_score, player2_score, player3_score, player4_score
}

function trix(data){
  var gameID = data.game_id;
  if (player_turn[gameID].turn == 4) {
    player_turn[gameID] = {'turn':0};
    score_update();
    seq_num++;
    cards_on_table[gameID] = {'pl_id1':0,'pl_card1':0,
                      'pl_id2':0,'pl_card2':0,
                      'pl_id3':0,'pl_card3':0,
                    };

    seqScore[gameID] = {'player1_score':player1_score,
                    'player2_score':player2_score,
                    'player3_score':player3_score,
                    'player4_score':player4_score
      };
    io.in(gameID).emit("seq_score", seqScore[gameID]);

    if (seq_num == 13) {
      round_num++;
      seq_num = 0;

      roundScore[gameID] = {'pl1_round_score':pl1_round_score,
                        'pl2_round_score':pl2_round_score,
                        'pl3_round_score':pl3_round_score,
                        'pl4_round_score':pl4_round_score
        };
      io.in(gameID).emit("round_score", roundScore[gameID]);
    }
  }
  else {
    // console.log("................................");
    if (player_turn[gameID].turn == 1){
      console.log("IF LOOP 1");
      cards_on_table[gameID] = {'pl_id1':data.player_id,'pl_card1':data.player_card,
                                'pl_id2':0,'pl_card2':0,
                                'pl_id3':0,'pl_card3':0
                };
                // console.log("cards :", cards_on_table[gameID]);
    }

    else if (player_turn[gameID].turn == 2){
      console.log("IF LOOP 2");
      cards_on_table[gameID] = {'pl_id1':cards_on_table[gameID].pl_id1,'pl_card1':cards_on_table[gameID].pl_card1,
                                  'pl_id2':data.player_id,'pl_card2':data.player_card,
                                  'pl_id3':0,'pl_card3':0
                };
                // console.log("cards :", cards_on_table[gameID]);
    }

    else if (player_turn[gameID].turn == 3){
      cards_on_table[gameID] = {'pl_id1':cards_on_table[gameID].pl_id1,'pl_card1':cards_on_table[gameID].pl_card1,
                                  'pl_id2':cards_on_table[gameID].pl_id2,'pl_card2':cards_on_table[gameID].pl_card2,
                                  'pl_id3':data.player_id,'pl_card3':data.player_card,
                };
                // console.log("cards :", cards_on_table[gameID]);
    }
    // console.log("");
    // console.log("");
    // console.log("");
    }
}


io.on('connection', function(socket){

console.log('user connected')


// 1st
socket.on('save_details', function(data){
 var client_info = new Object();
        
 // room id
          game = data.game_id;


          client_info.game_id= data.game_id;
          client_info.player_id=data.player_id;
          client_info.player_name=data.player_name;

          //bool is watcher or player
          client_info.watcher=data.watcher;
          client_info.client_id=socket.id;
          clients.push(client_info);
          console.log("All Connected Clients: ", clients);
          socket.join(data.game_id);

        if("watcher" in data && data.watcher==1){
            
        
          if (watchers[game] == null){
            watchers_list = [];
            watchers_list.push(client_info);
            watchers[game] = watchers_list;
          }
          else {
            watchers_list = watchers[game];
            watchers_list.push(client_info);
            watchers[game] = watchers_list;
          }

        }
          // watchers_list.push(client_info);
          // watchers[game] = watchers_list;
          // console.log("watcher list on connect: ", watchers[game]);
          if(watchers[game]){
          io.in(data.game_id).emit("watchers_list", watchers[game]);
          }


          if (cards_on_table[game] != null){
            socket.emit("cards_on_table", cards_on_table[game]);
          }
          // io.in(data.game_id).emit("watchers",shuffled_cards_res);
          if (seqScore[game] != null){
            io.in(data.game_id).emit("seq_score", seqScore[game]);
          }
          if (roundScore[game] != null){
            io.in(data.game_id).emit("round_score", roundScore[game]);
          }
          if (player_turn[game] == null){
            player_turn[game] = {'turn':0};
            // console.log("player_turn: ", player_turn[game].turn);
          }
          else {
            // console.log("Game already existed");
            player_turn[game] = {'turn':player_turn[game].turn};
          }
        });


// each card play
socket.on('game_play_update', (data) => {

  var sql = 'INSERT INTO tbl_game_play_two (game_id,player_id,game_play_sequence,round_seq,player_card) VALUES  ? ';
    var putThis = [
        [data.game_id,data.player_id,data.game_play_sequence,data.round_seq,data.player_card]
      ];
    con.query(sql,[putThis], function (err, result) {
    if (err) throw err;
    console.log("Inserted");
    game = data.game_id;
    socket.to(data.game_id).emit("card_received", data);

    player_turn[game] = {'turn':(player_turn[game].turn + 1)};

    trix(data);

    });


      //io.emit('message', message )
      })

      // every round
socket.on('shuffle',(data)=>{

shuffled_cards = shuffle(data.cards.splice(1,52));



var player_1 = shuffled_cards.slice(0,13)
var player_2 = shuffled_cards.slice(13,26)
var player_3 = shuffled_cards.slice(26,39)
var player_4 = shuffled_cards.slice(39,52)

//var shuffled_cards_res = new Array()

shuffled_cards_res = {'game_id':data.game_id,
                     'round_id':data.round_id,
                     'player_1':player_1,
                     'player_2':player_2,
                     'player_3':player_3,
                     'player_4':player_4};

  var sql = 'INSERT INTO tbl_shuffled_cards (game_id,round_id,player1_cards,player2_cards,player3_cards,player4_cards) VALUES  ? ';
    var  shuffle_card = [
      [data.game_id,data.round_id,JSON.stringify(player_1),JSON.stringify(player_2),JSON.stringify(player_3),JSON.stringify(player_4)]
      ];

      con.query(sql,[shuffle_card], function (err, result) {
      if (err) throw err;
      console.log("Inserted to tbl_shuffled_cards...");
      });

 console.log('response cards:'+shuffled_cards_res.player_1);
 console.log('response cards:'+shuffled_cards_res.player_2);
 console.log('response cards:'+shuffled_cards_res.player_3);
 console.log('response cards:'+shuffled_cards_res.player_4);

io.in(data.game_id).emit("shuffled",shuffled_cards_res);
//socket.emit("shuffled",shuffled_cards_res);

});

  //io.emit('message', message )

socket.on('disconnect', function() {

       for( var i=0, len=clients.length; i<len; ++i ){
                var c = clients[i];
                game = c.game_id;
                watchers_list = watchers[game];

                if(c.client_id == socket.id){

                    if(watchers_list){
                    watchers_list.splice(i,1);
                    watchers[game] = watchers_list;
                    }
                    
                    clients.splice(i,1);
                    socket.leave(c.game_id);
                    // console.log("watcher list on disconnect: ", watchers[game]);
                    io.in(game).emit("watchers_list", watchers[game]);
                    break;
                }
            }
        console.log(clients);
        // seqScore[c.game_id].remove();
    })

})


server.listen(5000,()=>{

console.log('Node app is running on port 5000')

})
