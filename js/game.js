
/**
 * Encapsulates game things. Requires jQuery. REST endpoint interface detailed
 * at http://totalrecall.99cluster.com/
 *
 * @param container The #ID of the container DOM object
 * @param friends Array of friend information
 */
function Game(container, friends, message_container)
{
	this.container = $(container);
	this.message_container = $(message_container)
	this.id = "";
	this.width = -1;
	this.height = -1;
	this.baseurl = "http://totalrecall.99cluster.com/games/";

	this.first_card = null;
	this.busy = false;

	this.friends = friends;
	this.faces = {};
	this.audios = {};
	this.last_cards_matched = false;

	this.pairs_matched = 0;
	this.all_cards = [];
}

/**
 * Start a new game. Called externally.
 */
Game.prototype.newGame = function(name, email)
{
	$.ajax({
		url : this.baseurl,
		type : "POST",
		crossDomain : true,
		dataType : "json",
		context : this,
		data : {"name": name , "email" : email},
		success : function(data) {
			//this.createDeck(JSON.parse(data));
			this.createDeck(data);
		},
		error : function(data) {
			console.warn("Failed to create game. Response is below");
			console.dir(data);
			if (data == null)
				data = "";
			var message = "Failed to create game. Further information: " +
				data.toString();
			this.showError(message);
		}
	});
};

Game.prototype.resume = function(game_id)
{
	$.ajax({
		url : this.baseurl + game_id,
		type : "GET",
		crossDomain : true,
		dataType : "json",
		context : this,
		success : function(data) {
			//this.createDeck(JSON.parse(data));
			this.createDeck(data);
		},
		error : function(data) {
			console.warn("Failed to resume game. Response is below");
			console.dir(data);
			if (data == null)
				data = "";
			var message = "Failed to resume game. Further information: " +
				data.toString();
			this.showError(message);
		}
	});
}

/**
 * Called when a user clicks a particular card. Called externally.
 *
 * @param x The x coordinate of the card
 * @param y The y coordinate of the card
 */
Game.prototype.click = function(x, y, div)
{
	if (this.busy)
	{
		console.log("Currently busy, ignoring click at " + x + ", " + y);
		return;
	}

	if (this.first_card != null && this.first_card.x == x && this.first_card.y == y)
	{
		console.log("Ignoring repeated card click");
		return;
	}

	this.busy = true;
	this.cleanupCardsFromLastRound();
	$.ajax({
		url : this.baseurl + this.id + "/cards/" + x + "," + y,
		type : "GET",
		dataType : "text",
		crossDomain : true,
		context : this,
		success : function(data) {
			this.onGuess(x, y, data, div);
		},
		error : function(data) {
			console.log("AJAX guess call failed, response below");
			console.dir(data);
			this.showError("Failed to take a guess at card at " + x + "," + y + ": " + data.toString());
		}
	});
};

/**
 * Create the deck using the parameters from the game JSON object
 *
 * @param game JSON game object returned from REST call
 */
Game.prototype.createDeck = function(game)
{
	this.id = game.id;
	this.width = game.width;
	this.height = game.height;
	var count = this.width * this.height;

	if (this.width != 6 || this.height != 5)
	{
		// issue #6
		this.showError("Server has responded with a non 6x5 game, and I cannot cope with that");
		return;
	}

	if (this.friends.length < count / 2)
	{
		this.showError("There are more cards than there are friends defined - I can't put a face on each card");
		return;
	}

	// cut down the number of friends to just the amount that we need - this
	// will ensure that we don't preload more audio than we need
	this.friends.length = count / 2;

	// create cards
	for (var i = 0; i < count; ++i)
	{
		var coord = this.index2coord(i);

		var div = $("<div>");
		div.addClass("card");
		div.addClass("facedown");
		div.data("x", coord.x).data("y", coord.y);
		this.container.append(div);

		this.all_cards[i] = {'x': coord.x, 'y': coord.y, 'matched': false, 'div': div};
	}

	// create audio tags with preloaded content
	for (var i = 0; i < this.friends.length; ++i)
	{
		var audio = $("<audio>");
		var friend = this.friends[i];
		audio.attr("src", "http://tts-api.com/tts.mp3?q=" + friend.name);
		audio.attr("preload", "auto");
		this.container.append(audio);
		this.audios[friend.name] = audio.get(0);
	}

	var game = this;
	$(".card").on("click", function(){
		var x = $(this).data("x");
		var y = $(this).data("y");
		game.click(x, y, this);
	});
};

Game.prototype.showError = function(message)
{
	// TODO: should this be done better?
	alert(message);
};

