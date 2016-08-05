var rootUrl = "https://phabricator-staging.twitter.biz/";
var symbolSearch = rootUrl + "diffusion/symbol/";

var language = "java";
var typeaheadSearch = rootUrl + "typeahead/class/DiffusionSymbolByLanguageDatasource/?__ajax__=true%LANGUAGE&raw=%QUERY";

function generateLangUrlParam() {
  return document.getElementById('language').value == "all" ? "" : "/?lang=" + document.getElementById('language').value;
}

function clickHandler(e) {
  chrome.tabs.create({ url: symbolSearch + document.getElementById('symbol-text').value + generateLangUrlParam() });
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('search-button').addEventListener('click', clickHandler);
  document.getElementById('symbol-text').addEventListener('keypress', function(e) {
    if(e.keyCode==13) clickHandler();
  });
})

function prepareAsText(query, settings) {
//  settings = prepareByWildcard(query, settings);
  var language = document.getElementById('language').value;

  settings.url = settings.url.replace('%QUERY', query).replace('%LANGUAGE', language == 'all' ? '' : '&q=' + language);
  settings.dataType = 'text';

  return settings;
}

function formatResponse(response) {
  var payload = $.parseJSON(response.substring(response.indexOf('{')))['payload'];
  var results = payload.map(
    function (result) {

      return {
        value: result[0],
        url: result[1],
        type: result[5],
        formatted: result[0] + ': ' + result[5]
      }
    });

  return results;
}

var bestPictures = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
//  prefetch: 'https://twitter.github.io/typeahead.js/data/films/post_1960.json',
  remote: {
//    url: 'https://twitter.github.io/typeahead.js/data/films/queries/%QUERY.json',
    url: typeaheadSearch,
    prepare: prepareAsText,
//    wildcard: '%QUERY',
    transform: formatResponse
  }
});

function suggest(datum) {
//  return '<div><strong>' + datum.value + ' - ' datum.url + '</div>';
  return "hi";
}

$('#remote .typeahead').typeahead(null, {
  name: 'best-pictures',
  display: 'formatted',
  source: bestPictures,
//  templates: {
//    empty: [
//      '<div class="empty-message">',
//        'unable to find any Best Picture winners that match the current query',
//      '</div>'
//    ].join('\n'),
//    suggestion: Handlebars.compile('<div><strong>{{value}}</strong> – {{url}}</div>')
//  }
//  templates: {
//    empty: [
//     '<div class="empty-message">',
//       'unable to find any Best Picture winners that match the current query',
//     '</div>'
//   ].join('\n'),
//   suggestion: suggest
// }
});
