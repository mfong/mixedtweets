$(function() {
/* initialized SoundCloud */
SC.initialize({
  client_id: '7343345bd999dfb70c462490f4dace1a'
});

// javascript controls
$('#mt').on({
	click: function(e) {
		e.preventDefault();

		var widget = SC.Widget(document.querySelector('#scCont iframe'));
		widget.play();
	}
}, '.mt_play');

$('#mt').on({
	click: function(e) {
		e.preventDefault();

		var widget = SC.Widget(document.querySelector('#scCont iframe'));
		widget.pause();
	}
}, '.mt_pause');

$('#mt').on({
	click: function(e) {
		e.preventDefault();

		playNextTrack();
	}
}, '.mt_next');

$('#mt').on({
	click: function(e) {
		e.preventDefault();

		getNextTrack($(this).attr('twitteruser'));
	}
}, '.mt_setNext');

/* user enters a twitter username */
$('#twitterform').submit(function(e) {
	e.preventDefault();

	$('#explanation').fadeOut(1000);

	// remove any previous errors
	if ($('#userNameErr').is('*')) {
		$('#userNameErr').remove();
	}

	// check if there's input
	var twitterUsernameRegex = /^(\w){1,15}$/
	if ($('#twittername').val().search(twitterUsernameRegex) == -1) {
		$('<div>').attr('id', 'userNameErr').attr('class', 'alert alert-box alert-error').html('<i class="icon-warning-sign"></i> Please Enter a Valid Twitter Username').appendTo('#mt');
		return false;
	}

	// if the player div doesn't exist, create it
	if (!$('#scCont').is('*')) {
		$('<div>').attr('id', 'scCont').appendTo('#mt');
		// and add the controls right under it
		$('<div>').attr('class', 'controls').appendTo('#mt');
	}

	// search placeholder
	$('#scCont').html('<div class="alert alert-box alert-info status_msg"><i class="icon-spinner icon-spin"></i> Searching For Songs Tweeted By @' + $('#twittername').val() + '</div>');

	// get the first track of the entered screen name
	var url = "mixedtweets.php?action=getTrack&q=" + $('#twittername').val();
	$.getJSON(url, function(data) {
		if (data && data[0] && data[0]['message']) {
			$('#scCont').html('');
			$('<div>')
				.attr('class', 'alert alert-box alert-error status_msg')
				.html('<i class="icon-warning-sign"></i> ' + data[0]['message'] + '. Blame Twitter and please try again later :(')
				.appendTo('#scCont');
		} else if (data) {
			var track_url = data['track_url'];
			SC.get('/resolve', { url: track_url }, function(track) {
				if (track['title'] === undefined) {
					// wrong error, but this works for now
					$('#scCont').html('');
					$('<div>')
						.attr('class', 'alert alert-box alert-error status_msg')
						.html('<i class="icon-warning-sign"></i> No Songs Found! We\'ll try someone they mentioned...')
						.appendTo('#scCont')
						.delay(4000)
						.fadeOut(1000);
				} else {
					SC.oEmbed(track_url, { auto_play: true }, function(oEmbed) {
						$('#scCont').html(oEmbed['html']);

						// capture the widget and bind the finish event to play the next track
						var widget = SC.Widget(document.querySelector('#scCont iframe'));
						setTimeout(function() {widget.bind(SC.Widget.Events.READY, checkIfPlaying)}, 15000);
						widget.bind(SC.Widget.Events.FINISH, playNextTrack);

						// add the javascript media controls if they aren't already there
						if (!$('.mt_play').is('*')) {
							$('<a>').attr('href', '#play').attr('class', 'mt_play').html('<i class="icon-play"></i> play').appendTo('.controls');
							$('<a>').attr('href', '#pause').attr('class', 'mt_pause').html('<i class="icon-pause"></i> pause').appendTo('.controls');
							$('<a>').attr('href', '#next').attr('class', 'mt_next').html('<i class="icon-forward"></i> next').appendTo('.controls');
						}

						getTrackMentions(track_url);
					});
				}
			});

			getNextTrack($('#twittername').val());
		} else {
			$('#scCont').html('');
			$('<div>')
				.attr('class', 'alert alert-box alert-error status_msg')
				.html('<i class="icon-warning-sign"></i> No Songs Found! We\'ll try someone they mentioned...')
				.appendTo('#scCont')
				.delay(4000)
				.fadeOut(1000);


			getNextTrack($('#twittername').val());
		}
	});

});

function getNextTrack(user) {
	// if the next track div doesn't exist, create it
	if (!$('#nextCont').is('*')) {
		$('<div>').attr('id', 'nextCont').attr('class', 'clearfix').appendTo('#mt');
	}

	// next loading placehoder
	$('#nextCont').html('<div class="alert alert-box alert-info status_msg"><i class="icon-spinner icon-spin"></i> Finding your next track from @' + user + '\'s mentions...</div>');

	var url = "mixedtweets.php?action=getNextTrack&q=" + user;
	$.getJSON(url, function(data) {
		if (data && data[0] && data[0]['message']) {
			$('#nextCont').html('');
			$('<div>')
				.attr('class', 'alert alert-box alert-error status_msg')
				.html('<i class="icon-warning-sign"></i> ' + data[0]['message'] + '. Blame Twitter and please try again later :(')
				.appendTo('#nextCont');
		} else if (data) {
			var next_track = data['track_url'];
			var next_user = data['twitter_user'];

			SC.get('/resolve', { url: next_track }, function(track) {

				// sometimes the track is deleted or something breaks
				if (track['title'] === undefined) {
					// wrong error message, but works for now
					// TODO: add this user to naughty list, run getNextTrack again
					$('#nextCont').html('');
					$('<div>')
						.attr('class', 'alert alert-box alert-error status_msg')
						.html('<i class="icon-warning-sign"></i> No Songs Found! Please Try Another User')
						.appendTo('#nextCont')
						.delay(2000)
						.fadeOut(1000);
				} else {
					if (track['artwork_url'] == null) {
						track['artwork_url'] = 'img/mixedtweets_icon.png';
					}

					var scNext = '<img src="' + track['artwork_url'] + '" class="pull-left album_thumb">';
					scNext += 'Since <strong>@' + user + '</strong> mentioned <strong>@' + next_user + '</strong> on <strong>Twitter</strong>';
					scNext += '<br/>Your Next Track is <a href="#" class="mt_next">' + track['title'] + '</a> from <strong>SoundCloud</strong>';
					scNext += '<br/><br/><small>or pick another user to listen to a different track!</small>';

					if (data['mentions'].length > 0) {
						scNext += '<div class="also_mentioned"><div data-toggle="collapse" data-target="#mentions"><i class="icon-circle-arrow-down"></i> <strong>@' + user + '</strong> also mentioned...</div><div id="mentions" class="collapse"><div class="row-fluid"><div class="span3">';
						
						//split this up into 4 columns
						var perRow = data['mentions'].length / 4;
						j = 0;
						$.each(data['mentions'], function(i, v) {
							if (i - (perRow * j) > perRow) {
								scNext += '</div><div class="span3">';
								j++;
							}
							scNext += '<a href="#" class="mt_setNext" twitteruser="' + v + '"><img class="profile_pic" src="https://api.twitter.com/1/users/profile_image/' + v + '">@' + v + '</a><br/>';
						});
						scNext += '</div></div><br/><div data-toggle="collapse" data-target="#mentions"><i class="icon-circle-arrow-up"> Hide Me</div>';
					}


					$('#nextCont').html(scNext);
					$('.mt_next').attr('trackurl', next_track);
					$('.mt_next').attr('twitteruser', next_user);

					// if there's no widget yet
					if (!$('#scCont iframe').is('*')) {
						playNextTrack();
					}
				}
			});
		} else {
			$('#nextCont').html('');
			$('<div>')
				.attr('class', 'alert alert-box alert-error status_msg')
				.html('<i class="icon-warning-sign"></i> No Songs Found! Please Try Another User')
				.appendTo('#nextCont')
				.delay(2000)
				.fadeOut(1000);
		}
	});
}

function checkIfPlaying() {
	var widget = SC.Widget(document.querySelector('#scCont iframe'));
	/*widget.isPaused(function(callback) {
		console.log(callback);
	});*/

	// some tracks just won't play
	widget.getPosition(function(callback) {
		if (callback <= 0) {
			playNextTrack();
		}
	});
}

function playNextTrack() {

	var track_url = $('.mt_next').attr('trackurl');
	var track_user = $('.mt_next').attr('twitteruser');

	if ($('#scCont iframe').is('*')) {
		var widget = SC.Widget(document.querySelector('#scCont iframe'));
		widget.load(track_url, {auto_play: true});
	} else {
		SC.oEmbed(track_url, { auto_play: true }, function(oEmbed) {
			$('#scCont').html(oEmbed['html']);

			// capture the widget and bind the finish event to play the next track
			var widget = SC.Widget(document.querySelector('#scCont iframe'));

			// add the javascript media controls if they aren't already there
			if (!$('.mt_play').is('*')) {
				$('<a>').attr('href', '#play').attr('class', 'mt_play').html('<i class="icon-play"></i> play').appendTo('.controls');
				$('<a>').attr('href', '#pause').attr('class', 'mt_pause').html('<i class="icon-pause"></i> pause').appendTo('.controls');
				$('<a>').attr('href', '#next').attr('class', 'mt_next').html('<i class="icon-forward"></i> next').appendTo('.controls');
			}
		});
	}

	widget.bind(SC.Widget.Events.FINISH, playNextTrack);
	setTimeout(function() {widget.bind(SC.Widget.Events.READY, checkIfPlaying)}, 15000);

	$('#twittername').val(track_user);

	getNextTrack(track_user);
	getTrackMentions(track_url);
}

function getTrackMentions(track_url) {
	// if the next track div doesn't exist, create it
	if (!$('#mentionCont').is('*')) {
		$('<div>').attr('id', 'mentionCont').appendTo('#mt');
	}

	// mention loading placehoder
	$('#mentionCont').html('<div class="alert alert-box alert-info status_msg"><i class="icon-spinner icon-spin"></i> Finding People Who Tweeted This Song...</div>');

	var url = "mixedtweets.php?action=getTrackMentions&q=" + track_url;
	$.getJSON(url, function(data) {
		if (data['statuses'] && data['statuses'].length > 0) {
			var mentions = '<table class="table table-condensed table-striped table-hover"><thead><tr><th colspan="3">Who\'s Talking About This Track</td></tr></thead><tbody>';
			$.each(data['statuses'], function(i, v) {
				mentions += '<tr class="mt_setNext" twitteruser="' + v['user']['screen_name'] + '"><td><img src="' + v['user']['profile_image_url'] + '"></td><td><a href="#" class="mt_setNext">@' + v['user']['screen_name'] + '</a></td><td>' + v['text'] + '</td></tr>'
			});
			mentions += '</tbody></table>';

			$('#mentionCont').html(mentions);
		} else {
			$('#mentionCont').html('');
		}
	});
}

});