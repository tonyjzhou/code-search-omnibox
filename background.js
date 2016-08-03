var omnibox = chrome.omnibox;
var rootUrl = "https://phabricator-staging.twitter.biz";
//var rootUrl = "https://phabricator.twitter.biz";

omnibox.onInputChanged.addListener(function(text, suggest) {
    $.get(rootUrl + "/typeahead/class/PhabricatorSearchDatasource/?__ajax__=true&q=" + text, 
      function(data) {
        var payload = $.parseJSON(data.substring(data.indexOf('{')))['payload'];
        var suggestions = payload.map(
          function(result) {
            return {
              content: rootUrl + result[1],
              description: result.join(' ')
            }
          });
        suggest(suggestions);
      }).fail(function(error) {
        alert("Error: " + JSON.stringify(error));
      });
});

omnibox.onInputEntered.addListener(function(url) {
  chrome.tabs.update({
    url: url
  });
});
