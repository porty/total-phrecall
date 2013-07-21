<?php

	require_once('friend.php');
	require_once('misc.php');

	/**
	 * Example and/or test data
	 */
	class Data
	{
		/**
		 * Get Friend objects to use. Friends are randomised and possibly
		 * limited to 15. If you say you need x friends you will receive x
		 * objects unless 'double' is true, in which case you will receive an
		 * array of x * 2 Friends (they come in pairs)
		 *
		 * @param int $count The number of unique friends required
		 * @param bool $double Double up on the friends?
		 * @param string $subject The directory that the friend images are stored
		 * under. Defaults to the Total Recall (1990) directory)
		 * @throws Exception If the number of friends cannot be satisfied
		 * @return array: Friend Array of Friend objects
		 */
		public static function getFriends($count, $double = false, $subject = 'movie')
		{
			// get all file name (without .jpg ext) within the image directory
			//$dir = dir('../images/' . $subject);
			$dir = dir('images/' . $subject);
			$names = array();
			while (false !== ($entry = $dir->read()))
			{
				if (Misc::endsWith($entry, '.jpg'))
				{
					$pathinfo = pathinfo($entry);
					$names[] = $pathinfo['filename'];
				}
			}

			// check that we can satisfy $count friends
			if (($count <= 0) || ($count > count($names)))
			{
				throw new Exception('Cannot get ' . $count . ' friends from ' .
						$subject . ' directory');
			}

			// return Friends
			$ret = array();
			for ($i = 0; $i < $count; ++$i)
			{
				$name = $names[$i];
				$ret[] = new Friend($name, 'images/' . $subject . '/' . $name . '.jpg');
			}
			if ($double)
			{
				$ret = array_merge($ret, $ret);
			}
			shuffle($ret);
			return $ret;
		}
	}

?>
