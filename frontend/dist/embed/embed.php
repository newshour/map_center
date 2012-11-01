<?php
$VALID_VIEW_NAMES = array("us_all", "al", "ak", "az", "ar", "ca", "co", "ct", "de", "fl", "ga", "hi", "id", "il", "in", "ia", "ks", "ky", "la", "me", "md", "ma", "mi", "mn", "ms", "mo", "mt", "ne", "nv", "nh", "nj", "nm", "ny", "nc", "nd", "oh", "ok", "or", "pa", "ri", "sc", "sd", "tn", "tx", "ut", "vt", "va", "wa", "dc", "wv", "wi", "wy", "ak_08general");
$VALID_MODULES = array("static_maps", "past_primaries", "electoral_college", "general_election");
$LIVE_VIEWS_NEEDS_EMPTY = array(
    "al" => false,
    "ak" => true,
    "az" => false,
    "co" => false,
    "fl" => false,
    "ga" => false,
    "hi" => false,
    "id" => false,
    "ia" => false,
    "ks" => false,
    "la" => false,
    "me" => true,
    "ma" => false,
    "mi" => false,
    "mn" => false,
    "ms" => false,
    "mo" => false,
    "nv" => false,
    "nh" => false,
    "nd" => true,
    "oh" => false,
    "ok" => false,
    "sc" => false,
    "tn" => false,
    "vt" => false,
    "va" => false,
    "wa" => false,
    "wy" => true
);
$STATIC_VIEWS_HAS_STATES = array(
    # Keys are static map names.
    "08general" => true,
    "bachelors" => true,
    "diversity" => true,
    "ethnicity" => true,
    "foreclosures" => false,
    "evangelical" => true,
    "income" => true,
    "patchwork_types" => false,
    "population_density" => true,
    "primary_winners" => true,
    "senate_six" => true,
    "social_security" => true,
    "unemployment" => true,
    "unemployment_change" => true,
    "unions" => true,
    "voter_id" => true
);
$STATIC_VIEWS_MAX_INDEX = array(
    "ethnicity" => 3,
    "foreclosures" => 3,
    "unions" => 2
);
$STATIC_VIEWS_ATTRIB = array(
    "08general" => array(
        "href" => "http://nationalatlas.gov/mld/popul08.html",
        "text" => "U.S. Geological Survey, Federal Election Commission"
    ),
    "bachelors" => array(
        "href" => "http://www.census.gov/acs/",
        "text" => "U.S. Census Bureau"
    ),
    "diversity" => array(
        "href" => "http://2010.census.gov/2010census/data/redistricting-data.php",
        "text" => "U.S. Census Bureau"
    ),
    "ethnicity" => array(
        "href" => "http://2010.census.gov/2010census/",
        "text" => "U.S. Census Bureau"
    ),
    "evangelical" => array(
        "href" => "http://www.rcms2010.org/",
        "text" => "Association of Statisticians of American Religious Bodies, Association of Religion Data Archives"
    ),
    "foreclosures" => array(
        "href" => "http://www.patchworknation.org/",
        "text" => "Patchwork Nation"
    ),
    "income" => array(
        "href" => "http://www.census.gov/acs/",
        "text" => "U.S. Census Bureau"
    ),
    "patchwork_types" => array(
        "href" => "http://www.patchworknation.org/",
        "text" => "Patchwork Nation"
    ),
    "population_density" => array(
        "href" => "http://2010.census.gov/2010census/",
        "text" => "U.S. Census Bureau"
    ),
    "primary_winners" => array(
        "href" => "",
        "text" => "AP"
    ),
    "senate_six" => array(
        "href" => "",
        "text" => "NewsHour staff"
    ),
    "social_security" => array(
        "href" => "http://www.census.gov/acs/",
        "text" => "U.S. Census Bureau"
    ),
    "unemployment" => array(
        "href" => "http://www.bls.gov/lau/",
        "text" => "U.S. Bureau of Labor Statistics"
    ),
    "unemployment_change" => array(
        "href" => "http://www.bls.gov/lau/",
        "text" => "U.S. Bureau of Labor Statistics"
    ),
    "unions" => array(
        "href" => "http://www.bls.gov/news.release/union2.toc.htm",
        "text" => "U.S. Bureau of Labor Statistics"
    ),
    "voter_id" => array(
        "href" => "http://www.ncsl.org/legislatures-elections/elections/voter-id.aspx",
        "text" => "National Conference of State Legislatures"
    )
);
$MAP_TITLES = array(
    "08general" => "2008 presidential results",
    "bachelors" => "Education",
    "diversity" => "Diversity index",
    "ethnicity" => "Ethnicity: <span class=\"static_map_name\"></span>",
    "evangelical" => "Evangelical Protestants",
    "foreclosures" => "Foreclosures: <span class=\"static_map_name\"></span>",
    "income" => "Income",
    "patchwork_types" => "Patchwork Nation",
    "population_density" => "Population density",
    "primary_winners" => "Primary winners",
    "senate_six" => "Senate races to watch",
    "social_security" => "Social Security",
    "unemployment" => "Unemployment",
    "unemployment_change" => "Unemployment",
    "unions" => "Unions: <span class=\"static_map_name\"></span>",
    "voter_id" => "Voter ID laws",
    "past_primaries" => "Past results",
    "electoral_college" => "Electoral calculator",
    "general_election" => "Live results"
);
$SIDEBAR_TITLES = array(
    "08general" => "Win margin in general election",
    "bachelors" => "25-year-olds with a bachelor's degree or higher",
    "diversity" => "Diversity index <a href=\"#\" class=\"diversity_explain\">(?)</a>",
    "ethnicity" => "",
    "evangelical" => "Percent of population that adheres to Evangelical Protestant tradition",
    "foreclosures" => "",
    "income" => "Median household income, 2006&ndash;2010",
    "patchwork_types" => "County types",
    "population_density" => "Population density per square mile of land area",
    "primary_winners" => "State primary or caucus winner",
    "senate_six" => "Senate races",
    "social_security" => "Percent of households with Social Security income",
    "unemployment" => "",
    "unemployment_change" => "Unemployment rate change, January 2009 to January 2012",
    "unions" => "",
    "voter_id" => "States with voter ID laws",
    "past_primaries" => "<span id=\"precincts_percent\">0</span>% precincts reporting",
    "electoral_college" => "2012 prediction",
    "general_election" => "<span id=\"precincts_title\"><span id=\"precincts_percent\">0</span>% precincts reporting</span><span id=\"custom_title\"></span>"
);