Game.prototype.cleanupCardsFromLastRound = function()
{
	// TODO
	//  if two cards are face up
	//    if the cards match
	//      hide both cards
	//    else (they don't match)
	//      flip the cards back face-down

	// this is messy - it uses the UI to determine how many cards are face up
	//var face_up_cards = [];

	//$('.faceup').each(function(){
		// not sure if 'this' is jQueryafied already
		//face_up_cards.push($(this));
	//});

	console.log("Clean up?")
	if ($('.faceup').length >= 2)
	{
		console.log("Doing a clean up");
		if (this.last_cards_matched)
		{
			console.log("  Eliminating cards");
			$('.faceup').addClass("eliminated").removeClass("faceup");
		}
		else
		{
			console.log("  Putting them face down again");
			$('.faceup').addClass("facedown").removeClass("faceup").css({"background-image":""});
		}
	}
	else
	{
		console.log("No need for a cleanup");
	}
};

Game.prototype.onGuess = function(x, y, card_value, div)
{
	console.log("Guess at " + x + "," + y + " is " + card_value);
	this.busy = false;
	var friend = this.getFriendForValue(card_value);
	console.log("Card " + card_value + " is associated with " + friend.name);
	this.audios[friend.name].play();
	$(div).css({"background-image": "url('" + friend.image + "')"});
	$(div).addClass("faceup").removeClass("facedown");
	this.last_cards_matched = false;
	var current_card = {"x": x, "y": y, "card_value": card_value, "div": div};

	if (this.first_card == null)
	{
		// this is the first move in a pair
		// save the information for later
		console.log("This is the first card (of a pair) that is flipped");
		this.first_card = current_card;
	}
	else
	{
		console.log("This is the second card (of a pair) that is flipped");
		if (card_value == this.first_card.card_value)
		{
			// match!
			console.log("Match :)");
			div.onclick = null;
			//this.first_card.onclick = null;
			this.last_cards_matched = true;

			var index = this.coord2index(this.first_card.x, this.first_card.y);
			this.all_cards[index].matched = true;
			index = this.coord2index(x, y);
			this.all_cards[index].matched = true;

			// determine end condition
			++this.pairs_matched;
			if (this.pairs_matched == (this.all_cards.length / 2) - 1)
			{
				// woo at the end!
				this.endGame();
			}
		}
		else
		{
			// no match
			// don't do anything
			console.log("No match :(");
		}
		this.first_card = null;
	}
};

/**
 * Get the friend for the specified card value.
 *
 * @param card_value The card's value (string)
 * @returns Friend object: { name: '...', image: '...' }
 */
Game.prototype.getFriendForValue = function(card_value)
{
	if (!this.faces.hasOwnProperty(card_value))
	{
		this.faces[card_value] = this.friends.pop();
	}
	return this.faces[card_value];
};

/**
 * Call the end-of-game REST method. This will submit the two unmatched cards
 */
Game.prototype.endGame = function()
{
	var remaining = [];
	for (var i = 0; i < this.all_cards.length; ++i)
	{
		var card = this.all_cards[i];
		if (!card.matched)
		{
			remaining.push(card);
		}
	}
	var one = remaining.pop();
	var two = remaining.pop();
	console.log("Ending with these cards:");
	console.dir(one);
	console.dir(two);
	// for help in callbacks below - the context breaks between callbacks
	// I can't just set {context: this} as the fadeTo() context is still wrong
	var game = this;
	$.ajax({
		url : this.baseurl + this.id + "/end",
		type : "POST",
		dataType : "json",
		data : {"x1": one.x, "y1": one.y, "x2": two.x, "y2": two.y},
		success : function(data) {
			console.log("End game data:");
			console.dir(data);
			game.container.fadeTo(1000, 0.5, function() {
				game.message_container.html(data.message);
				// TODO: something depending on win or lose
			})
		},
		error : function(data) {
			console.log("Failed on call to end the game, details follow");
			console.dir(data);
			this.showError("Failed on call to end the game :(");
		}
	});
};

/**
 * Converts an index to an x/y coord.
 *
 * @param i Index (0 <= i <= width * height)
 * @returns {x: ..., y: ...}
 */
Game.prototype.index2coord = function(i)
{
	var x = i % this.width;
	var y = Math.floor(i / this.width);
	return {'x': x, 'y': y};
}

/**
 * Converts x/y to an index. Opposite of index2coord().
 *
 * @param x The x coordinate
 * @param y The y coordinate
 * @returns The index
 */
Game.prototype.coord2index = function(x, y)
{
	return x + (y * this.width);
}

//Make this global
window.Game = Game;
