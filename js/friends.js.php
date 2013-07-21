<?php
	header('Content-type: text/javascript');
	// this is a bit hacky, but it ensures that Data::getFriends() doesn't
	// look in the wrong location
	chdir('..');

	require_once('includes/data.php');

	$count = @$_GET['count'];

	if (!isset($count))
	{
		$count = 15;
	}
	else
	{
		$count = (int) $count;
	}

	$friends = Data::getFriends($count);
?>

var friends = [

<?php foreach ($friends as $friend) { ?>
	{
		'name': '<?php echo $friend->getName(); ?>',
		'image': '<?php echo $friend->getImageUrl(); ?>'
	},
<?php } ?>

];
