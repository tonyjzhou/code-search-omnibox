var omnibox = chrome.omnibox;
//var rootUrl = "https://phabricator-staging.twitter.biz";
var rootUrl = "https://phabricator.twitter.biz";

omnibox.onInputChanged.addListener(function (text, suggest) {
    $.get(rootUrl + "/typeahead/class/DiffusionSymbolDatasource/?__ajax__=true&q=" + text,
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

omnibox.onInputEntered.addListener(function (url) {
    chrome.tabs.update({
        url: url
    });
});
