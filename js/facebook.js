// facebook app id
var appid = '13739373964';
// not sure if this is requried
var channelurl = '//tp.shortytime.com/channel.html';


/**
 * Loads up facebook-based version of the game
 */
function loadFacebook()
{
	// check current user login status
	FB.getLoginStatus(function(response) {

		if (response.status === 'connected')
		{
			// facebook is already connected
			loadFriends();
		}
		else
		{
			// facebook is not connected, need to log in
			FB.login(function(response) {
				if (response.authResponse)
				{
					loadFriends();
				}
				else
				{
					// cancelled login
					console.log('Login Failed');
				}
			});
		}
	});
}

/**
 * Loads the friends, and goes on to start the game
 */
function loadFriends()
{
	// remove the game button
	$('.start-game').val("Loading...").attr("disabled", "disabled");

	FB.api('/me', function(response) {
		// console.log(response);
		$('#greeting').html("Good Luck " + response.first_name).show();
	});

	// get array of friends
	FB.api('/me/friends', function(response) {

		// array to store your friends
		var friends = [];

		for (i = 0; i < response.data.length; i++)
		{
			var friend = {};
			friend.name = response.data[i].name;
			friend.image = 'https://graph.facebook.com/' + response.data[i].id
					+ '/picture';
			friends.push(friend);
		}

		// shuffle them up
		friends = _.shuffle(friends);
		// trim it to 50
		friends = friends.slice(0, 50);

		startGame(friends);
	});
}

/**
 * Starts the actual game, with the (facebook) friends specifed
 *
 * @param friends Array of {name: ..., image: ...} objects
 */
function startGame(friends)
{
	var game = null;
	game = new Game("#deck", friends, "#message");
	game.newGame("Rob", "robert.sean.mcneil@gmail.com");
}

// ready - lets go
$(function() {
	FB.init({
		appId : appid, // App ID
		channelUrl : channelurl, // Channel File
		status : true, // check login status
		cookie : true, // enable cookies to allow the server to access the
						// session
		xfbml : true
	// parse XFBML
	});

	$('.start-game').click(function() {
		loadFacebook();
	});
});
