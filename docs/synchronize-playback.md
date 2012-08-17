# Creating Playback Page

This guide describes how to author an HTML document that synchronizes recorded
map change events to media playback. It assumes the following resources have
already been created:

- A media file
- Recorded map change events, stored on the server

1. **Upload the media file**  
  Store the file on a web server and note its URL.
2. **Open the administrative interface**  
  If the desired recording is stored in the local environment, refer to the
  instructions in the project's README.md file regarding starting and accessing
  a local instance of the service. Otherwise, visit the administrative
  interface at its publically-available URL.
3. **Edit the recording data**  
  Due to timing discrepencies, the recorded data may not perfectly synchronize
  with the desired media. The administrative interface provides controls for
  correcting these discrepancies in the downloaded data.
  1. Find the desired recording and select "Download"
  2. Input the media file's URL
  3. Select "Preview"
  4. Edit the data as necessary by changing the start time, end time, and
     offset
4. **Download the recording data**  
  Select "Download" and save the modified JSON data locally.
5. **Create the HTML document**  
  This document should include (at a minimum) the following assets:
  1. A media element with the ID of `live-map-media`. For example:  
    `<video id="live-map-media" src="path/to/the/video.webm"></video>`
  2. A `script` element with the ID of `live-map-data` that contains the JSON
     downloaded in step #4. It should also declare the following attribute:
     `type="text/json"` to ensure that the browser does not parse/render its
     contents. For example:  
     `<script type="text/json" id="live-map-data">[ "data goes here" ]</script>`
  3. An `iframe` element with the ID of `live-map-frame`. This will receive
     the recorded map events as the media plays back. For example:  
     `<iframe id="live-map-frame"></iframe>`
  4. The "liveMap playback" JavaScript file
6. **Upload the HTML document**
