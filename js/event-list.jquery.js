// eventList.js is a simple tool for displaying an events list based on a Google Calender id
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

// Utility method to pad a string on the left
// Thanks to http://sajjadhossain.com/2008/10/31/javascript-string-trimming-and-padding/
function pad(n){return n<10 ? '0'+n : n}

$.fn.eventList = function(calID, args){

  //Set some default parameters. All of these can be overridden by passing an object with one or more of these properties
  var defaults = {
    maxResults: 8,
    autolink: true,
    // key: ''
  }

  //Combine the parameters args and defaults
  var params = $.extend(true, defaults, args);

  linkContent = params.autolink;
  console.log(linkContent);

  //Delete parameters specific to this function in order to compose a query string
  var queryStringParams = $.extend(true, {}, params);
  delete queryStringParams.autolink;

  //Serialize the parameters into a query string
  var queryString = decodeURIComponent($.param(queryStringParams));

  // Create the container elements for the list and feed links
  $(this).html('<ol class="events-list"><li>Nothing to see here!</li></ol><div class="feed-links"></div>');

  // All the feed strings
  var calJSON = 'https://www.googleapis.com/calendar/v3/calendars/' + calID + '/events?' + queryString;
  var calGoog = 'http://www.google.com/calendar/embed?src=' + calID;
  var calICal = 'http://www.google.com/calendar/ical/' + calID + '/public/basic.ics';
  
  // Get list of upcoming iCal events formatted in JSON
  $.getJSON( calJSON, function(data){

  // Parse and render each event
  $.each(data.items, function(i, item){

    if(i == 0) {
      $(".events-list li").first().hide();
    };


    // **********************
    // The Date
    // Pull in the date
    // format as ISO 8601
    // format a human readable version


    // set up the start date as a variable d
    var d = new Date(item.start.dateTime);
    var h = d.getHours();
    var m = d.getMinutes();

    // format as ISO 8601
    var dISO = d;

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

    var venue = item.location;
    var venueLink = '<a href="http://maps.google.com/maps?q=' + venue + '"target="_blank">' + venue + '</a>';


    if(linkContent === true){
      eventDescription = item.description.autoLink();
    }else{
      eventDescription = item.description;
    }

    // **********************
    // The Content
    // Event title and description 

    var event_title  = '<h3 itemprop="name">' + item.summary + '</h3>';
    var event_content = '<div class="event-description" itemprop="description">' + eventDescription + '</div>';

    // Render the event
    $(".events-list li").last().before(
        '<li itemscope itemtype="http://schema.org/Event">' +
        '<meta itemprop="startDate" content="' + dISO  + '">' +
        '<time datetime="' + dISO + '">' + dString + '</time>' +
        event_title +
        event_content +
        tString + 
        venueLink +
        "</li>"
    );

    });
  });


  // **********************
  // The Feed links
  // Appends links to the Google Calendar, RSS and iCal

  var linkIcal = '<a href="' + calICal + '">' + 'iCal' + '</a>';
  var linkGcal = '<a href="' + calGoog + '">' + 'Google Calendar' + '</a>';
  
  $('.feed-links').html(linkGcal + ' | ' + linkIcal);
}