/* 

george.js 

see: https://www.jquerycards.com/ui/dialogs-lightboxes/simplelightbox/

see: https://simplelightbox.com/

*/
var memberRows = []; 
var rows = []; 
var groupRows = [];
var groupLabels = [];
var thisisatest = 'this is a test';
var simpleGallery = ''; 
var currentGroup = 0;
var currentSearch = '';
var searchModifier = '.show'; 
var searchName = ''; 
var photoBase = 'https://grcrane2.com/AAHS_Gallery2';
var baseURI = '/home2/grcranet/public_html/AAHS_Gallery2';
var csvURI = '/home2/grcranet/public_html/AAHS_Gallery2/gallery2.csv'; 
var logURI = '/home2/grcranet/public_html/AAHS_Gallery2/logfile.csv'; 
var foldersURI = '/home2/grcranet/public_html/AAHS_Gallery2/folders2.csv'; 
var debugflag = false; 

function debug (msg) {
    if (debugflag) console.log(msg);
}

function makeCarousel(selectorID, groupRows, base) {
  // Build the optional carousel 

    var i = '1';
    var href = '';
    var img = '';
    var title = '';
    var excerpt = '';
    var cats = '';
    var showcats = 'showcats';
    var testout = `<div class="slickButtons">
      <button class="prev slick-arrow"> < </button>
      <button class="next slick-arrow"> > </button>
      </div>
      <div class="theCarousel">`;
    groupRows.forEach(function(item,key) {
      i = key;
      title = item[1];
      excerpt = item[5];
      img = `https://grcrane2.com/${base}/${item[0]}/${item[6]}`;        
      testout +=
        `<div class="item" data-itemid="${i}" data-cat="${item[2]}" data-desc="${item[5]}">
        <a href="${href}"><img loading="lazy" src="${img}">
        <div class="title" data-itemid="${i}">${title}</div></a>
        <div class="classcontent">${excerpt}</div>
        <div class="readmore"><a href="${href}">Read More →</a></div>
        <div class="itemFilterCats ${showcats}">${cats}</div>
        </div>`;
    })
    testout += '</div>';
    jQuery(selectorID).html(testout);  
}

/* ---------------------------------------------- */
/* Fills in the top title information either      */
/* initially or when a new folder is selected     */
/* ---------------------------------------------- */

function fillTitleInfo (group, groupRows, groupLabels) {
    folderDate = (typeof groupRows[group][3] !== 'undefined') ? groupRows[3] : '';
    folderLoc  = (typeof groupRows[group][4] !== 'undefined') ? groupRows[4] : '';
    folderDesc = (typeof groupRows[group][5] !== 'undefined') ? groupRows[5] : '';
    infotitle = `${groupRows[group][1]}, ${groupRows[group][3]}, ${groupRows[group][4]}`;
    infotitle = `${groupRows[group][5]}`;
    var admin = jQuery('#cards').hasClass('canEdit');
    var groupkey = groupLabels[groupRows[group][0]]; 
    var groupname = groupRows[groupkey][2];
    jQuery('#galleryContainer div.info-title').text('(' + groupname+ ') ' + infotitle);
    jQuery('#galleryContainer div.info-textarea textarea').val(infotitle);
    jQuery('#galleryContainer div.info-textarea textarea').data('key',groupkey);
}

function fillImages(grouping, memberRows) {
  debug('Entry: fillImages');
  var temp = '<div class="thePhotos">';
  var total = memberRows.length;
  var m1 = '';
  var mm = '';

  var distype = '';
  var checked = '';
  var marker = '';
  var gclass = '';
  var fillimg = '';
  var thumbimg = '';
  var temprow = []; 
  var marktemp = []; 
  var capvalue = '';
  var title = '';
  var href = '';
  var temparr = []; 
  var templabel = '';
  folderref = '';
  var filetype = 'image';

  //var result = memberRows.filter(checkGroup);
  //function checkGroup(age, group) {
  //  return age[0] == grouping;
  //}

  result = memberRows

  //const thetest = groupRows.filter(checkGroup);
  var admin = jQuery('#cards').hasClass('canEdit');
  var total = result.length;
      jQuery.each( result, function( key, value ) {

        if (value.length > 1) {
        m1 = value[0].split('_');
        mm = m1[1];
        title = value[1] + ' (' + (key+1) + ')'; 
        capvalue = (typeof value[5] != 'undefined') ? value[5] : '';
        title = (capvalue) ? capvalue : title; 
         
        href= `${photoBase}/${value[0]}/${value[2]}`;

        distype = (value[4] == 'Y') ? ' show' : ' hidden';
        checked = (value[4] == 'Y')  ? ' checked ' : ''; 
        marker = (value[0] in groupLabels) ? groupRows[groupLabels[value[0]]][1] : ''; 
        folderref = (value[0] in groupLabels) ? groupLabels[value[0]] : ''; 
        marktemp = marker.split(' ');
        marker = marktemp[0];
        temparr = value[0].split('/');
        templabel = temparr[0] + '/' + temparr[1];
        gclass = (templabel in groupLabels) ? groupLabels[templabel] : '';
        fullimg = `${photoBase}/${value[0]}/${value[2]}`;
        filetype = (fullimg.split('.').pop() == 'mp4') ? 'video' : 'image';

        thumbimg = `${photoBase}/${value[0]}/${value[3]}`;
        if (value[2].startsWith('http')) {
          fullimg = value[2];
        }
        if (value[3].startsWith('http') == true) {
          thumbimg = value[3];
        }
        if (filetype == 'video') {
          capvalue = (capvalue == '') ? value[2] : capvalue;
 //         var tempx = value[1].split(" ");  
//          if (tempx[1] in videoIDs) {
//            fullimg = videoIDs[tempx[1]];
//          }
        }
        temp += `<figure class="${filetype} ${distype}" data-folder="${folderref}" data-key="${key}" data-name="${value[5]}">
        <div class="figImage">
             <a href="${fullimg}" >
             <img src="${thumbimg}" 
             data-src="${thumbimg}" title="${title}" loading="lazy">
             <div class="marker">${marker}</div>
             <div class="playCircle"></div>
              <div class="playButton"></div>
             </a>
          </div>
             <div class="imageGalleryCheck"><input tabindex="-1" type="checkbox" ${checked}></i></div>
              
             <figcaption>`;

          if (admin) {
        temp += 
             `<textarea rows=2 class="captionControl" style="width:100%;">${capvalue}</textarea></figcaption>
             </figure>`;
            } else {
              temp += `${capvalue}</figure>`;
            }

        }
      }); 
      jQuery('#cards').html(temp);
      
  return;
}


