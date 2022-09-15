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
    $(selectorID).html(testout);  
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
    //admin = true;  // for testing
    var groupkey = groupLabels[groupRows[group][0]]; 
    var groupname = groupRows[groupkey][2];
    if (!admin) {
    tempinfo = `<span class="info-title">(${groupname}) ${infotitle}</span>
          <span class="info-location"></span>
      <span class="info-message">${folderDesc}</span>`;
    }
    else {
      tempinfo = `<span class="info-title"><textarea data-key="${groupkey}" 
          rows=3 class="titleControl" style="width:100%;">${infotitle}</textarea></span>
          <span class="info-location"></span>
      <span class="info-message">${folderDesc}</span>`;
    }
    jQuery('#galleryContainer div.info').html(tempinfo);

}

function fillImages(grouping, memberRows) {
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

  //var result = memberRows.filter(checkGroup);
  //function checkGroup(age, group) {
  //  return age[0] == grouping;
  //}

  result = memberRows;

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
        marktemp = marker.split(' ');
        marker = marktemp[0];
        temparr = value[0].split('/');
        templabel = temparr[0] + '/' + temparr[1];
        gclass = (templabel in groupLabels) ? groupLabels[templabel] : '';
        fullimg = `${photoBase}/${value[0]}/${value[2]}`;
        thumbimg = `${photoBase}/${value[0]}/${value[3]}`;
        if (value[2].startsWith('http')) {
          fullimg = value[2];
        }
        if (value[3].startsWith('http') == true) {
          thumbimg = value[3];
        }
        temp += `<figure class="active ${gclass}${distype}" data-key="${key}" data-name="${value[5]}">
             <a href="${fullimg}" >
             <img src="" 
             data-src="${thumbimg}" title="${title}" loading="lazy">
             <div class="marker">${marker}</div></a>
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
  if (typeof simpleGallery == 'object') {
        simpleGallery.refresh();
  }
  else {
    simpleGallery = new SimpleLightbox('.cards figure.active a', {
     showCaptions: true,captionAttribute: 'title'}
     );
  }
  var temp = jQuery('.cards figure.active a img[src=""]');
  jQuery.each(temp, function(index, value) {
    jQuery(this).attr('src',jQuery(this).data('src'));
  });
  var showing = 'Showing: ' + jQuery('figure.active').length + ' of ' + jQuery('figure').length;
  jQuery('#showing').text(showing);
  jQuery('#doRefresh').hide(); 
}

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
  
  var dataval = {cmd: cmd, 
  row: newrow, csvURI: csvURI, logURI: logURI,
  baseURI: baseURI,
  action: 'more_post_ajax'};
  var hidden = (newrow[4] == 'Y') ? true : false; 
  jQuery.ajax({
      type: "POST",
      dataType: "html",
      url: the_ajax_script.ajaxurl,
      data: dataval,
      success: function (data) {
        console.log('data=' + data);
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

/* ---------------------------------------------- */
/* Main routine to build a flexbox array of       */
/* photos                                         */
/* ---------------------------------------------- */

function do_photoList(
  selectorID = '#thePhotoGallery', 
  base = 'AAHS_Gallery2',
  theClass = '') {

  if (location.hostname == 'localhost') {
    photoBase = 'http://localhost/' + base;
    csvURI = '/Users/george/Sites/' + base + '/gallery2.csv'; 
    logURI = '/Users/george/Sites/' + base + '/logfile.csv'; 
    baseURI = '/Users/george/Sites/' + base;
  }
  else {
    photoBase = 'https://grcrane2.com/' + base;
    csvURI = '/home2/grcranet/public_html/' + base + '/gallery2.csv'; 
    logURI = '/home2/grcranet/public_html/' + base + '/logfile.csv'; 
    baseURI = '/home2/grcranet/public_html/' + base;
  }

  var folderDate = ''; 
  var folderLoc = '';
  var folderDesc = ''; 
  var tempinfo = ''; 
  var infotitle = ''; 

  var temp = `
  <div id="galleryContainer" class="${theClass}">
  <a id="doReconcile">Reconcile</a>
  <div id="message"></div>
  <div class="info"></div>
  <div id="groupSelector">
    <a href="#" id="prevSelect">Prev</a>
    <div id="selectionChamp" class="custom-select" >
      <select >
      </select>
    </div>
    <a href="#" id="nextSelect">Next</a>
  </div>
  <div id="searchBox">Search: <input id="search" type="text">
    <a href="#" id="clearSearch">Clear</a>
  </div>
  
  <div id="showing"></div>
  <div id="displayType">
    Display Type:<select>
      <option value="">All</option>
      <option value=".show" selected>Active</option>
      <option value=".hidden">Hidden</option>
    </select>
    <a href="#" id="doRefresh">Refresh</a>
  </div>
  <div id="cards" class="cards ${theClass}"></div>
  </div>`;
  jQuery(selectorID).html(temp);

  const d = new Date();
  var time = d.getTime();
  var csvurl = photoBase + '/returndata.php?t=' + time;
  jQuery.get(csvurl, function(data, status){
    memberRows = data[0];
    memberRows.shift(); 
    rows = memberRows;
    groupRows = data[1];
    groupRows.shift();
    groupLabels = [];

    // Sort groups 
    groupRows.sort(function(a,b) {
      var x = a[0].toLowerCase();
      var y = b[0].toLowerCase();
      if (x < y) {return-1;}
      if (x > y) {return 1;}
      return 0; 
    });

    // Save labels 
    groupRows.forEach(function(item,key) {
      groupLabels[item[0]] = key; 
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
    groupRows.forEach(function(item,key) {

      var temp2 = item[0].split('/');
      var level = 'level' + temp2.length;
      if (item[5] != '' && temp2.length < 3) {
       if (prev == '' || prev != item[2]){
        // new group
        if (prev != '') {
          temp += '</optgroup>';
        }
        prev = item[2];
        var gclass = item[2].replace(' ','').toLowerCase(); 
        temp += `<optgroup label="${item[2]}">`;
       }
       temp += `<option class="${level}" value="${key}">${item[1]}</option>`
     }
    })
    temp += '</optgroup>';
    jQuery('#selectionChamp select').html(temp);

    /* -- Kick things off by selecting the first item in dropdown */
    var group = jQuery('#selectionChamp option:first-child').val();
    fillImages(group,memberRows);

    jQuery('#cards').data("group",group);
    jQuery('figure').removeClass('active');
    currentSearch = 'figure.' + group;
    jQuery(currentSearch + searchModifier + searchName).addClass('active');
    fillTitleInfo(group, groupRows, groupLabels); 
    // for testing search 
    //jQuery('span.info-title[data-title*="testing" i]').css('background','red');
    setupLightbox();

    /* ---------------------------------------------- */
    /* Declare events                                 */
    /* for non-admin                                  */
    /* ---------------------------------------------- */

    jQuery('#nextSelect').click(function() {
      var options = jQuery("#selectionChamp option");
      var i = options.index(options.filter(":selected"));
      if (i >= 0 && i < options.length - 1) {
          options.eq(i+1).prop("selected", true).trigger("change");
      }
      else {
        options.eq(0).prop("selected", true).trigger("change");
      }
    })

    jQuery('#prevSelect').click(function() {
      var options = jQuery("#selectionChamp option");
      var i = options.index(options.filter(":selected"));
      if (i >= 0 && i < options.length - 1) {
        options.eq(i-1).prop("selected", true).trigger("change");
      }
      else {
        options.eq(0).prop("selected", true).trigger("change");
      }
    })

    jQuery('#search').on('keyup', function (event) {
      var thevalue = jQuery('#search').val();
      jQuery('figure').removeClass('active');
      jQuery('nav a.set').removeClass('active');
      if (!thevalue) {  
          group =   jQuery('#cards').data('group');
          jQuery('figure.' + group).addClass('active');
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
              }
            }
          })
          jQuery('#selectionChamp select').addClass('showSearch');
        }
      currentSearch = 'figure';
      searchName = str; 
      //console.log(currentSearch + searchModifier + searchName);
      jQuery(currentSearch + searchModifier + searchName).addClass('active');
      setupLightbox();
    });  

    jQuery('#clearSearch').click(function(event) {
      event.preventDefault();
      group =   jQuery('#cards').data('group');
      jQuery('figure').removeClass('active');
      jQuery('nav a[data-group="' + group + '"]').addClass('active');
      searchName = ''
      currentSearch = 'figure.' + group;

      jQuery(currentSearch + searchModifier + searchName).addClass('active');
      jQuery('#cards').removeClass('addMarker');
      jQuery('#search').val('');
      jQuery('#selectionChamp select').removeClass('showSearch');
      setupLightbox();
    });

    jQuery('#selectionChamp select').on('change', function() {
      jQuery('.cards').removeClass('addMarker');
      jQuery(this).addClass('active');
      var group = this.value;
      jQuery('#cards').data("group",group);
      jQuery('figure').removeClass('active');
      currentSearch = 'figure.' + group;
      searchName = ''; 
      jQuery(currentSearch + searchModifier + searchName).addClass('active');
      fillTitleInfo(group, groupRows, groupLabels);
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
        searchModifier = jQuery(this).find(":selected").val();
        jQuery('figure').removeClass('active');
        jQuery(currentSearch + searchModifier + searchName).addClass('active');
        setupLightbox();
      })

      jQuery("#doRefresh").click(function(event) {
        event.preventDefault();
        jQuery('figure').removeClass('active');
        jQuery(currentSearch + searchModifier + searchName).addClass('active');
        jQuery(this).hide();
        setupLightbox();
      })

      jQuery(".imageGalleryCheck").off().click(function(e) {
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
        saveDataRow('SAVEROW', key, newrow); 
      })

      jQuery("#cards.canEdit figure a img").hover(function(){
        jQuery(this).closest('figure').find("div.imageGalleryCheck").show();
        }, function(){
        jQuery(this).closest('figure').find("div.imageGalleryCheck").hide();
      });

      jQuery('.captionControl').keypress(function(event) {
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
          saveDataRow('SAVEROW',key, newrow);
          event.preventDefault();
        }
      });

      jQuery('.captionControl').on('change',function() {
        var key = jQuery(this).closest('figure').data('key');    
        var chk = 'Y';
        var checkbox = jQuery(this).closest('figure').find('.imageGalleryCheck input').is(':checked');
        if (!checkbox) {chk = 'N';}
        var newrow = rows[key].slice();
        newrow[4] = chk;
        newrow[5] = jQuery(this).val();
        jQuery(this).closest('figure').attr("data-name", newrow[5]);
        saveDataRow('SAVEROW',key, newrow);
      })

       jQuery('.titleControl').keypress(function(event) {
        if (event.which == 13) {
          var key = jQuery(this).data('key');
          console.log(groupRows[key]);
          var newrow = groupRows[key].slice();
          newrow[5] = jQuery(this).val();
          saveDataRow('SAVETITLE',key, newrow, baseURI);
          event.preventDefault();
        }
      });

      jQuery('.titleControl').on('change',function() {
          console.log('titlecontrol change');
          var key = jQuery(this).data('key');
          var newrow = groupRows[key].slice();
          newrow[5] = jQuery(this).val();
          saveDataRow('SAVETITLE',key, newrow, baseURI);
          event.preventDefault();
      });

      jQuery('#doReconcile').off().click(function(event) {
        console.log('doReconcile ' + baseURI);
        saveDataRow('RECONCILE','', [], baseURI);
      });
    }
      
  })
}
