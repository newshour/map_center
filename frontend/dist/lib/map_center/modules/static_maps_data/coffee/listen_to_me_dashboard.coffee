namespace = (target, name, block) ->
  [target, name, block] = [(if typeof exports isnt 'undefined' then exports else window), arguments...] if arguments.length < 3
  top    = target
  target = target[item] or= {} for item in name.split '.'
  block target, top


namespace 'VideoDashboard', (exports) ->
  
  @state_directory = []
  @current_state = ''
    
  exports.init = ->
    # set event handlers on video overlay dashboard
    paginate.init()
    $('.item').live 'click', ->
      id = $(this).attr('data-content-id')
      showcasePanel(id)
    #close overlay control
    $('#close-overlay').bind 'click', ->
      # kill video if overlay's closed
      $('#video-drop iframe').remove()
      $('#tm-video-overlay').fadeOut 200
    browseStates()  
    
    # default state load
    @fetchState('California')
    
  
  exports.fetchState = (state) ->
    state_data = "https://nh-ltm.s3.amazonaws.com/#{state}.js"
    if this_state = _.find(state_directory, (i) -> return i.name is state)
      renderState(this_state)
    else  
      $.ajax
        url: state_data
        type: 'GET'
        dataType: 'jsonp'
        cache: true
        success : (data) ->
          #JSON.parse(data)
  
  @showState = (state, info) ->
    unless _.find(state_directory, (i) -> i.name is state)
      _state = { name: state, entries: [], count: info.length }
      for item in info
        entry = {}
        entry.id = item.content_id
        entry.title = item.title
        entry.post_name = item.name
        entry.avatar = item.attribution_avatar
        entry.date = item.add_date
        entry.city = item.city
        entry.state = item.state
        entry.gender = item.gender
        entry.affiliation = item.political_affiliation
        entry.issues = _.pluck(item.categories, 'category_name').join(', ')
        entry.thumb = item.media[0].thumb
        entry.media = item.media[0].video_url
        _state.entries.push(entry)
      state_directory.push(_state)
    renderState(_state)


  @renderState = (state) ->
    paginate.reset()
    paginate.total_pages = Math.ceil(state.entries.length / paginate.items_per_page)
    $('#pg-dir #start-page').text("1")
    $('#pg-dir #end-page').text("#{ paginate.total_pages }")
    @current_state = state.name
    $('#current-state').text("#{state.name}")
    paginate.updateProgress()
    $('#page-cntrl-rgt').removeClass('disabled') if paginate.total_pages > 1
    # render states clips
    render.featuredClips(state.entries)
    showcasePanel(state.entries[0].id)
    
    
  @render =
    featuredClips : (items) ->
      $('#page-track').fadeOut 300, ->
        $(this).html((JST["templates/ltm_featured_clips"]({ set: items, per_page: paginate.items_per_page }))).fadeIn 300, ->
          $('.item > .title').dotdotdot()
      
  @showcasePanel = (id) ->
    curr_state = _.find(@state_directory, (state) -> state.name is @current_state)
    video = _.find(curr_state.entries, (entry) -> return entry.id is id)
    $('#view-port-zone').html((JST["templates/ltm_showcase_panel"]({ feature: video }))).fadeIn 300
      
      
  paginate =
    items_per_page: 4
    total_pages: 0
    current_page: 0
    
    init : ->
      # set control handlers
      $('#page-cntrl-lft').bind 'click', ->
        paginate.prevPage()
      $('#page-cntrl-rgt').bind 'click', ->
        paginate.nextPage()
      
    reset : ->
      # cycle counts
      @total_pages = 0
      @current_page = 1
      $('#page-cntrl-lft').addClass('disabled')
    
    updateProgress : ->  
      $('#pg-dir #start-page').text("#{ @current_page }")
      $('#scrubber #elapsed').css('width' : "#{ Math.round((@current_page/@total_pages)*100) }%" )
      
    nextPage : ->
      if @current_page < @total_pages and !$('#page-cntrl-rgt').hasClass('disabled')
        $('#page-track .selected').fadeOut 300, ->
            $('.feature_page').removeClass('selected')
            $("[data-page-num='#{paginate.current_page + 1}']").fadeIn 300, ->
              $(this).addClass('selected')
              $('.item > .title').dotdotdot()
              paginate.current_page += 1
              paginate.updateProgress()
              if paginate.current_page == paginate.total_pages then $('#page-cntrl-rgt').addClass('disabled')
              if paginate.current_page != 1 then $('#page-cntrl-lft').removeClass('disabled')
    
    prevPage : ->
      if @current_page != 1 and !$('#page-cntrl-lft').hasClass('disabled')
        $('#page-track .selected').fadeOut 300, ->
            $(this).removeClass('selected')
            $("[data-page-num='#{paginate.current_page - 1}']").fadeIn 300, ->
              $(this).addClass('selected')
              $('.item > .title').dotdotdot()
              paginate.current_page -= 1
              paginate.updateProgress()
              if paginate.current_page == 1 then $('#page-cntrl-lft').addClass('disabled')
              if paginate.current_page != paginate.total_pages then $('#page-cntrl-rgt').removeClass('disabled')
    
  browseStates = ->
    # add current states to list
    for state in state_rollups
      i = $('<div\>', { class: 'state-select' })
      i.attr('data-state', state.name)
      i.text(state.name)
      $('#browse-popover').append(i)
      
    $('#browse-popover').lionbars()
    $('#browse-states').bind 'click', ->
      $('#browse-popover').fadeIn(200)
    $(document).bind 'click', (e) ->
      # collapse dropdown if user clicks out of bounds
      if $('#browse-popover').is(':visible') and !$(e.target).closest('#browse-states').length > 0
        $('#browse-popover').fadeOut 250     
    
    $('.state-select').bind 'click', ->
      new_state = $(this).attr('data-state')
      VideoDashboard.fetchState(new_state) 
      
      
