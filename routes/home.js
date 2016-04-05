var ejs = require('ejs');
var mysql = require('./mysql');
var async = require('async');
var crypto=require('crypto');


function login(req, res)
{
    res.render('login');
}
function justtodisplayprofile(req,res)
{
    console.log("hey");
    res.send({username:req.session.user_name});
}

function justtoinfo(req,res)
{
    console.log("hey");
    res.send("hey");
}
function logout(req,res)
{console.log("hello");
    ejs.renderFile('./views/login.ejs',function(err, result) {
        if (!err) {
            res.end(result);
            req.session.destroy(user_name);
        }
        else{
            res.end('An error occurred');
            console.log(err);
        }
    });
}
function profileforperson(req,res)
{
    ejs.renderFile('./views/profileforperson.ejs',{user:req.session.user_name,name:req.session.fullname},function(err, result) {
        if (!err) {
            res.end(result);

        }
        else{
            res.end('An error occurred');
            console.log(err);
        }
    });
}


function displayProfile(req,res)
{

    ejs.renderFile('./views/profile.ejs',function(err, result) {
        if (!err) {
            res.end(result);
        }
        else{
            res.end('An error occurred');
            console.log(err);
        }
    });
}

function afterSignIn(req, res) {
    var decipher = crypto.createDecipher('aes-256-ctr', 'd6F3Efeqwerty')
    var decrypt = decipher.update(req.param("password"),'utf8','hex')
    decrypt += decipher.final('hex');
    var getUser = "select * from users where user_name='" + req.param("user_name") + "' and password='" + decrypt + "'";
    req.session.user_name = req.param("user_name");

console.log("chalyu");
    var json_responses;
    var user_name=req.param("user_name");
    var password=req.param("password");
var jsonresponses1;
    mysql.fetchData(function (err, results) {
        if(user_name!== ''  && password!== '') {
            console.log("innnn");
            console.log(results.length);
            if (results.length > 0)
            {
req.session.fullname=results[0].full_name;
                console.log("valid Login");
                json_responses = {"statusCode": 200};
                json_responses1=req.session.user_name;
console.log("$$$"+json_responses1+"");
                res.send({"statusCode":200,uname:json_responses1});

                var getuserid = "select user_id from users where user_name='" + user_name + "'";
                mysql.fetchData(function (err, results) {
                        if (err) {
                            throw err;
                        }
                        else {
                            if (results.length > 0) {
                                console.log("got user_id");
                                req.session.userid = results[0].user_id;
                                global.userid = results[0].user_id;

                                console.log("user session is"+req.session.userid);
                            }
                            else {
                                console.log("User_id search failed");


                            }

                        }

                    }

                    , getuserid);}

            else
                {
                    json_responses = {"statusCode": 401};
                    res.send(json_responses);
                }

            }

         }, getUser);

}
function save(req,res) {

var name=req.param("fullname");
    var bdate = req.param("date");
    var loc = req.param("location");
    var num = req.param("number");
    var details= "update users set birthday='"+req.param("date")+"',locationn='"+req.param("location")+"',contact='"+req.param("number")+"',full_name='"+req.param("fullname")+"' where user_id='"+global.userid+"'";
    mysql.fetchData(function (err, results) {


        if (results.affectedRows > 0) {
            console.log("updated details");

            res.render('profileforperson');
        }
        else {
            json_responses = {"statusCode": 401};
            res.send(json_responses);
        }



    }, details);




}


function signup(req, res){
    ejs.renderFile('./views/signup.ejs',function(err, result) {
        if (!err) {
            res.end(result);
        }
        else{
            res.end('An error occurred');
            console.log(err);
        }
    });
}

