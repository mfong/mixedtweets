<!DOCTYPE html>
<html prefix="og: http://ogp.me/ns#">
<head>
<title>Mixed Tweets - Discover Music Through Twitter Conversations</title>
<meta name="keywords" content="mixed tweets, twitter music, music, hack day, tweets mixed, soundcloud, twitter, twitter track"/>
<meta name="description" content="Discover music through Twitter conversaions! Just put in a twitter user name and we'll do the rest!"/>

<meta property="og:title" content="Mixed Tweets - Discover Music Through Twitter Conversations"/>
<meta property="og:type" content="website"/>
<meta property="og:url" content="http://mixedtweets.com/"/>
<meta property="og:image" content="http://mixedtweets.com/img/mixedtweets_icon.png"/>
<meta property="og:site_name" content="Mixed Tweets"/>
<meta property="og:description" content="Discover music through Twitter conversaions! Just put in a twitter user name and we'll do the rest!"/>


<link rel="shortcut icon" href="/img/favicon.ico" />

<link href="css/bootstrap.min.css" rel="stylesheet" media="screen">
<link rel="stylesheet" href="css/font-awesome.min.css">
<link rel="stylesheet" href="css/font-awesome-social.css">
<!--[if IE 7]>
<link rel="stylesheet" href="css/font-awesome-ie7.min.css">
<link rel="stylesheet" href="css/font-awesome-more-ie7.min.css">
<![endif]-->
<link href="css/mixedtweets.css" rel="stylesheet" media="screen">
</head>
<body>

<div id="mt">
	<img src="img/mixedtweets.png"/>
	<form id="twitterform">
		<div class="input-prepend bigassinput">
			<span class="add-on">@</span>
			<input type="text" id="twittername"/>
		</div>
	</form>

	<div id="explanation" class="alert alert-box alert-info status_msg">
		<strong>Mixed Tweets</strong> lets you <strong>discover music</strong> through <i class="icon-twitter"></i> Twitter <strong>conversations</strong><br/><br/>
		Just put in a @username and we'll search their tweets for a <i class="icon-soundcloud"></i> SoundCloud link
	</div>

</div>

<footer class="alert alert-info">
	<div class="pull-left">
		<a href="https://www.facebook.com/MixedTweets" target="_blank"><i class="icon-facebook"></i>/MixedTweets</a><br/>
		<a href="https://twitter.com/playmixedtweets" target="_blank"><i class="icon-twitter"></i>/playmixedtweets</a>
	</div>

	<em>Made during <strong>1</strong> weekend at</em><br/>
	<em><a href="http://sf.musichackday.org/2013/" target="_blank">Music Hack Day 2013 San Francisco</a></em><br/>
	<em>by <a href="https://twitter.com/matthewfong" target="_blank">@matthewfong</a> and <a href="https://twitter.com/abehjat" target="_blank">@abehjat</a></em>
</footer>

<script src="http://code.jquery.com/jquery-latest.js"></script>
<script src="js/bootstrap.min.js"></script>
<script src="http://connect.soundcloud.com/sdk.js"></script>
<script src="https://w.soundcloud.com/player/api.js"></script>
<script src="js/mixedtweets.js"></script>
<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-38565673-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>
</body>
</html>