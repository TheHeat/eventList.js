eventList is a super-simple to use jQuery function for displaying a list of forthcoming events on your page.

## Features

* Events are marked up as [schema.org](http://schema.org) events, including ISO 8601 timestamps and whatnot
* eventList generates feed links below the events list
* The list is completely unstyled (feature not a bug)

## Easy peasy

Getting eventList up and running is really really easy.

1. [Find your calendar ID in the calendar settings page.](https://support.google.com/calendar/answer/63962?hl=en) The calendar _must_ be publicly available.
2. [Generate a Google Calender API key](https://console.developers.google.com/flows/enableapi?apiid=calendar)
3. Include the script in your head (you’ll need jQuery too)
4. Run the plugin on your desired target, passing in the ID for the publicly available Google calendar you would like to display.

```
<div id="target-div"></div>

<script>
	$(document).ready(function(){
	 $('#target-div').eventList('YOUR_GOOGLE_CALENDAR_ID@group.calendar.google.com');
	});
</script>
```

### Credits

The original version of this file was inspired by [this post by Kevin Deldycke] (http://kevin.deldycke.com/2012/07/displaying-upcoming-events-google-calendar-javascript/)

I've included [autoLink.js] (https://github.com/bryanwoods/autolink-js) which finds and formats links in specified strings. It is cool and made by Bryan Woods.
