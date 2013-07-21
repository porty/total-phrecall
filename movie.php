<!DOCTYPE html>
<html>
	<head>
		<title>Total Recall PHP + Facebook Example</title>
		<link href="css/main.css" rel="stylesheet" type="text/css"/>
		<script src="js/jquery-2.0.3.min.js" type="text/javascript"></script>
		<script src="js/friends.js.php" type="text/javascript"></script>
		<script src="js/game.js" type="text/javascript"></script>
	</head>
	<body>
		<div class="deck" id="deck">
		</div>
		<script>
			var game = null;
			$(function() {
				game = new Game("#deck", friends);
				//game.newGame("Rob", "robert.sean.mcneil@gmail.com");
				game.resume("51ea23136924fe1e7bc9c78a");
			});
		</script>
	</body>
</html>