function setupLightbox() {
  debug('Entry: setupLightBox');
  
  if (typeof simpleGallery == 'object') {
        simpleGallery.refresh();
  }
  else {
    simpleGallery = new SimpleLightbox('.lightBoxVideoLink, .cards figure.image.active a', {
     showCaptions: true,captionAttribute: 'title'}
     );
  }
  var temp = jQuery('.cards figure.active a img[src=""]');
  jQuery.each(temp, function(index, value) {
    jQuery(this).attr('src',jQuery(this).data('src'));
  });
  var folderid = jQuery('.cards figure.active').eq(0).data('folder');
  jQuery('#galleryData').hide(); 
  if (typeof folderid != 'undefined' && folderid != null) {
    var numshowing = jQuery('figure.active').length;
    var showing = 'Showing: ' 
      + numshowing 
      + ' items of ' + jQuery('figure').length;
    jQuery('#galleryData div.theCount').text(showing);
    jQuery('#galleryData div.theTitle').text(groupRows[folderid][5]);
    //jQuery('#galleryData div.info-textarea textarea').val(groupRows[folderid][5]).data('key',folderid);

    jQuery('#infoForm textarea.titleControl').val(groupRows[folderid][5]).data('key',folderid);

    jQuery('#doRefresh').hide(); 
    jQuery('#showing').show();
    if (numshowing > 0) {
      jQuery('#galleryData').show(); 
    }
  }
  else {
    jQuery('#showing').hide();
  }
}

function doCarouselFilter(owl,filterType,filter) {
  debug('Entry: doCarouselFilter');
  var owl_object = owl.data( 'owl.carousel' );
  var owl_settings = owl_object.options;

  // Destroy OwlCarousel 
  owl.trigger( 'destroy.owl.carousel' );

  // Clone
  if( ! owl.oc2_filter_clone )
      owl.oc2_filter_clone = owl.clone()

  // Filter elements and clone
  if (filterType == 'class') {
    var clone_filter_items = owl.oc2_filter_clone.children(filter).clone();
  } else {
    var aval = filter.split(" ");
    var contains = '';
    aval.forEach(function(item,index) {
      if (item) {
        contains += '[data-desc*="' + item + '"]';
      }
    })
    var clone_filter_items = owl.oc2_filter_clone
      .find('div.item' + contains).clone();
  }

  if (jQuery(clone_filter_items).length < 6) {
    owl_settings.responsive[1000].loop = false;
  }
  else {
    owl_settings.responsive[1000].loop = true;
  }

  jQuery(clone_filter_items).each(function( index ) {
      jQuery(this).find('div.marker').text(index + 1);
    })

  // Put filter items and re-call OwlCarousel
  owl.empty().append( clone_filter_items ).owlCarousel( owl_settings );

  jQuery('#showing').hide();

  return jQuery(clone_filter_items).length;
}

/* ------------------------------------------------------------ */
/* Function to allow case insensitive :contains(xyz) construct  */
/* Will be used for the carousel title search                   */
/* ------------------------------------------------------------ */
// https://css-tricks.com/snippets/jquery/make-jquery-contains-case-insensitive/
jQuery.expr[":"].contains = jQuery.expr.createPseudo(function(arg) {
  return function( elem ) {
      return jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
  };
});

//JavaScript program to implement the approach
 
//function that converts the arrays to strings
//and then compares the strings
function isEqual(a, b)
{
    return JSON.stringify(a) === JSON.stringify(b);
}

