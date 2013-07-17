<?php

	class Friend
	{
		private $name;
		private $imageUrl;

		public function __construct($name, $imageUrl)
		{
			$this->name = $name;
			$this->imageUrl = $imageUrl;
		}

		/**
		 * Get the person's first name (possibly for TTS purposes)
		 */
		public function getName()
		{
			return $this->name;
		}

		/**
		 * Get the URL for the friend's picture
		 */
		public function getImageUrl()
		{
			return $this->imageUrl;
		}
	}

	class FacebookFriend extends Friend
	{
		private $name;
		private $imageUrl;
	
		public function __construct($id, $name)
		{
			$imageUrl = 'https://graph.facebook.com/' . $id . '/picture?width=100&height=100';
			parent::__construct($name, $imageUrl);
		}
	}

?>
