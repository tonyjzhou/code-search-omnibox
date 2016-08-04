var rootUrl = "https://phabricator-staging.twitter.biz/";
var symbolSearch = rootUrl + "diffusion/symbol/";

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