$map_view = (isset($_GET['map_view']) && array_search($_GET['map_view'], $VALID_VIEW_NAMES)) ? $_GET['map_view'] : 'us_all';
$map_module = (isset($_GET['map_module']) && array_search($_GET['map_module'], $VALID_MODULES)) ? $_GET['map_module'] : 'static_maps';
$static_maps_type = (isset($_GET['static_maps_type']) && isset($STATIC_VIEWS_ATTRIB[$_GET['static_maps_type']])) ? $_GET['static_maps_type'] : 'diversity';
$static_maps_index = (isset($_GET['static_maps_index']) && isset($STATIC_VIEWS_MAX_INDEX[$static_maps_type]) && (int) $_GET['static_maps_index'] <= $STATIC_VIEWS_MAX_INDEX[$static_maps_type]) ? (int) $_GET['static_maps_index'] : 0;

$instructions = null;
if ($map_module == 'electoral_college') {
    $instructions = 'Click states to change party<br /><span class="smaller" id="ap_projection_attribution">(AP projection shown)</span>';
}

$map_title = (isset($MAP_TITLES[$map_module])) ? $MAP_TITLES[$map_module] : $MAP_TITLES[$static_maps_type];
$sidebar_title = (isset($SIDEBAR_TITLES[$map_module])) ? $SIDEBAR_TITLES[$map_module] : $SIDEBAR_TITLES[$static_maps_type];
$attrib = (isset($STATIC_VIEWS_ATTRIB[$static_maps_type])) ? $STATIC_VIEWS_ATTRIB[$static_maps_type] : null;

