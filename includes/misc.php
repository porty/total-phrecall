<?php

	/**
	 * Misc routines
	 */
	class Misc
	{
		/**
		 * Does $haystack end with $needle?
		 * @param string $haystack The big string
		 * @param string $needle What you're looking for
		 * @return boolean True if $haystack ends with $needle, false otherwise
		 */
		public static function endsWith($haystack, $needle)
		{
			// http://stackoverflow.com/questions/834303/php-startswith-and-endswith-functions
			return substr($haystack, -strlen($needle)) == $needle;
		}
	}

?>