function add_details(req,res) {




    var full_name = req.param("full_name");
    var password = req.param("password");
    var email = req.param("email");
    var json_responses;
    var allemail = "select email from users where email='" + req.param("email") + "'";
    encryption : var cipher = crypto.createCipher('aes-256-ctr', 'd6F3Efeqwerty')
    var encrypted = cipher.update(req.param("password"),'utf8','hex')
    encrypted += cipher.final('hex');
   mysql.fetchData(function (err, results) {


        console.log(results);
        if (results.length > 0) {
            console.log("email exists");
            json_responses = {"statusCode": 401};
            res.send(json_responses);
            res.end;

        }
        else {
            var insert_basic = "insert into users(password,email,full_name) values('" + encrypted + "','" + req.param("email") + "','" + req.param("full_name") + "')";
            req.session.email = req.param("email");
            console.log("Query is:" + insert_basic);
            mysql.fetchData(function (err, results) {


                if (results.affectedRows > 0) {
                    console.log("valid Login");
                    json_responses = {"statusCode": 200};
                    req.session.full_name=full_name;
                    res.send(json_responses);
                }
                else {
                    json_responses = {"statusCode": 401};
                    res.send(json_responses);
                }



            }, insert_basic);


        }

    }, allemail);

}


function insert_tweet(req,res) {
    console.log("tweet");
    async.waterfall([

        function inserttweetdetails(callback) {
            var insert_tweet = "insert into tweet_details(user_name,raw_text,user_id) values('" + req.session.user_name + "','" + req.param("tweet_box") + "','" + global.userid + "')";
            var raw_text = req.param("tweet_box");


            console.log("Query is:" + insert_tweet);

            /*------------INSERT TWEET---------*/
            mysql.fetchData(function (err, results) {
                    if (err) {
                        throw err;
                    }
                    else {
                        if (results.affectedRows > 0) {
                            console.log("data entered");

                        }
                        else {
                            console.log("Tweet insertion Failed");

                            if (!err) {
                                res.end(result);
                            }
                            else {
                                res.end("error occured");
                                console.log(err);
                            }
                        }

                    }
                    callback(null, raw_text);
                }

                , insert_tweet);
        },

        function selecttweetid(raw_text,callback) {

            /*------------SEARCH TWEET_ID---------*/
            var tweett_id = "select tweet_id from tweet_details where raw_text='" + raw_text + "'";
            var raw=raw_text;
            console.log("raw text is"+raw);
            mysql.fetchData(function (err, results) {
                if (err) {
                    throw err;
                }
                else {
                    console.log("hahahaha");

                    console.log(results);
                    if (results.length > 0) {
                        console.log("innn");
                        //req.session.tweet_id = results[0].tweet_id;
                        console.log("********************************************************************");
                        console.log("Tweet_id of tweet " + results[0].tweet_id);
                        console.log("********************************************************************");
                        var tweet_id = results[0].tweet_id;
                    }
                    else {
                        console.log("Invalid Login");

                    }
                }
                callback(null, tweet_id,raw);
            }, tweett_id);
        },

        function inserthashid(tweet_id,raw,callback)
        {
    /*------------SEARCH TWEET_ID---------*/
    var tweet = (req.param("tweet_box"));
    var hash = raw.match(/#\w+/g);
var tid=tweet_id;
    console.log(hash);
            var hashids=[];
    var hashcontent = [];

    if (hash) {
        for (var i = 0; i < hash.length; i++) {
            hashcontent = hash[i].substr(1);
            console.log(hashcontent);
            var hashcontents = "insert into hashtags(hashtag) values('" + hashcontent + "')";


            mysql.fetchData(function (err, results) {
                if (err) {
                    throw err;
                }
                else {

                    if (results.affectedRows > 0) {
                        console.log("hash entered");
                        var hash_ids = "select hash_id from hashtags where hashtag='" + hashcontent + "'";
                        mysql.fetchData(function (err, results) {
                            if (err) {
                                throw err;
                            }
                            else {
                                console.log("hehehe");

                                if (results.length > 0) {
                                    console.log("innnerrr");
                                    //req.session.tweet_id = results[0].tweet_id;
                                    console.log("********************************************************************");
                                    console.log("Hash_id of hashtag " + results[0].hash_id);
                                    hashids = results[0].hash_id;
                                    var inserthashmessage = "insert into hash_message(tweet_id,hash_id) values('" + tid + "','" + hashids + "')";
                                    mysql.fetchData(function (err, results) {
                                        if (err) {
                                            throw err;
                                        }
                                        else {

                                            if (results.affectedRows > 0) {
                                                console.log("hashmessage entered");
                                                res.render('profile',{fullname:req.session.fullname,user:req.session.user_name});

                                            }
                                            else {
                                                console.log("Hashmessageenter Failed");

                                            }
                                        }
                                        callback(null);

                                    }, inserthashmessage);
                                    console.log("********************************************************************");
                                }
                                else {
                                    console.log("Hash id fetch failed");

                                }
                            }

                        }, hash_ids);

                    }
                    else {
                        console.log("Hashenter Failed");

                    }
                }

            }, hashcontents);







        }}},


    ]);
}
function add_username(req,res)
{
    var email_catch=req.session.email;
    var allusername="select user_name from users where user_name='"+req.param("user_name")+"'";

    var json_responses;
    var user_name='"+req.param("user_name")+"';

    mysql.fetchData(function (err, results)
    {
        if (results.length > 0)
        {
            console.log("valid Login");
            json_responses = {"statusCode": 401};
            res.send(json_responses);
        }
        else
        {
            var insert_username="update users set user_name='"+req.param("user_name")+"' where email='"+req.session.email+"'";
            req.session.email = req.param("email");
            console.log("Query is:" + insert_username);
            mysql.fetchData(function (err, results)
            {
                if (results.affectedRows > 0)
                {
                    req.session.user_name=req.param("user_name");
                    console.log("Username entered");
                    json_responses = {"statusCode": 200};
                    res.send(json_responses);
                }
                else
                {
                    json_responses = {"statusCode": 401};
                    res.send(json_responses);
                }
            }, insert_username);
        }
    }, allusername);
}

function signup(req, res)
{
    ejs.renderFile('./views/signup.ejs',function(err, result)
    {
        if (!err)
        {
            res.end(result);
        }
        else
        {
            res.end('An error occurred');
            console.log(err);
        }
    });

}

function setup_profile(req,res)
{
    var insert_profile="update users set ='"+req.param("user_name")+"' where email='"+req.session.email+"'";

    mysql.fetchData(function(err,results) {
        if(err){
            throw err;
        }
        else {
            if(results>0){
                console.log("data entered");
                ejs.renderFile('./views/loggedin.ejs', { data: results } , function(err, result) {
                    if (!err) {
                        res.end(result);
                    }
                    else {
                        res.end('An error occurred');
                        console.log(err);
                    }
                });}
            else{
                console.log("Signup Failed");
                ejs.renderFile('./views/add_username.ejs',function(err, result){
                    if(!err){
                        res.end(result);
                    }
                    else{
                        res.end("error occured");
                        console.log(err);
                    }
                });
            }
        }

    }, insert_profile);
}


function getAllUsers(req, res){
    var getAllUsers = "select * from users";
    console.log(getAllUsers);

    mysql.fetchData(function(err, results){
        if(err){
            throw err;
        }
        else{
            if(results.length > 0){
                var rows = results;
                var jsonString = JSON.stringify(results);
                var jsonParse = JSON.parse(jsonString);
                console.log("Results Type: "+(typeof results));
                console.log("Result Element Type:"+(typeofrows[0].emailid));
                console.log("Results Stringify Type:"+(typeofjsonString));
                console.log("Results Parse Type:"+(typeofjsString));
                console.log("Results: "+(results));
                console.log("Result Element:"+(rows[0].emailid));
                console.log("Results Stringify:"+(jsonString));
                console.log("Results Parse:"+(jsonParse));

                ejs.renderFile('./views/successLogin.ejs',{data:jsonParse},function(err, result){
                    if(!err){
                        res.end(result);
                    }
                    else{
                        res.end("Error occured");
                        console.log(err);
                    }
                });
            }
            else{
                console.log("No users found in database");
                ejs.renderFile('./views/failLogin.ejs',function(err, result){
                    if(!err){
                        res.end(result);
                    }
                    else{
                        res.end("Error occured");
                        console.log(err);
                    }
                });
            }
        }
    }, getAllUsers);
}
function redirectToHomepage(req,res)
{
    //Checks before redirecting whether the session is valid
    if(req.session.user_name)
    {
        //Set these headers to notify the browser not to maintain any cache for the page being loaded
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render("profile",{user:req.session.user_name,fullname:req.session.fullname});
    }
    else
    {
        res.redirect('/');
    }
};

function adding_username(req, res){
    ejs.renderFile('./views/add_username.ejs',function(err, result) {
        if (!err) {
            res.end(result);
        }
        else{
            res.end('An error occurred');
            console.log(err);
        }
    });
}
function settingup_profile(req, res){
    ejs.renderFile('./views/setup_profile.ejs',function(err, result) {
        if (!err) {
            res.end(result);
        }
        else{
            res.end('An error occurred');
            console.log(err);
        }
    });
}
function gotohome(req, res){

    //Set these headers to notify the browser not to maintain any cache for the page being loaded

    res.render("profile",{user:req.session.user_name,fullname:req.session.full_name});

}


function insertFollowers(req, res) {


            var followers = "insert into follows(user_id,follower_id) values('" + global.userid + "','" + req.param("userids") + "')";
            var json_responses = {};
            mysql.fetchData(function (err, results) {

                if (results.affectedRows > 0) {
                    console.log("values entered");
                    json_responses = {"statusCode": 200};
                    res.send(json_responses);

                }
                else {
                    json_responses = {"statusCode": 401};
                    res.send(json_responses);
                }


            }, followers);

        }


function getFeed(req,res)
{


                                var gettweet = "SELECT tweet_details.raw_text,tweet_details.tweet_id,tweet_details.user_id, tweet_details.user_name, tweet_details.timestamp, users.full_name FROM tweet_details INNER JOIN users ON tweet_details.user_id = users.user_id WHERE tweet_details.user_id IN (SELECT follower_id FROM follows WHERE user_id='" + global.userid + "') OR tweet_details.user_id='" + global.userid + "' ORDER BY tweet_details.timestamp DESC  LIMIT 30";


                                mysql.fetchData(function (err, results) {

                                        if (req.session.user_name) {
                                            console.log("dispying tweet");

                                            var jsonString1 = JSON.stringify(results);
                                            var tweetsoffollowers = JSON.parse(jsonString1);



                                                    var getsuggestedusers = "select * from users where user_id not in (select follower_id from follows where user_id='" + global.userid + "') and user_id!='" + global.userid + "' limit 3";
                                                    mysql.fetchData(function (err, results) {

                                                        if (req.session.user_name) {
                                                            console.log("displaying suggested users");
                                                            var jsonString2 = JSON.stringify(results);
                                                            var suggestedusers = JSON.parse(jsonString2);

                                                            var iamfollowing = "SELECT COUNT(*) AS num1 FROM follows WHERE user_id ='" + global.userid + "'";
                                                            mysql.fetchData(function (err, results) {
                                                                if (err) {
                                                                    throw err;
                                                                } else {

//
                                                                    var countiamfollowing = results[0].num1;
                                                                    console.log("following" + countiamfollowing);

                                                                    var followingme = "select count(*) as num from follows where follower_id='" + global.userid + "'";
                                                                    mysql.fetchData(function (err, results) {
                                                                        if (err) {
                                                                            throw err;
                                                                        } else {
                                                                            var countfollowingme = results[0].num;

                                                                            var counttweet = "select count(*) as cnt from tweet_details where user_id='" + global.userid + "'";
                                                                            mysql.fetchData(function (err, results) {
                                                                                if (err) {
                                                                                    throw err;
                                                                                }
                                                                                else {
                                                                                    var counttweet = results[0].cnt;
                                                                                    var tweetsmine= "SELECT tweet_details.raw_text, tweet_details.user_name, tweet_details.timestamp, users.full_name,users.contact,users.birthday,users.locationn FROM tweet_details INNER JOIN users ON tweet_details.user_id = users.user_id where tweet_details.user_id='" + global.userid + "' ORDER BY tweet_details.timestamp DESC";
                                                                                    var json_responses = {};
                                                                                    mysql.fetchData(function (err, results) {

                                                                                        if (req.session.user_name) {
                                                                                            console.log("values entered"+results);
                                                                                            var jsonString = JSON.stringify(results);
                                                                                            var mytweets = JSON.parse(jsonString);

var iamfollowingg="select follows.follower_id, users.user_name, users.full_name, users.user_id FROM follows INNER JOIN users ON follows.follower_id = users.user_id WHERE follows.user_id = '"+global.userid+"'" ;
                                                                                            mysql.fetchData(function (err, results) {

                                                                                                if(req.session.user_name) {
                                                                                                    console.log("got iamfollowing list");
                                                                                                    var jsonString5 = JSON.stringify(results);
                                                                                                    var iamfollowing = JSON.parse(jsonString5);
                                                                                                    var followers = "SELECT follows.user_id, users.user_name, users.full_name, users.user_id  FROM follows INNER JOIN users ON follows.user_id = users.user_id WHERE follows.follower_id= '"+global.userid+"'";
                                                                                                    mysql.fetchData(function (err, results) {
                                                                                                    if (req.session.user_name) {
                                                                                                        console.log("got following list");
                                                                                                        var jsonstring6 = JSON.stringify(results);
                                                                                                        var followerss = JSON.parse(jsonstring6);

                                                                                                    return res.send({
                                                                                                        followerstweets: tweetsoffollowers,
                                                                                                        userssuggested: suggestedusers,
                                                                                                        cntiamfollowing: countiamfollowing,
                                                                                                        cntfollowingme: countfollowingme,
                                                                                                        tweetcount: counttweet,
                                                                                                        mitweets: mytweets,
                                                                                                        iamfollowingg:iamfollowing,
                                                                                                        followerss:followerss
                                                                                                    });

                                                                                                }},followers);
                                                                                                }},iamfollowingg);
                                                                                        }},tweetsmine);
                                                                                }

                                                                            }, counttweet);

                                                                        }
                                                                    }, followingme);


                                                                }
                                                            }, iamfollowing);

                                                        }
                                                    }, getsuggestedusers);



                                        }
                                        else {
                                            console.log("follower id search failed");


                                        }


                                    }

                                , gettweet);

                            }

function search(req,res) {
    var tweet = req.param("searchtag");
    var hash = tweet.match(/#\w+/g);

    console.log(hash);

    var hashcontent = [];


    for (var i = 0; i < hash.length; i++) {
        hashcontent = hash[i].substr(1);
    }
        var search = "select hash_message.tweet_id,tweet_details.raw_text from hash_message INNER JOIN tweet_details on hash_message.tweet_id=tweet_details.tweet_id  where hash_message.hash_id in (select hash_id from hashtags where hashtag like '" + hashcontent + "') ";

        mysql.fetchData(function (err, results) {
                if (results.length > 0) {
                    console.log("Search success");
                    var jsonString2 = JSON.stringify(results);
                    console.log(results[0].raw_text);
                    var json_responses = JSON.parse(jsonString2);
                    res.send( json_responses);
                }
                else {
                    console.log("Searchtag failed");
                }
            }
            , search);

}

function retweet(req,res) {


    var retweet= "update tweet_details set retweet='"+global.userid+"' where user_id='"+req.param("useridss")+"' and tweet_id='"+req.param("tweettid")+"'";
    mysql.fetchData(function (err, results) {


        if (results.affectedRows > 0) {
            console.log("updated retweet details");

            res.render('/profile' ,{fullname:req.session.fullname,user:req.session.user_name});
        }
        else {
            json_responses = {"statusCode": 401};
            res.send(json_responses);
        }



    }, retweet);




}

exports.logout=logout;
exports.login=login;
exports.afterSignIn=afterSignIn;
exports.getAllUsers=getAllUsers;
exports.signup=signup;
exports.add_details=add_details;
exports.add_username=add_username;
exports.setup_profile=setup_profile;
exports.insert_tweet=insert_tweet;
exports.displayProfile=displayProfile;
exports.redirectToHomepage =redirectToHomepage;
exports.adding_username=adding_username;
exports.settingup_profile=settingup_profile;
exports.gotohome=gotohome;
/*exports.suggestedusers=suggestedusers;*/
exports.insertFollowers=insertFollowers;
exports.profileforperson=profileforperson;
exports.getFeed=getFeed;
exports.justtodisplayprofile=justtodisplayprofile;
exports.profileforperson=profileforperson;
exports.justtoinfo=justtoinfo;
exports.save=save;
exports.search=search;
exports.retweet=retweet;