function saveDataRow(cmd, key, newrow, baseURI = '') {
  
  isEqual = JSON.stringify(newrow) === JSON.stringify(rows[key]);
  if (isEqual) {console.log('Equal - nothing to update'); return;}

  console.log('typeof the_ajax_script.ajaxurl');
  if (typeof the_ajax_script === 'undefined') {
    console.log('Error: the_ajax_scripot.ajaxurl is undefined');
    return;
  }
  
  
  var dataval = {cmd: cmd, 
  row: newrow, baseURI: baseURI,
  action: 'more_post_ajax'};
  var hidden = (newrow[4] == 'Y') ? true : false; 
  jQuery.ajax({
      type: "POST",
      dataType: "html",
      url: the_ajax_script.ajaxurl,
      data: dataval,
      success: function (data) {
        var results = JSON.parse(data);
        if ('status' in results) { 
          if (results['status'] == 'saved') {
            var admin = jQuery('#cards').hasClass('canEdit');
            if (admin) {
              jQuery('figure[data-key="' + key + '"] figcaption textarea').text(newrow[5]);
            } else {
              jQuery('figure[data-key="' + key + '"] figcaption').text(newrow[5]);
            }
            jQuery('figure[data-key="' + key + '"] .imageGalleryCheck input').prop('checked',hidden);
            rows[key][5] = newrow[5];
            rows[key][4] = newrow[4];
            jQuery('figure[data-key="' + key + '"]').removeClass('hidden').addClass('show');
            if (newrow[4] == 'N') {
              jQuery('figure[data-key="' + key + '"]').addClass('hidden').removeClass('show');
            }
            jQuery('#doRefresh').show(); 
          }
          else if (results['status'] == 'reconciled') {
            jQuery('#message').html(results['out']);
          }
          else {
            jQuery('#message').text(data);
          }
        }
        else {
          console.log('OOPS: something went wrong');
          console.log(results);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
          console.log('error');
          console.log(jqXHR + " :: " + textStatus + " :: " + errorThrown);
      }

  });
}

/*This function will insure that all of the keys of the
passed in object array are lowercase.  This is so we can
confidently compare case insensitive keys
see - https://bobbyhadz.com/blog/javascript-lowercase-object-keys */

function toLowerKeys(obj) {
  debug('Entry: toLowerKeys');
  return Object.keys(obj).reduce((accumulator, key) => {
    accumulator[key.toLowerCase()] = obj[key];
    return accumulator;
  }, {});
}

function galleryControl (selectorID, attr = {}) {
  debug('Entry: galleryControl');
  attr = toLowerKeys(attr); // make sure the keys re lowercase
  var base = ('base' in attr) ? attr['base'] : 'AAHS_Gallery2';
  var startgroup = ('startgroup' in attr) ? attr['startgroup'] : '';
  var edit = ('edit' in attr) ? attr['edit'] : false;
  var header = ('header' in attr) ? attr['header'] : false;
  var headerTitle = ('title' in attr) ? attr['title'] : 'Photos';
  var headerSubTitle = ('subtitle' in attr) ? attr['subtitle'] : 'Scanned Photos';
  debugflag = ('debug' in attr) ? attr['debug'] : false;
  var view = ('view' in attr) ? attr['view'] : 'group';
  var buttons = ('viewbuttons' in attr) ? attr['viewbuttons'] : false;
  var theClass = (edit) ? 'canEdit' : ''; 
  if (typeof the_ajax_script === 'undefined') {
    //theClass = ''; // editing not available.
  }
  do_photoList(selectorID, base, theClass, edit, view, buttons,
    header, headerTitle, headerSubTitle, startgroup); 
}

/* ---------------------------------------------- */
/* Main routine to build a flexbox array of       */
/* photos                                         */
/* ---------------------------------------------- */

function do_photoList(
  selectorID = '#thePhotoGallery', 
  base = 'AAHS_Gallery2',
  theClass = 'canEdit', edit = false, view = 'group', viewButtons = true,
   header = false, title='', subtitle='', startgroup = '') {

  debug('Entry: do_photoList canEdit=' + theClass);

  if (location.hostname == 'localhost') {
    photoBase = 'http://localhost/' + base;
    csvURI = '/Users/george/Sites/' + base + '/gallery2.csv'; 
    logURI = '/Users/george/Sites/' + base + '/logfile.csv'; 
    baseURI = '/Users/george/Sites/' + base;
    foldersURI = '/Users/george/Sites/' + base + '/folders2.csv'; 
  }
  else {
    photoBase = 'https://grcrane2.com/' + base;
    csvURI = '/home2/grcranet/public_html/' + base + '/gallery2.csv'; 
    logURI = '/home2/grcranet/public_html/' + base + '/logfile.csv'; 
    baseURI = '/home2/grcranet/public_html/' + base;
    foldersURI = '/home2/grcranet/public_html/' + base + '/folders.csv'; 
  }

  var folderDate = ''; 
  var folderLoc = '';
  var folderDesc = ''; 
  var tempinfo = ''; 
  var infotitle = ''; 

  var temp = `
  <header id="masthead" class="photo-header home" role="banner">
    <div class="photo-branding">
          <h1 class="photo-title"><a href="https://wordpress.org/themes/" rel="home">${title}</a></h1>
        <p class="photo-description">${subtitle}</p>
    </div>
  </header>
  <!-- Trigger/Open The Modal -->

  <!-- The Modal -->
  <div id="myModal" class="modal">

    <!-- Modal content -->
    <div class="modal-content">
      <span class="close">&times;</span>
      <div class="videoContent">
        <!--iframe width="560" height="315" src="" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe -->
        <video controls preload="none" playsinline poster="">
          <source src="" type="video/mp4" />
          <p class="vjs-no-js">This video content is not supported in this browser</p>
        </video>

        <div class="videoCaption"></div>
      </div>

    </div>
  </div>

  <div id="galleryContainer" class="${theClass}" style="display:none;">
    <a id="doReconcile">Reconcile</a>
    <div id="viewButtons">
    <button id="setGallery">Group View</button>
    <button id="setFolder">Folder View</button>
    </div>
    <div id="message"></div>
   
    <!-- Group Dropdown View -->
    <div id="groupView">
      <div class="lmr" id="groupSelector">
        <div class="leftDiv"><a href="#" class="prevSelect">Prev</a></div>
        <div id="selectionChamp" class="middleDiv custom-select" >
          <select >
          </select>
        </div>
        <div class="rightDiv"><a href="#" class="nextSelect">Next</a></div>
      </div>
    
      <div id="searchGalleryBox" class="lmr searchBox">
        <div class="leftDiv"><span>Search Captions:</span></div>
        <div class="middleDiv"><input id="searchGallery" type="text"></div>
        <div class="rightDiv"><a href="#" id="clearSearch">Clear</a></div>
      </div>
    </div>

    <!-- Folder Carousel View -->

    <div id="folderView"> 
      <div class="lmr" id="folderSelector">
        <div class="leftDiv"><a href="#" class="prevSelect">Prev</a></div>
        <div class="middleDiv" id="filter"></div>
        <div class="rightDiv"><a href="#" class="nextSelect">Next</a></div>
      </div> 

      <div id="radioButtons">
        <div class="r">
          <input type="radio" id="cat1" name="fav_language" value="Events">
          <label for="cat1">Events</label>
        </div>
        <div class="r">
          <input type="radio" id="cat2" name="fav_language" value="Family">
          <label for="cat2">Family</label>
        </div>
       <div class="r">
          <input type="radio" id="cat3" name="fav_language" value="Family">
          <label for="cat3">Family</label>
        </div>
        <div class="r">
          <input type="radio" id="cat4" name="fav_language" value="Family">
          <label for="cat4">Family</label>
        </div>
        <div class="r">
          <input type="radio" id="cat5" name="fav_language" value="Family">
          <label for="cat5">Family</label>
        </div>
      </div>
    
      <div class="lmr" id="searchFolderBox" class="searchBox">
        <div class="leftDiv"><span>Search titles:</span></div>
        <div class="middleDiv"><input id="searchFolder" type="text"></div>
        <div class="rightDiv"><a href="#" id="clearFolderSearch">Clear</a></div>
      </div>
      
      <div id="theCount"></div>
      <div id="theCarousel"></div>
    </div>



    <div id='galleryData'>
      <div class="theTitle">the title</div>
      <div class="theCount">count</div>
      
      <!-- For editing folder information -->
      <div id="infoForm">
        <ul class="flex-outer">
            <li>
              <label>Description</label>
              <textarea  rows=2 class="titleControl" placeholder="Enter a description" style="width:100%;"></textarea>
            </li>
            <!--
            <li>
              <label>Location</label>
              <input class="short" type="text" placeholder="City, State, park etc.">
            </li>
            <li>
              <label>Date</label>
              <input class="short" type="text" placeholder="mm/dd/yyyy">
            </li>
            -->
          </ul>
      </div>

      <div class="editFolderInfo">
          

      </div>

      <hr>

      <div id="displayType">
        Display Type:<select>
          <option value="">All</option>
          <option value=".show" selected>Active</option>
          <option value=".hidden">Hidden</option>
        </select>
        <a href="#" id="doRefresh">Refresh</a>
      </div>
    
      <div id="cards" class="cards ${theClass}"></div>
    </div><!-- end galleryData -->
  </div><!-- end galleryContainer -->`;

  jQuery(selectorID).html(temp);

  


  // Hide the view buttons if directed to by attribute
  if (viewButtons == false) {
    jQuery(selectorID + ' #viewButtons').hide(); 
  }

  if (header == false) {
    jQuery('#masthead.photo-header').hide(); 
  }

  jQuery('#galleryContainer').hide(); 

  const d = new Date();
  var time = d.getTime();
  var csvurl = photoBase + '/returndata.php?t=' + time;
  jQuery.get(csvurl, function(data, status){
    memberRows = ('gallery' in data) ? data['gallery'] : data[0];
    groupRows = ('folders' in data) ? data['folders'] : data[1];
    videoMap = ('video' in data) ? data['video'] : data[3];
  
    if ('settings' in data) {
      baseURI = ('baseURI' in data['settings']) ? data['settings']['baseURI'] : baseURI; 
      csvURI = ('gallerycsv' in data['settings']) ? data['settings']['gallerycsv'] : csvURI; 
    }
    memberRows.shift(); 
    rows = memberRows;
    groupRows.shift();
    groupLabels = [];
    videoIDs = {};

    // Sort groups 
    groupRows.sort(function(a,b) {
      var x = a[1].toLowerCase();
      var y = b[1].toLowerCase();
      if (x < y) {return-1;}
      if (x > y) {return 1;}
      return 0; 
    });

    // Save labels 
    groupRows.forEach(function(item,key) {
      groupLabels[item[0]] = key; 
    })

    // Save Video IDs and link
    videoMap.forEach(function(item,key) {
      videoIDs[item[0]] = item[1]; 
    })

    // Create list of unique types
    const newArr = groupRows.map(myUniqueFunction);
    let uniqueItems = [...new Set(newArr)];
    function myUniqueFunction(item) {
      return item[2];
    }

    //makeCarousel('#putCarouselHere',groupRows, base);

    /* --- Build the navigation dropdown list */
    var temp = '';
    var prev = '';  
    var label = '';
    
    groupRows.forEach(function(item,key) {
       label = (item[2]) ? item[2] : 'Unknown';
       if (prev == '' || prev != label){ // new group found
        if (prev != '') { // close out previous group
          temp += '</optgroup>';
        }
        prev = item[2];
        var gclass = label.replace(' ','').toLowerCase(); 
        temp += `<optgroup label="${label}">`;
       }
       temp += `<option class="${gclass}" data-folder="${key}" value="${key}">${item[1]}</option>`
     
    })
    temp += '</optgroup>';
    jQuery('#selectionChamp select').html(temp);

    /* --- END Build the navigation dropdown list */

    /* --- Build the folder carousel list */

    var arr = [];
    var counts = {};
    groupRows.forEach(function(item,key) {
      groupRows[key][2] = item[2].replace(/[\s\:\,]/g, '_')
      counts[item[2]] = 1 + (counts[item[2]] || 0);
    });

    // Build the navigation dropdown list 
    var cats = `<select ><option value="" data-count="${groupRows.length}">All</option>`;
    var prev = '';  
    var radioButtons = `<div class="r">
          <input type="radio" id="idAll" name="fav_language" value="" checked>
          <label for="idAll">All</label>
        </div>`; 
    for(let key in counts){
      cats += `<option value="${key}" data-count="${counts[key]}">${key}</option>`
      radioButtons += `<div class="r">
          <input type="radio" id="id${key}" name="fav_language" value="${key}">
          <label for="id${key}">${key}</label>
        </div>`;
    }
    cats += '</select>';
    jQuery('#filter').html(cats);
    jQuery('#radioButtons').html(radioButtons);

    jQuery('#radioButtons div.r input').on('click',function(event) {
      debug('Change: #filter select');
        jQuery('#theCarousel').scrollLeft(0) ;
        jQuery('#theCarousel div.item.active').removeClass('active');
        var filter = this.value;
        if (filter != '') {
          filter = '.' + filter;
          jQuery('#theCarousel div.item').removeClass('show');
          jQuery('#theCarousel div.item' + filter).addClass('show');
          
        } else {
          jQuery('#theCarousel div.item').addClass('show');
        }
        jQuery('#radioButtons div.r label').removeClass('active');
        jQuery(this).parent().find('label').addClass('active');
        var selectLabel = jQuery(this).parent().find('label').text();
        var numitems = jQuery('#theCarousel div.item.show').length;
        jQuery('#searchFolder').val('');

        var result = jQuery('div.item' + filter);
        jQuery('#cards figure').removeClass('active');

        jQuery('#theCount').text('Showing: ' + numitems + ' folders of ' + groupRows.length + ' (' + selectLabel + ')'); 


        // set the slide number 
        jQuery('#theCarousel div.item.show').each(function(index, value) {
          jQuery(value).find('div.marker').text(index + 1);
        })

        jQuery('div#theCarousel div.item').off().on('click',function(event) {
          debug('Click: div#theCarousel div.item');
          event.preventDefault();
          jQuery('div#theCarousel div.item').removeClass('active');
          jQuery(this).addClass('active');
          var itemid = jQuery(this).data('itemid');
          var folderid = jQuery(this).data('folder');
          jQuery('#cards figure').removeClass('active');
          jQuery('#cards figure[data-folder="' + folderid + '"]').addClass('active');
          setupLightbox();  
        })   

        jQuery('div#theCarousel div.item.show').eq(0).trigger('click');       

    })
 
    var testout = ``;
    var eParts = []; 
    var eDate = '';
    //var eTitle = ''; 

    // Sort folders (groupRows) on the date column 
    groupRows.sort(function(a,b) {
      var x = a[3];
      var y = b[3];
      if (x < y) {return-1;}
      if (x > y) {return 1;}
      return 0; 
    });

    groupRows.forEach(function(item,key) { 
      i = key;
      folderref = (item[0] in groupLabels) ? groupLabels[item[0]] : ''; 
      title = item[1];
      excerpt = item[5];
      //eParts = excerpt.split(" ");
      eDate = (typeof eParts[0] != 'undefined') ? eParts[0] : '1900-00-00';
      //eParts.splice(1,2); 
      //eTitle = eParts.join(" ");
      img = `${photoBase}/${item[0]}/${item[6]}`; 
      var desc = item[5]; 

      testout +=
        `<div class="item ${item[2]}" data-folder="${folderref}" 
          data-itemid="${i}" data-cat="${item[2]}" data-desc="${desc}">
        <a href=""><img loading="lazy" src="${img}">
        <div class="marker">${key}</div>
        <div class="title" data-itemid="${i}">${title}</div></a>
        <div class="classcontent">${excerpt}</div>
        </div>`;      
    })

    // Sort groups 
    groupRows.sort(function(a,b) {
      var x = a[1].toLowerCase();
      var y = b[1].toLowerCase();
      if (x < y) {return-1;}
      if (x > y) {return 1;}
      return 0; 
    });


    jQuery('#theCarousel').html(testout); 
    /*
    var box2 = jQuery('#theCarousel div.item');
    var w = box2.width();
    w = (w + 10)  * 10;
    jQuery('#theCarousel').scrollLeft(w);
    */

    jQuery('#filter select').on('change', function() {
        debug('Change: #filter select');
        jQuery('#theCarousel').scrollLeft(0) ;
        jQuery('#theCarousel div.item.active').removeClass('active');
        var filter = this.value;
        if (filter != '') {
          filter = '.' + filter;
          jQuery('#theCarousel div.item').removeClass('show');
          jQuery('#theCarousel div.item' + filter).addClass('show');
          
        } else {
          jQuery('#theCarousel div.item').addClass('show');
        }
        var numitems = jQuery('#theCarousel div.item.show').length;
        jQuery('#searchFolder').val('');

        var result = jQuery('div.item' + filter);
        jQuery('#cards figure').removeClass('active');

        jQuery('#theCount').text('Showing: ' + numitems + ' folders of ' + groupRows.length); 


        // set the slide number 
        jQuery('#theCarousel div.item.show').each(function(index, value) {
          jQuery(value).find('div.marker').text(index + 1);
        })

        jQuery('div#theCarousel div.item').off().on('click',function(event) {
          debug('Click: div#theCarousel div.item');
          event.preventDefault();
          jQuery('div#theCarousel div.item').removeClass('active');
          jQuery(this).addClass('active');
          var itemid = jQuery(this).data('itemid');
          var folderid = jQuery(this).data('folder');
          jQuery('#cards figure').removeClass('active');
          jQuery('#cards figure[data-folder="' + folderid + '"]').addClass('active');
          setupLightbox();  
        })   

        jQuery('div#theCarousel div.item.show').eq(0).trigger('click');       
    });

    jQuery('#filter select').trigger('change');
       
    jQuery('#setGallery').on('click',function(event) {
      debug('Click: #setGallery');
      jQuery('#groupView').show().addClass('active');
      jQuery('#folderView').hide().removeClass('active');
      jQuery('button').removeClass('active');
      jQuery(this).addClass('active');
      jQuery('div#theCarousel div.item').eq(0).trigger('click'); 
    })

    jQuery('#setFolder').on('click',function(event) {
      debug('Click: setFolder');
      jQuery('#groupView').hide();
      jQuery('#folderView').show();
      jQuery('button').removeClass('active');
      jQuery(this).addClass('active');
      jQuery('#cards figure').removeClass('active');
      jQuery('#theCarousel div.item').removeClass('active');

      jQuery('.cards').removeClass('addMarker');
      jQuery('figure').removeClass('active');
      jQuery('div#theCarousel div.item.show').eq(0).trigger('click');
      setupLightbox();

      /* Experimenting with scolling to specific item */
        var al = jQuery('#theCarousel').offset().left; // current 
        var aw = jQuery('#theCarousel').width(); 
        var iw = jQuery('#theCarousel div.item:first').width();
        var il = jQuery('#theCarousel div.item:first').offset().left;
        //console.log('al=' + al + ' aw=' + aw + ' iw=' + iw + ' il=' + il);
        var w = (iw + 10) * 1;
        //jQuery('#theCarousel').scrollLeft(w);
        //console.log('al=' + al + ' aw=' + aw + ' iw=' + iw + ' il=' + il);
    })

    jQuery('#setGallery').trigger('click');
    if (view == 'folder') {
      jQuery('#setFolder').trigger('click');
    }

    /* --- END Build the folder carousel list */

    /* -- Kick things off by selecting the first item in dropdown */
    var group = jQuery('#selectionChamp option:first-child').val();
    if (startgroup != '') {
      group = jQuery('#selectionChamp option:contains(' + startgroup + ')').val();
    } 
    if (typeof group == 'undefined') {
      group = 0;
    }
    jQuery('#selectionChamp option[value="' + group + '"]').attr('selected', 'selected');
    fillImages(group,memberRows);

    jQuery('#cards').data("group",group);
    jQuery('figure').removeClass('active');
    currentSearch = 'figure[data-folder="' + group + '"]';
    //currentSearch = 'figure.' + group;
    jQuery(currentSearch + searchModifier + searchName).addClass('active');
    // for testing search 
    //jQuery('span.info-title[data-title*="testing" i]').css('background','red');
    setupLightbox();

     jQuery('#galleryContainer').show(); 

    /* ---------------------------------------------- */
    /* Declare events                                 */
    /* for non-admin                                  */
    /* ---------------------------------------------- */

    // When the user clicks on <span> (x), close the modal
    jQuery('#myModal span.close').on('click',function() {
      debug('Click: #myModal span.close');
      jQuery('#myModal').hide();
      var media = jQuery('#myModal .videoContent video').get(0);
            media.pause();
            media.currentTime = 0;
      //      $("div.videoContent iframe").attr('src', '');
    })

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target.id == 'myModal') {
        jQuery('#myModal span.close').trigger('click');
      }
    }

    jQuery('figure.video a').click(function(event) {

        event.preventDefault();
        var href = jQuery(this).attr('href');
        var poster = jQuery(this).find('img').attr('src');
 
        var datakey = jQuery(this).closest('figure').data('key');
        var temp = memberRows[datakey][1].split(" "); 
        var keytemp = temp[1].toString();    
        //href =  (keytemp in videoIDs) ? videoIDs[keytemp] : href; 
        var caption = jQuery(this).closest('figure').find('figcaption').text();

        jQuery('#myModal div.videoCaption').text(caption);
        jQuery('#myModal .videoContent video').attr('src',href);
        jQuery('#myModal .videoContent video').attr('poster',poster).css('object-fit','cover');
        jQuery('#myModal .videoContent video').css('background','url("' + poster + '")');


        $("div.videoContent iframe").attr('src', href);
        jQuery('#myModal').show();
       })

    jQuery('#groupSelector a.nextSelect').click(function() {
      debug('Click: #groupSelector a.nextSelect');
      var options = jQuery("#selectionChamp option");
      var i = options.index(options.filter(":selected"));
      if (i >= 0 && i < options.length - 1) {
          options.eq(i+1).prop("selected", true).trigger("change");
      }
      else {
        options.eq(0).prop("selected", true).trigger("change");
      }
    })

    jQuery('#groupSelector a.prevSelect').click(function() {
      debug('Click: #groupSelector a.prevSelect');
      var options = jQuery("#selectionChamp option");
      var i = options.index(options.filter(":selected"));
      if (i >= 0 && i < options.length - 1) {
        options.eq(i-1).prop("selected", true).trigger("change");
      }
      else {
        options.eq(0).prop("selected", true).trigger("change");
      }
    })

    jQuery('#folderSelector a.nextSelect').click(function() {
      debug('Click: #folderSelector a.nextSelect');
      var options = jQuery("#filter option");
      var i = options.index(options.filter(":selected"));
      if (i >= 0 && i < options.length - 1) {
          options.eq(i+1).prop("selected", true).trigger("change");
      }
      else {
        options.eq(0).prop("selected", true).trigger("change");
      }
    })

    jQuery('#folderSelector a.prevSelect').click(function() {
      debug('Click: #folderSelector a.prevSelect');
      var options = jQuery("#filter option");
      var i = options.index(options.filter(":selected"));
      if (i >= 0 && i < options.length - 1) {
        options.eq(i-1).prop("selected", true).trigger("change");
      }
      else {
        options.eq(0).prop("selected", true).trigger("change");
      }
    })

    jQuery('#searchGallery').on('keyup', function (event) {
      debug('keyup: #searchGallery');
      var thevalue = jQuery('#searchGallery').val();
      var contains = '';
      jQuery('figure').removeClass('active');
      jQuery('nav a.set').removeClass('active');
      if (!thevalue) {  
          group =   jQuery('#cards').data('group');
          jQuery('figure[data-folder="' + group + '"]').addClass('active');
          jQuery('.cards').removeClass('addMarker');
          jQuery('nav a[data-group="' + group + '"]').addClass('active');
          simpleGallery.refresh();
          jQuery('#selectionChamp select').removeClass('showSearch');
        }
        else {
          jQuery('.cards').addClass('addMarker');
          var str = '';
          var aval = thevalue.split(" ");
          aval.forEach(function(item,index) {
            if (item) {
              if (item) {
                str = str + '[data-name*="' + item + '" i]';
                contains += ' ' + item;
              }
            }
          })
          jQuery('#selectionChamp select').addClass('showSearch');
        }
      currentSearch = 'figure';
      searchName = str; 
      jQuery(currentSearch + searchModifier + searchName).addClass('active');
      setupLightbox();
    });  

    jQuery('#searchFolder').on('keyup', function (event) {
      debug('keyup: #searchFolder');
      var thevalue = jQuery('#searchFolder').val();
      var contains = '';
      var msg = '';
      jQuery('figure').removeClass('active');
      jQuery('nav a.set').removeClass('active');
      if (!thevalue) {  
          jQuery('#theCarousel div.item').addClass('show');
        }
        else {
          var str = '';
          var aval = thevalue.split(" ");
          aval.forEach(function(item,index) {
            if (item) {
              if (item) {
                contains += '[data-desc*="' + item + '" i]';
              }
            }
          })
         // jQuery('#selectionChamp select').addClass('showSearch');
        }
      currentSearch = 'figure';
      searchName = str;
      jQuery('#theCarousel div.item.active').removeClass('active');
      jQuery('#theCarousel div.item.show').removeClass('show');
      jQuery('#theCarousel div.item' + contains).addClass('show'); 
      var numitems = jQuery('#theCarousel div.item.show').length;
      // set the slide number 
      jQuery('#theCarousel div.item.show').each(function(index, value) {
        jQuery(value).find('div.marker').text(index + 1);
      })
      jQuery('#theCarousel').scrollLeft(0) ;
      if (thevalue) {msg = ' (Filtered: ' + thevalue + ')';}
      jQuery('#theCount').text('Showing: ' + numitems + ' folders of ' + groupRows.length + msg); 
      jQuery('#radioButtons div.r label').removeClass('active');
      jQuery('#radioButtons div.r input[value=""]').prop("checked", true).parent().find('label').addClass('active');
      setupLightbox();

      jQuery('div#theCarousel div.item').off().on('click',function(event) {
        debug('Click: div#theCarousel div.item');
        event.preventDefault();
        jQuery('div#theCarousel div.item.active').removeClass('active');
        jQuery(this).addClass('active');
        var itemid = jQuery(this).data('itemid');
        var folderid = jQuery(this).data('folder');
        jQuery('#cards figure.active').removeClass('active');
        jQuery('#cards figure[data-folder="' + folderid + '"]').addClass('active');
        setupLightbox();  
      })     

    }); 

    jQuery('#clearFolderSearch').click(function(event) { 
      debug('Click: #clearFolderSearch');
      event.preventDefault();
      jQuery('#theCarousel div.item').addClass('show'); 
      jQuery('#searchFolder').val('');
      jQuery('#theCarousel').scrollLeft(0) ;
      jQuery('#cards figure').removeClass('active');
      jQuery('#theCarousel div.item').removeClass('active');
      jQuery('#theCarousel div.item:first').addClass('active');
      var folderid = jQuery('#theCarousel div.item:first').data('folder');
      jQuery('#cards figure.active').removeClass('active');
      jQuery('#cards figure[data-folder="' + folderid + '"]').addClass('active');
      jQuery('#theCount').text('Showing: ' + groupRows.length + ' folders of ' + groupRows.length + ' (All)'); 
      jQuery('#radioButtons div.r input[value=""]').prop("checked", true).parent().find('label').addClass('active');
      setupLightbox();
    })

    jQuery('#clearSearch').click(function(event) {
      debug('Click: #clearSearch');
      event.preventDefault();
      group =   jQuery('#cards').data('group');
      jQuery('figure').removeClass('active');
      jQuery('nav a[data-group="' + group + '"]').addClass('active');
      searchName = ''
      currentSearch = 'figure[data-folder="' + group + '"]';

      jQuery(currentSearch + searchModifier + searchName).addClass('active');
      jQuery('#cards').removeClass('addMarker');
      jQuery('#searchGallery').val('');
      jQuery('#selectionChamp select').removeClass('showSearch');
      setupLightbox();
    });

    jQuery('#selectionChamp select').on('change', function() {
      debug('Change: #selectionCamp select');
      jQuery('.cards').removeClass('addMarker');
      jQuery(this).addClass('active');
      var group = this.value;
      jQuery('#cards').data("group",group);
      jQuery('figure').removeClass('active');
      currentSearch = 'figure[data-folder="' + group + '"]';
      searchName = ''; 
      jQuery(currentSearch + searchModifier + searchName).addClass('active');
      jQuery('#search').val('');
      
      jQuery('#selectionChamp select').removeClass('showSearch');
      setupLightbox();
       
    });

    /* ---------------------------------------------- */
    /* Admin only events                              */
    /* On change and on click events                  */
    /* ---------------------------------------------- */

    var admin = jQuery('#cards').hasClass('canEdit');
    if (admin) {

      jQuery("#displayType").change(function(event) {
        debug('Change: #displayType');
        searchModifier = jQuery(this).find(":selected").val();
        jQuery('figure').removeClass('active');
        jQuery(currentSearch + searchModifier + searchName).addClass('active');
        setupLightbox();
      })

      jQuery("#doRefresh").click(function(event) {
        debug('Click: #doRefresh');
        event.preventDefault();
        jQuery('figure').removeClass('active');
        jQuery(currentSearch + searchModifier + searchName).addClass('active');
        jQuery(this).hide();
        setupLightbox();
      })

      jQuery(".imageGalleryCheck").off().click(function(e) {
        debug('Click: .imageGalleryCheck');
        // e.preventDefault();
        var key = jQuery(this).closest('figure').data('key');
        currentKey = key;
        var checkbox = jQuery(this).closest('figure').find('.imageGalleryCheck input').is(':checked')
        var oldrow = rows[key];
        var newrow = rows[key].slice(); // make a separate clone 
        if (checkbox) {
          newrow[4] = 'Y';
        }
        else {
          newrow[4] = 'N';
        }
        saveDataRow('SAVEROW', key, newrow, baseURI); 
      })

      // The cursor gets into the image area
    jQuery("#cards.canEdit figure a img").mouseenter(function(){
        jQuery("div.imageGalleryCheck").hide();
        jQuery(this).closest('figure').find("div.imageGalleryCheck").show();
    });

    jQuery("#cards.canEdit").mouseleave(function(){
        jQuery("div.imageGalleryCheck").hide();
    });
/*
      jQuery("#cards.canEdit figure a img").hover(function(){
        debug('Hover: #cards canEdit figure a img');
        jQuery(this).closest('figure').find("div.imageGalleryCheck").show();
        }, function(){
        jQuery(this).closest('figure').find("div.imageGalleryCheck").hide();
      });
*/
      jQuery('.captionControl').keypress(function(event) {
        debug('keypress: .captionControl');
        if (event.which == 13) {
          var key = jQuery(this).closest('figure').data('key');
          var chk = 'Y';
          var checkbox = jQuery(this).closest('figure').find('.imageGalleryCheck input').is(':checked');
          if (!checkbox) {chk = 'N';}
          else {chk = 'Y';}
          var newrow = rows[key].slice();
          newrow[4] = chk;
          newrow[5] = jQuery(this).val();
          jQuery(this).closest('figure').attr("data-name", newrow[5]);
          saveDataRow('SAVEROW',key, newrow, baseURI);
          event.preventDefault();
        }
      });

      jQuery('.captionControl').on('change',function() {
        debug('Change: .captionControl');
        var key = jQuery(this).closest('figure').data('key');    
        var chk = 'Y';
        var checkbox = jQuery(this).closest('figure').find('.imageGalleryCheck input').is(':checked');
        if (!checkbox) {chk = 'N';}
        var newrow = rows[key].slice();
        newrow[4] = chk;
        newrow[5] = jQuery(this).val();
        jQuery(this).closest('figure').attr("data-name", newrow[5]);
        saveDataRow('SAVEROW',key, newrow, baseURI);
      })

       jQuery('.titleControl').keypress(function(event) {
        debug('Keypress: .titleControl');
        if (event.which == 13) {
          var key = jQuery(this).data('key');
          var newrow = groupRows[key].slice();
          newrow[5] = jQuery(this).val();
          saveDataRow('SAVETITLE',key, newrow, baseURI);
          groupRows[key] = newrow;
          event.preventDefault();
        }
      });

      jQuery('.titleControl').on('change',function() {
        debug('Change: .titleControl');
          var key = jQuery(this).data('key');
          var newrow = groupRows[key].slice();
          newrow[5] = jQuery(this).val();
          saveDataRow('SAVETITLE',key, newrow, baseURI);
          groupRows[key] = newrow;
          event.preventDefault();
      });

      jQuery('#doReconcile').off().click(function(event) {
        debug('Click: #doReconcile');
        console.log('doReconcile ' + baseURI);
        //saveDataRow('RECONCILE','', [], baseURI);
      });
    }
      
  })
}