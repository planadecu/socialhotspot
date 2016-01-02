var likeClicked = false;
var fbUser = null;
window.fbAsyncInit = function(){
    FB.init({
      appId      : '112801695477643', // App ID
      channelUrl : '//www.rourevell.com/channel.html', // Channel File
      status     : true, // check login status
      cookie     : true, // enable cookies to allow the server to access the session
      xfbml      : true,  // parse XFBML
      version    : 'v2.2'
    });
    console.log("FB loaded");
    subscribeLikeButton();
};

var subscribeLikeButton = function(){
    FB.Event.subscribe('edge.create', function(url, html_element) {
        likeClicked = true;
        if(url=="https://facebook.com/rourevell"){
            likeClicked = true;
            stepX(fbUser);
        }
    });
    console.log("Subscribed to like event");
};

var facebookLogin = function(){
    FB.login(function(response) {
        if (response.authResponse) {
            rezponse = response;
            console.log('Welcome!  Fetching your information.... ');
            FB.api('/me', function(response) {
                console.log('Good to see you, ' + response.name + '.');
                facebookLogged(rezponse);
            });
            
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }, {scope: 'email,user_likes'});
};

var facebookLogged = function(response){
    fbUser = response.authResponse.userID;
    $("#fb-login").hide();
    FB.api('/me/likes/184153061606521', function(response) {
        if(response.data.length>0){
            console.log("User already liked");
            stepX(fbUser);
        }
    });    
    console.log("Redraw like button");
    $("#fb-like").html('<fb:like-box href="https://www.facebook.com/rourevell" colorscheme="light" show_faces="false" header="false" stream="false" show_border="false"></fb:like-box>').show();
    try{
        FB.XFBML.parse(); 
        //subscribeLikeButton();
    }catch(ex){console.log(ex);}
}

var validateMail = function (email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 

var checkFacebookLike = function(){
    if(likeClicked){
        stepX("");
    }else{
        step2();
    }
};

var checkEmail = function(){
    var email = $("#email").val();
    if(validateMail(email)){
        stepX(email);
    }else{
        alert("L'adreça email no és vàlida");
    }
};

var step0 = function(){
    $(".step").hide();
    $("#step0").show();
};

var step1 = function(){
    $(".step").hide();
    $("#step1").show();
    
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        facebookLogged(response);
      } 
    });
};

var step2 = function(){
    $(".step").hide();
    $("#step2").show();
};

var stepX = function(user){
    $(".step").hide();
    $("#stepX").show();
    $.post("http://10.10.10.1:5280/",{
        "mode_login":"",
        "accept_terms":"yes",
        "redirect":"www.rourevell.com"
    },null,"text");
    
    if(user != "") $.post("http://wifi.rourevell.com/user.php",{
        "user":user
    },null,"text");
};

$("#step0-next").click(step1);
$("#step1-back").click(step0);
$("#step1-next").click(checkFacebookLike);
$("#fb-login").click(facebookLogin);
$("#step2-back").click(step1);
$("#step2-next").click(checkEmail);
