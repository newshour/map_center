# expose global object for MapCenter consumption
root = exports ? this
root.nhmcStatic = {}

# import data from remote summary file
state_data = 'https://nh-ltm.s3.amazonaws.com/summary.js'
root.state_rollups = []
state_counts = []
video_counts = []
key_ranges = []

$.ajax
  url: state_data
  dataType: 'jsonp'
  cache: true
  jsonpCallback: 'showSummary'
  success : (data) =>
    buildStates(data)
    setMapData()

buildStates = (states) ->
  # run through each state and clean/rollup topline stats
  _.each states, (data, area) ->
    state = { name: area }
    # assumes that we have a req'd affiliation with every entry
    state.count = _.reduce(data.political_affiliation, (total, num, key) -> return total + num; 0)
    video_counts.push(state.count)
    # gender
    state.gender = data.gender
    # political orientation
    state.majority_party = _.chain(data.political_affiliation)
      .map((share,party) -> [party,share])
      .sortBy((entry) -> entry[1])
      .last()
      .value()
    # principal issues  
    issues = _.chain(data.categories)
      .map((count, cat) -> [cat,count])
      .sortBy((entry) -> entry[1])
      .value().reverse()
    state.top_issues = _.pluck(issues[0..1], 0)
    state_rollups.push(state)
  
  (state_counts["#{state.name}"] = state.count) for state in state_rollups  
  max = _.max(video_counts)
  key_ranges = (Math.round((x/max)*100) for x in [1..5])
  # Initialize dashboard after data load
  root.VideoDashboard.init()
  
# find data bounds set map painting config vars
setMapData = ->
  root.nhmcStatic = 
    'breaks' : key_ranges
    'colors' : ['#ffffcc', '#bae4bc', '#7bccc4', '#43a2c', '#0868ac']
    'decimalPlaces' : 0
    'suffix' : '%'
    'areas' : state_counts

root.fireOverlay = (state) ->
  root.VideoDashboard.fetchState(this.nhmcData.state)
  $('#tm-video-overlay').fadeIn 200

# render custom tooltip to surface data, fire event handler overlay

root.nhmcStaticTooltipFormatter = (thisFIPS, thisState, thisCounty, countyOnly, currentData) ->
  tooltipText = []
  state_info = _.find(state_rollups, (state) -> state.name.toLowerCase() is thisState.toLowerCase())
  tooltipText.push('<div id="tm-tooltip-wrapper"><div class="tm_title">' + thisState + '</div>')
  if state_info  
    maj_party = state_info.majority_party[0]
    party_sway = Math.round(state_info.majority_party[1]/state_info.count*100).toString()
    video_count = state_info.count.toString()
    key_issues = state_info.top_issues.join(', ')
    tooltipText.push('<div id="tm-tooltip-exp"><div class="tm_party_favor">' + maj_party + '<b>' + party_sway + '%</b></div>')
    tooltipText.push('<div class="tm_video_count"><b>' + video_count + "</b>total #{ if state_info.count > 1 then 'videos' else 'video' }</div>")
    tooltipText.push('<div class="tm_key_issues"><b>key issues: </b>' + key_issues  + '</div>')
    tooltipText.push('</div>')
  if (typeof(currentData.areas[thisState]) == 'undefined')
      tooltipText.push('Unavailable')
  else
    dataValue = currentData.areas[thisState]
  
  tooltipText.push('</div>')
  return tooltipText.join('');
  
# set click handlers on loaded states
$(document).one 'coreInitialized', ->
  for state in state_rollups
    nhmc.geo.usGeo[state.name].statePath.connect(
      'onclick',
      nhmc.geo.usGeo[state.name].statePath,
      fireOverlay
    )