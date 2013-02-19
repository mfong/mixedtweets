<?
require_once('twitteroauth/twitteroauth.php');

$consumer_key = "83MHIvLeQr2Zt3QqO3eXLw";
$consumer_secret = "30h0qGW6RhUpjTDayKeCSTjAmOJgLqfk6DR9hv6Bes";
$access_key = "15512007-IBBbYoNX3wu8DTeSqS1IxYgQXEvZv27bsejNsohpE";
$access_secret = "rwPBADZWflr9zJNQWB1L4F6ANOFX1OaQBI4FIxlX6qY";

$conn = new TwitterOAuth ($consumer_key, $consumer_secret, $access_key, $access_secret);

switch($_GET['action']) {
	case 'getTrack':
		echo json_encode(getTrack($_GET['q'], $conn));
		break;
	case 'getNextTrack':
		echo json_encode(getNextTrack($_GET['q'], $conn));
		break;
	case 'getTrackMentions':
		$p['q'] = $_GET['q'];
		echo json_encode($conn->get('https://api.twitter.com/1.1/search/tweets.json', $p));
		break;
}

function getTrack($user, $conn) {
	$p['q'] = 'soundcloud from:' . $user . ' filter:links';
	$p['include_entities'] = true;
	$p['count'] = 100; //maximum
	$result = $conn->get('https://api.twitter.com/1.1/search/tweets.json', $p);

	if ($result->errors) {
		return $result->errors;
	}

	foreach($result->statuses as $s) {
		foreach ($s->entities->urls as $url) {

			// if the link has soundcloud.com in it, let it thorugh
			// yes, this is a very poor test
			if (stristr($url->expanded_url, 'soundcloud.com') === FALSE) {
				// otherwise, go through the headers to see where the link ends up
				// (for url shorteners)
				$urlHeaders = get_headers($url->expanded_url, 1);
				if (is_array($urlHeaders['Location'])) {
					// get the last hop
					$urlLocation = end($urlHeaders['Location']);
				} else {
					$urlLocation = $urlHeaders['Location'];
				}
			} else {
				$urlLocation = $url->expanded_url;
			}

			// check to see if it's something the widget can play (3 slashes so it's not a user profile at least)
			if (stristr($urlLocation, 'soundcloud.com') !== FALSE) {
				preg_match_all('~/~', $urlLocation, $matches);
				if (sizeof($matches[0]) > 3) {
					$package = array();
					$package['twitter_user'] = $user;
					$package['track_url'] = $urlLocation;
					return $package;
				}
			}
		}
	}
}

function getNextTrack($user, $conn) {
	$mentions = array();

	$p['screen_name'] = $user;
	$p['count'] = 200; //maximum

	$result = $conn->get('https://api.twitter.com/1.1/statuses/user_timeline.json', $p);
	//print_r($result);

	foreach($result as $r) {
		foreach($r->entities->user_mentions as $mention) {
			$screen_name = $mention->screen_name;
			
			// let's not run the same name twice and let's not run on the original user either
			if (!in_array($screen_name, $mentions) && (strtolower($screen_name) != strtolower($user))) {
				array_push($mentions, $screen_name);
			} 
		}
	}

	// let's search for the first link from the array for mentions
	while(!empty($mentions)) {
		// randomize results
		shuffle($mentions);

		// get a screen name and remove it from the array
		$screen_name = array_pop($mentions);

		// if we find a link, return it
		$result = getTrack($screen_name, $conn);
		if ($result) {
			// also return the list of mentions which may have links
			$result['mentions'] = $mentions;
			return $result;
		}

	}
}