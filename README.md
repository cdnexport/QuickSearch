# QuickTube
QuickTube is a browser extension that allows users to quickly open the first YouTube search result for highlighted text.

## ToDo
* Port extension to Firefox. (Currently only chrome is supported)
* Add options page with:
  * QuickTube will open the top search result in a new tab.
  * QuickTube will open the YouTube search results in a new tab.
* ~It is currently very slow. Likely because of it's use of XMLHTTPRequest. Investigate if the features can be replaced with the Google API.~
  * [As of this commit](https://github.com/cdnexport/QuickTube/commit/c3479ae780ffef94fcf9614162b06ba2c34ab800) the extension feels significantly faster.
  * Investigation into Google API should still occur.
* Add ESLint.
* Investigate if this extension could result in an advertisement being returned as the top result.
* Sanitize the highlighted text properly to prevent XSS attacks.
* RELEASE!
