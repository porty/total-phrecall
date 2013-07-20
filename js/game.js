
/**
 * Encapsulates game things. Requires jQuery. REST endpoint interface detailed
 * at http://totalrecall.99cluster.com/
 *
 * @param name The name of the player or of the author
 * @param email The email of the player or of the author
 */
function Game(container)
{
	this.container = container;
	this.id = "";
	this.width = -1;
	this.height = -1;
	this.baseurl = "http://totalrecall.99cluster.com/games/";

	this.first_card = null;
	this.busy = false;
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
Game.prototype.click = function(x, y)
{
	if (this.busy)
	{
		console.log("Currently busy, ignoring click at " + x + ", " + y);
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
			this.onGuess(x, y, data);
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

	if (this.width != 6 || this.height != 5)
	{
		// issue #6
		this.showError("Server has responded with a non 6x5 game, and I cannot cope with that");
		return;
	}
	// TODO
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
};

Game.prototype.onGuess = function(x, y, card_value)
{
	console.log("Guess at " + x + "," + y + " is " + card_value);
	this.busy = false;
	// TODO
	//  assign friend to card (based on card value)
	//  flip card, say name
	//  if first card
	//    save x/y/card_value to first_card
	//  else (if second card)
	//    if cards match (first_card == card_value)
	//      some sort of success sound?
	//      ensure cards can't be clicked (turn of onclick for both of the html elements)
	//    else (if cards don't match)
	//      ... nothing
	//  busy = false (so that click() won't ignore the next attempt - we're not busy anymore)
};
