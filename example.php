<?php

	require_once('includes/friend.php');
	require_once('includes/data.php');

	$friends = Data::getFriends(6 * 5 / 2);

?>
<!DOCTYPE html>
<html>
	<head>
		<title>Total Recall PHP + Facebook Example</title>
		<link href="css/main.css" rel="stylesheet" type="text/css"/>
		<script src="js/jquery-2.0.3.min.js" type="text/javascript"/>
	</head>
	<body>
		<audio id="tts"></audio>
		<script>
			var tts = document.getElementById("tts");
		
			function play(name) {
				tts.src = "http://tts-api.com/tts.mp3?q=" + name;
				tts.play();
			}
		</script>
		<div class="deck">
<?php

	$i = 0;
	foreach ($friends as $friend)
	{

?>
			<div class="card" id="card_<?php echo $i; ?>">
				<img src="<?php echo $friend->getImageUrl(); ?>" onclick="document.getElementById('tts_<?php echo $i; ?>').play();"/>
				<audio id="tts_<?php echo $i; ?>" preload="auto" src="http://tts-api.com/tts.mp3?q=<?php echo $friend->getName(); ?>"/>
			</div>
<?php

		++$i;
	}

?>
		</div>
	</body>
</html>
