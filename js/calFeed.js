// calFeed.js is a simple tool for displaying an events list based on a Google Calender id
// Handmade with love by Marc Heatley || http://github.com/TheHeat || @marcheatley
// Inspired by http://kevin.deldycke.com/2012/07/displaying-upcoming-events-google-calendar-javascript/


// **********************
// Functions and helpers


// Day and Month name formatting helpers
var d_names = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
var m_names = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");


// Switch to add the appropriate suffix to date
function formatDate(dateNumber){

  var append = "";

  switch (dateNumber){
    case 1: case 21: case 31: append = "st"; break;
    case 2: case 22:          append = "nd"; break;
    case 3: case 23:          append = "rd"; break;
    default:                  append = "th"; break;
  }
  return dateNumber + append;
}


// Bump 24h clock down to 12h am/pm
function formatTime(hour, minutes){

  if(hour < 12){
    return hour + ":" + pad(minutes) + "am";
  }else {
    return (hour - 12) + ":" + pad(minutes) + "pm";
  }
}


// Autolink finds and formats links in specified strings
// It is cool and made by Bryan Woods
// https://github.com/bryanwoods/autolink-js
(function() {
  var autoLink,
    __slice = [].slice;

  autoLink = function() {
    var k, linkAttributes, option, options, pattern, v;
    options = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    pattern = /(^|\s)((?:https?|ftp):\/\/[\-A-Z0-9+\u0026@#\/%?=~_|!:,.;]*[\-A-Z0-9+\u0026@#\/%=~_|])/gi;
    if (!(options.length > 0)) {
      return this.replace(pattern, "$1<a href='$2'>$2</a>");
    }
    option = options[0];
    linkAttributes = ((function() {
      var _results;
      _results = [];
      for (k in option) {
        v = option[k];
        if (k !== 'callback') {
          _results.push(" " + k + "='" + v + "'");
        }
      }
      return _results;
    })()).join('');
    return this.replace(pattern, function(match, space, url) {
      var link;
      link = (typeof option.callback === "function" ? option.callback(url) : void 0) || ("<a href='" + url + "'" + linkAttributes + ">" + url + "</a>");
      return "" + space + link;
    });
  };

  String.prototype['autoLink'] = autoLink;

}).call(this);


// Utility method to pad a string on the left
// Thanks to http://sajjadhossain.com/2008/10/31/javascript-string-trimming-and-padding/
function pad(n){return n<10 ? '0'+n : n}

function eventList(calID){

  // Create the container elements for the list and feed links  
  $('#eventList').html('<ol class="events-list"><li>Nothing to see here!</li></ol><div class="feed-links"></div>');

  // All the feed strings
  var calJSON = 'http://www.google.com/calendar/feeds/' + calID + "/public/full?orderby=starttime&sortorder=ascending&futureevents=true&alt=json";
  var calGoog = 'http://www.google.com/calendar/embed?src=' + calID;
  var calRSS =  'http://www.google.com/calendar/feeds/' + calID + '/public/full?orderby=starttime&sortorder=ascending&futureevents=true';
  var calICal = 'http://www.google.com/calendar/ical/' + calID + '/public/basic.ics';
  

  // Get list of upcoming iCal events formatted in JSON
  $.getJSON( calJSON, function(data){

  // Parse and render each event
  $.each(data.feed.entry, function(i, item){
        
    if(i == 0) {
      $(".events-list li").first().hide();
    };


    // **********************
    // The Date
    // Pull in the date
    // format as ISO 8601
    // format a human readable version


    // set up the start date as a variable d
    var d = new Date(item.gd$when[0].startTime);
    var h = d.getHours();
    var m = d.getMinutes();

    // format as ISO 8601
    var dISO = d.toISOString();

    // format a human readable version     
    var dString =   d_names[d.getDay()] + " " + formatDate(d.getDate()) + " " + m_names[d.getMonth()] + " " + d.getFullYear();

    // Format the time
    var tString = "";

    if(d.getHours() != 0 || d.getMinutes() != 0) {
      tString = formatTime(h, m);
    };


    // **********************
    // The Venue
    // Pull in the location
    // format a Google Maps link

    var venue = item.gd$where[0].valueString;
    var venueLink = '<a href="http://maps.google.com/maps?q=' + venue + '"target="_blank">' + venue + '</a>';


    // **********************
    // The Content
    // Event title and description 

    var event_title  = '<h3 itemprop="name">' + item.title.$t + '</h3>';
    var event_content = '<p>' + item.content.$t + '</p>';

    // Render the event
    $(".events-list li").last().before(
        '<li itemscope itemtype="http://schema.org/Event">' +
        '<meta itemprop="startDate" content="' + dISO  + '">' +
        '<time datetime="' + dISO + '">' + dString + '</time>' +
        event_title + 
        event_content.autoLink() +
        tString + "</li>"
    );

    });
  });


  // **********************
  // The Feed links
  // Appends links to the Google Calendar, RSS and iCal

  var linkRSS  = '<a href="' + calRSS + '">' + 'RSS'  + '</a>';
  var linkIcal = '<a href="' + calRSS + '">' + 'iCal' + '</a>';
  var linkGcal = '<a href="' + calGoog + '">' + 'Google Calendar' + '</a>';
  
  $('.feed-links').html(linkGcal + ' ' + linkRSS + ' ' + linkIcal);
}