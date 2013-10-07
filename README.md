# calFeed.js

calFeed is a super-simple to use jQuery function for displaying a list of forthcoming events on your page.

## Features

* Events are marked up as [schema.org](http://schema.org) events, including ISO 8601 timestamps and whatnot
* calFeed generates feed links below the events list
* The list is completely unstyled (feature not a bug)

## Easy peasy

Getting calFeed up and running is really easy.

1. Include the script in your head (you’ll need jQuery too of course.
2. Add a div with the id="eventList"
3. Run the function eventList();, passing in the ID for the publicly available Google calendar you would like to display.

### Credits

The original version of this file was inspired by [this post by Kevin Deldycke] (http://kevin.deldycke.com/2012/07/displaying-upcoming-events-google-calendar-javascript/)

I've included [autoLink.js] (https://github.com/bryanwoods/autolink-js) which finds and formats links in specified strings. It is cool and made by Bryan Woods.