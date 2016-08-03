var omnibox = chrome.omnibox;

var rootUrl = "https://phabricator-staging.twitter.biz";
//var rootUrl = "https://phabricator.twitter.biz";

var typeaheadUrl = rootUrl + "/typeahead/class/DiffusionSymbolDatasource/?__ajax__=true&q=";
//var searchUrl = rootUrl + "/search/?query=";
var searchUrl = rootUrl + "/diffusion/symbol/"

function isValidUrl(value) {
  // Copyright (c) 2010-2013 Diego Perini, MIT licensed
  // https://gist.github.com/dperini/729294
  // see also https://mathiasbynens.be/demo/url-regex
  // modified to allow protocol-relative URLs
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test( value );
}

omnibox.onInputChanged.addListener(function (text, suggest) {
  $.get(typeaheadUrl + text,
    function (data) {
      var payload = $.parseJSON(data.substring(data.indexOf('{')))['payload'];
      var suggestions = payload.map(
        function (result) {
          var matchedWord = result[0];
          var URI = result[1];
          var type = result[5];

          return {
            content: rootUrl + URI,
            description: '<match>' + matchedWord + '</match> ' + type + ' <url>' + URI + "</url>"
          }
        });
      suggest(suggestions);
    }).fail(function (error) {
      alert("Error: " + JSON.stringify(error));
    });
});

omnibox.onInputEntered.addListener(function (text) {
  chrome.tabs.update({ url: isValidUrl(text) ? text : searchUrl + text });
});