if ($map_module == 'past_primaries' && $LIVE_VIEWS_NEEDS_EMPTY[$map_view]) {
    $map_view = $map_view . '_empty';
} else if ($map_module == 'general_election' && $map_view == 'ak') {
    $map_view = $map_view . '_empty';
}

if ($map_module == 'static_maps' && $static_maps_type == '08general' && $map_view == 'ak') {
    $map_view = 'ak_08general';
}
?>
<!doctype html>
<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js ie7 oldie" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie8 oldie" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
    <head>
    	<title>2012 Political Map Center | PBS NewsHour</title>
	    <meta http-equiv="Content-Type" content="text/html;charset=ISO-8859-1" />
        <!-- Internet Explorer settings, including Chrome Frame -->
        <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=IE8" />
        <!-- Styles (see lib/map_center/main.js and lib/map_center/main.css) -->
        <link rel="stylesheet" type="text/css" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/themes/overcast/jquery-ui.css" />
        <link rel="stylesheet" type="text/css" href="embed.css" />
        <script type="text/javascript" src="respond.min.js"></script>
        <!-- JS libraries -->
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"></script>
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js"></script>
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/dojo/1.8.0/dojo/dojo.js"></script>
        <script type="text/javascript" src="../lib/highcharts.js"></script>
        <script src="../js/libs/modernizr-2.0.6.min.js"></script>
        <script type="text/javascript">
            // Defining helper functions here
            
            // Namespace factory
            var namespace=function(c,f,b){var e=c.split(f||"."),g=b||window,d,a;for(d=0,a=e.length;d<a;d++){g=g[e[d]]=g[e[d]]||{}}return g};
            
          <?php if ($map_module == 'static_maps') { ?>
            // Default index for static maps with multiple data sets
            var nhmcStaticDataIndex = <?php echo $static_maps_index; ?>;
                <?php if ($static_maps_type == '08general') { ?>
            // Overriding tooltip formatter
            var nhmcStaticTooltipFormatter = function(thisFIPS, thisState, thisCounty, countyOnly, currentData) {
                var tooltipText = [];
                
                if (countyOnly) {
                    tooltipText.push('<p>' + thisCounty + ': <br />');
                } else {
                    if (thisCounty) {
                        tooltipText.push('<p>' + thisCounty + ', ' + thisState + ': <br />');
                    } else {
                        tooltipText.push('<p>' + thisState + ': <br />');
                    }
                }
                
                tooltipText.push((currentData.prefix || ''));
                if (thisFIPS) {
                    var dataValue = currentData.areas[thisFIPS];
                } else {
                    var dataValue = currentData.areas[thisState];
                }
                var decimalPlaces = currentData.decimalPlaces || 0;
                if (dataValue > 0) {
                    tooltipText.push('Obama by ' + dataValue.toFixed(decimalPlaces) + (currentData.suffix || ''));
                } else if (dataValue < 0) {
                    tooltipText.push('McCain by ' + (-dataValue).toFixed(decimalPlaces) + (currentData.suffix || ''));
                } else if (dataValue == 0) {
                    tooltipText.push('Tie');
                } else {
                    tooltipText.push('Unavailable');
                }
                tooltipText.push('</p>');
                
                return tooltipText.join('');
            };
            
            
            // Overriding legend break text
            var nhmcStaticBreakFormatter = function(thisBreak, prevBreak, isLastBreak, breakPrefix, breakSuffix, breakDecimals) {
                function formatBreak(currentBreak) {
                    return breakPrefix + currentBreak.toFixed(breakDecimals) + breakSuffix;
                }
                
                if (thisBreak >= 0 && prevBreak >= 0) {
                    if (prevBreak == 0) {
                        return 'Obama by up to ' + formatBreak(thisBreak);
                    } else if (isLastBreak) {
                        return 'Obama by ' + breakPrefix + prevBreak.toFixed(breakDecimals) + '+' + breakSuffix;
                    } else {
                        return 'Obama by ' + prevBreak.toFixed(breakDecimals) + ' to ' + formatBreak(thisBreak);
                    }
                } else if (thisBreak <= 0 && prevBreak <= 0) {
                    if (thisBreak == 0) {
                        return 'McCain by up to ' + formatBreak(-prevBreak);
                    } else if (prevBreak) {
                        return 'McCain by ' + (-thisBreak).toFixed(breakDecimals) + ' to ' + formatBreak(-prevBreak);
                    } else {
                        return 'McCain by ' + breakPrefix + (-thisBreak).toFixed(breakDecimals) + '+' + breakSuffix;
                    }
                } else if (thisBreak >= 0 && prevBreak <= 0) {
                    return 'McCain by ' + formatBreak(-prevBreak) + ' to Obama by ' + formatBreak(thisBreak);
                }
            };
                <?php } elseif ($static_maps_type == 'diversity') { ?>
            $(document).ready(function() {
                $('#diversity_explain_dialog').dialog({
                    autoOpen: false
                });
                $('.diversity_explain').click(function() {
                    $('#diversity_explain_dialog').dialog('open');
                    return false;
                });
            });
                <?php } ?>
          <?php } elseif ($map_module == 'past_primaries') { ?>
            // Map-specific overrides to live.js config
            var nhmc_live_config = {
                autoRefresh: false,
                bigCandidates: 3,
                condenseCandidates: true,
                hoverExpandOther: true,
                showCandidates: [
                  <?php
                  if ($live_candidates) {
                      for ($i = 0, $length = sizeof($live_candidates); $i < $length; $i++) {
                          if ($i != $length - 1) {
                  ?>
                    "<?php echo $live_candidates[$i]; ?>",
                  <?php
                          } else {
                  ?>
                    "<?php echo $live_candidates[$i]; ?>"
                  <?php
                          }
                      }
                  ?>
                    
                  <?php } else { ?>
                    "Mitt Romney",
                    "Rick Santorum",
                    "Ron Paul",
                    "Newt Gingrich"
                  <?php } ?>
                ],
                tooltipsEnabled: true
            };
          <?php } elseif ($map_module == 'electoral_college') { ?>
            $(document).ready(function() {
                $('#map').one('click', function() {
                    $('#instructions .smaller').css('visibility', 'hidden');
                });
            });
          <?php } ?>
        </script>
        <!-- Map Center core -->
        <script type="text/javascript" src="../lib/map_center/usps_fips.js"></script>
        <script type="text/javascript" src="../lib/map_center/main.js"></script>
        
      <?php if ($map_view == 'us_all' || $map_module == 'general_election') { ?>
        <script type="text/javascript" src="../lib/maps/states_only.js"></script>
      <?php } ?>
        
        <!-- Individual Map Center modules -->
      <?php if ($map_module == 'static_maps') { ?>
        <script type="text/javascript" src="../lib/map_center/modules/static_maps.js"></script>
        <script type="text/javascript" src="../lib/map_center/modules/static_maps_data/<?php echo $static_maps_type; ?>.js"></script>
      <?php } elseif ($map_module == 'past_primaries') { ?>
        <script type="text/javascript" src="../lib/map_center/modules/live.js"></script>
      <?php } elseif ($map_module == 'general_election') { ?>
        <script type="text/javascript" src="../lib/map_center/modules/other_votes.js"></script>
      <?php } elseif ($map_module == 'electoral_college') { ?>
        <script type="text/javascript" src="../lib/map_center/modules/electoral_college.js"></script>
      <?php } ?>
        
        <script type="text/javascript">
            var _gaq = _gaq || [];
            _gaq.push(['_setAccount', 'UA-24888947-3']);
            _gaq.push(['_trackPageview']);
            (function() {
                var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
                ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
            })();
        </script>
    </head>
    <body>
        <div id="container">
            <div id="main" role="main">
                <div id="content">
                    <div id="emheader" class="cf">
    	                <div id="emlogo"><a href="http://www.pbs.org/newshour/vote2012/map/" target="_blank"><img src="logo.png"></a></div>
                    </div>
                    <div id="view_info">
                        <h1><?php echo $map_title; ?></h1>
                    </div>
                    <div id="content_area">
                      <?php if ($instructions) { ?>
                        <h2 id="instructions"><?php echo $instructions; ?></h2>
                      <?php } ?>
                        <div id="map_container">
                            <div id="map_aspect_ratio_enforcer"></div>
                            <div id="map"></div>
                        </div>
                        <div id="sidebar" class="cf">
                            <h3 id="sidebar_title" class="static_map_name"><?php echo $sidebar_title; ?></h3>
                            <div id="legend">
                                <?php if ($map_module == 'general_election') { ?>
                                  <div id="other_back_link"><a href="#">Back to U.S.</a></div>
                                <?php } ?>
                                <div id="legend_templates">
                                    <!-- Static maps -->
                                  <?php if ($map_module == 'static_maps') { ?>
                                    <div class="category_entry">
                                        <div class="entry_color">&nbsp;</div>
                                        <div class="category_name"></div>
                                    </div>
                                    <div class="break_entry">
                                        <div class="entry_color">&nbsp;</div>
                                        <div class="break_text"></div>
                                    </div>
                                    <!-- Primaries -->
                                  <?php } elseif ($map_module == 'past_primaries') { ?>
                                    <div class="candidate_big">
                                        <div class="candidate_color">&nbsp;</div>
                                        <div class="candidate_name">
                                            <span class="candidate_name_first"></span>
                                            <span class="candidate_name_last"></span>
                                        </div>
                                        <img class="candidate_image" src="../candidate_placeholder_50x75.png" width="66" height="69" />
                                        <div class="candidate_votes"></div>
                                        <div class="candidate_vote_count_wrapper"><span class="candidate_vote_count"></span><span class="candidate_vote_count_units"> votes</span></div>
                                        <div class="candidate_won"><img src="../lib/images/won.png" /></div>
                                        <div class="clear"></div>
                                    </div>
                                    <div class="candidate_small">
                                        <div class="candidate_color">&nbsp;</div>
                                        <div class="candidate_name">
                                            <span class="candidate_name_first">Firstname</span>
                                            <span class="candidate_name_last">Lastname</span>
                                        </div>
                                        <div class="candidate_vote_count"></div>
                                        <div class="candidate_votes"></div>
                                    </div>
                                  <?php } elseif ($map_module == 'general_election') { ?>
                                    <div class="candidate_big">
                                        <div class="candidate_color">&nbsp;</div>
                                        <div class="candidate_name">
                                            <span class="candidate_name_first"></span>
                                            <span class="candidate_name_last"></span>
                                        </div>
                                        <img class="candidate_image" src="candidate_placeholder_50x75.png" width="66" height="69" />
                                        
                                        <!-- .candidate_vote_count gives the total number of votes cast; .candidate_votes expresses that vote as a percentage. -->
                                        <div class="candidate_votes"></div>
                                        <div class="candidate_vote_count_wrapper"><span class="candidate_vote_count"></span> votes</div>

                                        <div class="candidate_won"><img src="lib/images/won.png" /></div>
                                        <div class="clear"></div>
                                    </div>
                                    <div class="candidate_small">
                                        <div class="candidate_color">&nbsp;</div>
                                        <div class="candidate_name">
                                            <span class="candidate_name_first">Firstname</span>
                                            <span class="candidate_name_last">Lastname</span>
                                        </div>
                                        <div class="candidate_vote_count"></div>
                                        <div class="candidate_votes"></div>
                                    </div>
                                    <div class="national_candidate_big">
                                        <div class="candidate_color">&nbsp;</div>
                                        <div class="candidate_name">
                                            <span class="candidate_name_first"></span>
                                            <span class="candidate_name_last"></span>
                                        </div>
                                        <img class="candidate_image" src="candidate_placeholder_50x75.png" width="66" height="69" />
                                        
                                        <!-- .candidate_vote_count is unused; .candidate_votes shows the number of seats won. -->
                                        <div class="candidate_votes"></div>
                                        <div class="candidate_vote_count_wrapper">seats won</div>

                                        <div class="candidate_won"><img src="lib/images/won.png" /></div>
                                        <div class="clear"></div>
                                    </div>
                                    <div class="national_candidate_small">
                                        <div class="candidate_color">&nbsp;</div>
                                        <div class="candidate_name">
                                            <span class="candidate_name_first">Firstname</span>
                                            <span class="candidate_name_last">Lastname</span>
                                        </div>
                                        <div class="candidate_vote_count_wrapper"></div>
                                        <div class="candidate_votes"></div>
                                    </div>
                                    <div class="national_presidential_candidate_big">
                                        <div class="candidate_color">&nbsp;</div>
                                        <div class="candidate_name">
                                            <span class="candidate_name_first"></span>
                                            <span class="candidate_name_last"></span>
                                        </div>
                                        <img class="candidate_image" src="candidate_placeholder_50x75.png" width="66" height="69" />
                                        
                                        <!-- .candidate_vote_count is the popular vote; .candidate_votes is the number of electoral votes won. -->
                                        <div class="candidate_votes"></div>
                                        <div class="candidate_vote_count_wrapper">electoral votes<div><span class="candidate_vote_count"></span> votes</div></div>

                                        <div class="candidate_won"><img src="lib/images/won.png" /></div>
                                        <div class="clear"></div>
                                    </div>
                                    <div class="national_presidential_candidate_small">
                                        <div class="candidate_color">&nbsp;</div>
                                        <div class="candidate_name">
                                            <span class="candidate_name_first">Firstname</span>
                                            <span class="candidate_name_last">Lastname</span>
                                        </div>
                                        <div class="candidate_vote_count"></div>
                                        <div class="candidate_votes"></div>
                                    </div>
                                  <?php } ?>
                                </div>
                              <?php if ($map_module == 'static_maps') { ?>
                                <div id="legend_entries"></div>
                              <?php } elseif ($map_module == 'past_primaries' || $map_module == 'general_election') { ?>
                                <div id="legend_candidates"></div>
                              <?php } elseif ($map_module == 'electoral_college') { ?>
                                <div id="ec_tally">
                                    <div id="ec_party_d" class="ec_party">
                                        <h4 id="ec_name_d" class="ec_name">Obama</h4>
                                        <h4 id="ec_name_abbr_d" class="ec_name_abbr">Dem.</h4>
                                        <div id="ec_detail_d" class="ec_detail">
                                            <span id="ec_total_d" class="ec_total">0</span> electoral votes
                                            <div id="ec_win_d" class="ec_win"><img src="../check.png" alt="Democrats win" /></div>
                                        </div>
                                    </div>
                                    <div id="ec_party_r" class="ec_party">
                                        <h4 id="ec_name_r" class="ec_name">Romney</h4>
                                        <h4 id="ec_name_abbr_r" class="ec_name_abbr">Rep.</h4>
                                        <div id="ec_detail_r" class="ec_detail">
                                            <span id="ec_total_r" class="ec_total">0</span> electoral votes
                                            <div id="ec_win_r" class="ec_win"><img src="../check.png" alt="Republicans win" /></div>
                                        </div>
                                    </div>
                                    <div id="ec_party_t" class="ec_party">
                                        <h4 id="ec_name_t" class="ec_name">Tossup</h4>
                                        <h4 id="ec_name_abbr_t" class="ec_name_abbr">Tossup</h4>
                                        <div id="ec_detail_t" class="ec_detail">
                                            <span id="ec_total_t" class="ec_total">0</span> electoral votes
                                            <div id="ec_win_t" class="ec_win"><img src="../check.png" alt="Other party wins" /></div>
                                        </div>
                                    </div>
                                </div>
                                <a href="calc.html#states=lrGSpRqGBlvGnqBlKp" id="use-ap-projections" style="display: none;">2012 AP Projections</a>
                              <?php } ?>
                            </div>
                            <input name="map_view" id="map_view" type="hidden" value="<?php echo $map_view; ?>" />
                        </div>
                        <div class="clear"></div>
                      <?php if ($map_module == 'static_maps') { ?>
                        <h2 id="static_data_source">
                          <?php if ($static_maps_type == 'ethnicity') { ?>
                            Source: <a href="<?php echo $attrib['href']; ?>" target="_blank"><?php echo $attrib['text']; ?></a>. Totals might exceed 100% in some areas since people can identify with multiple groups.
                          <?php } else { ?>
                            Source: <a href="<?php echo $attrib['href']; ?>" target="_blank"><?php echo $attrib['text']; ?></a>
                          <?php } ?>
                        </h2>
                      <?php } elseif ($map_module == 'past_primaries' || $map_module == 'general_election') { ?>
                        <h2 id="updated_info">All data from AP | Last updated <span id="last_updated"></span></h2>
                      <?php } ?>
                    </div>
                  <?php if ($map_module == 'static_maps' && $static_maps_type == 'diversity') { ?>
                    <div id="diversity_explain_dialog" title="Diversity index explained">
                        <p>The U.S. Census Bureau calculated this diversity index <a href="http://www.census.gov/population/cen2000/atlas/censr01-104.pdf" target="_blank">for the 2000 Census</a> and explained it as "the percentage of times two randomly selected people would differ by race/ethnicity."</p>
                        <p>We have updated the index using data from the 2010 Census for both counties and states.</p>
                    </div>
                  <?php } ?>
                </div>
            </div> 
        </div>
        <div class="hidden">
          <?php if ($map_module == 'general_election') { ?>
            <div class="view_tab view_tab_more view_tab_active"><a href="#us_all" id="view_tab_more_shown" class="view_tab_option">U.S.</a><a href="#" id="view_tab_more_toggle"><img src="arrow-down.png" /></a>
                <ul id="view_tab_more_menu">
                    <li style="display: none;"><a href="#us_all" class="view_tab_option">U.S.</a></li>
                    <li><a href="#al" class="view_tab_option">Alabama</a></li>
                    <!--
                    <li><a href="#ak" class="view_tab_option">Alaska</a></li>
                    -->
                    <li><a href="#ak_empty" class="view_tab_option">Alaska</a></li>
                    <li><a href="#az" class="view_tab_option">Arizona</a></li>
                    <li><a href="#ar" class="view_tab_option">Arkansas</a></li>
                    <li><a href="#ca" class="view_tab_option">California</a></li>
                    <li><a href="#co" class="view_tab_option">Colorado</a></li>
                    <li><a href="#ct" class="view_tab_option">Connecticut</a></li>
                    <li><a href="#de" class="view_tab_option">Delaware</a></li>
                    <li><a href="#fl" class="view_tab_option">Florida</a></li>
                    <li><a href="#ga" class="view_tab_option">Georgia</a></li>
                    <li><a href="#hi" class="view_tab_option">Hawaii</a></li>
                    <li><a href="#id" class="view_tab_option">Idaho</a></li>
                    <li><a href="#il" class="view_tab_option">Illinois</a></li>
                    <li><a href="#in" class="view_tab_option">Indiana</a></li>
                    <li><a href="#ia" class="view_tab_option">Iowa</a></li>
                    <li><a href="#ks" class="view_tab_option">Kansas</a></li>
                    <li><a href="#ky" class="view_tab_option">Kentucky</a></li>
                    <li><a href="#la" class="view_tab_option">Louisiana</a></li>
                    <li><a href="#me" class="view_tab_option">Maine</a></li>
                    <li><a href="#md" class="view_tab_option">Maryland</a></li>
                    <li><a href="#ma" class="view_tab_option">Massachusetts</a></li>
                    <li><a href="#mi" class="view_tab_option">Michigan</a></li>
                    <li><a href="#mn" class="view_tab_option">Minnesota</a></li>
                    <li><a href="#ms" class="view_tab_option">Mississippi</a></li>
                    <li><a href="#mo" class="view_tab_option">Missouri</a></li>
                    <li><a href="#mt" class="view_tab_option">Montana</a></li>
                    <li><a href="#ne" class="view_tab_option">Nebraska</a></li>
                    <li><a href="#nv" class="view_tab_option">Nevada</a></li>
                    <li><a href="#nh" class="view_tab_option">New Hampshire</a></li>
                    <li><a href="#nj" class="view_tab_option">New Jersey</a></li>
                    <li><a href="#nm" class="view_tab_option">New Mexico</a></li>
                    <li><a href="#ny" class="view_tab_option">New York</a></li>
                    <li><a href="#nc" class="view_tab_option">North Carolina</a></li>
                    <li><a href="#nd" class="view_tab_option">North Dakota</a></li>
                    <li><a href="#oh" class="view_tab_option">Ohio</a></li>
                    <li><a href="#ok" class="view_tab_option">Oklahoma</a></li>
                    <li><a href="#or" class="view_tab_option">Oregon</a></li>
                    <li><a href="#pa" class="view_tab_option">Pennsylvania</a></li>
                    <li><a href="#ri" class="view_tab_option">Rhode Island</a></li>
                    <li><a href="#sc" class="view_tab_option">South Carolina</a></li>
                    <li><a href="#sd" class="view_tab_option">South Dakota</a></li>
                    <li><a href="#tn" class="view_tab_option">Tennessee</a></li>
                    <li><a href="#tx" class="view_tab_option">Texas</a></li>
                    <li><a href="#ut" class="view_tab_option">Utah</a></li>
                    <li><a href="#vt" class="view_tab_option">Vermont</a></li>
                    <li><a href="#va" class="view_tab_option">Virginia</a></li>
                    <li><a href="#wa" class="view_tab_option">Washington</a></li>
                    <li><a href="#dc" class="view_tab_option">Washington, D.C.</a></li>
                    <li><a href="#wv" class="view_tab_option">West Virginia</a></li>
                    <li><a href="#wi" class="view_tab_option">Wisconsin</a></li>
                    <li><a href="#wy" class="view_tab_option">Wyoming</a></li>
                </ul>
            </div>
            <div class="view_tab view_tab_options_more view_tab_always_active"><a href="#" id="view_tab_options_more_shown" class="view_tab_option"></a><a href="#" id="view_tab_options_more_toggle"><img src="arrow-down.png" /></a>
                <ul id="view_tab_options_more_menu">
                </ul>
            </div>
            <div id="tooltip_template">
                <div class="tooltip_content">
                    <h3 class="tooltip_name"></h3>
                    <p class="tooltip_title"><span class="tooltip_precincts_reporting">0</span> of <span class="tooltip_precincts_total">0</span> precincts reporting</p>
                    <!--
                        Other <span> classes you might be interested in:
                            tooltip_precincts_percent
                    -->
                    <div class="tooltip_templates">
                        <table>
                            <tr class="tooltip_candidate">
                                <td class="tooltip_candidate_name">
                                    <span class="tooltip_candidate_name_first">Firstname</span>
                                    <span class="tooltip_candidate_name_last">Lastname</span>
                                </td>
                                <td class="tooltip_candidate_vote_count"></td>
                                <td class="tooltip_candidate_votes"></td>
                            </tr>
                        </table>
                    </div>
                    <table class="tooltip_candidate_table">
                        <thead>
                            <th class="tooltip_candidate_name">Candidate</th>
                            <th class="tooltip_candidate_vote_count">Votes</th>
                            <th class="tooltip_candidate_votes">Vote %</th>
                        </thead>
                        <tbody class="tooltip_candidates"></tbody>
                    </table>
                </div>
            </div>
          <?php } ?>
        </div>
    </body>
</html>
