 /* 
  Authcode - functions used to edit and maintain photogallery
  George Crane, 1/3/2024
  */

/* ----------------------------------------------------------- */
/* SAVE data changes back to spreadsheet                       */
/* ----------------------------------------------------------- */  

function onSaveSuccess(ret) {
  console.log('onSaveSuccess return');
  console.log(ret); 
}

function saveDataRow(cmd, key, oldrow, newrow, rows) {
  isEqual = JSON.stringify(oldrow) === JSON.stringify(newrow);
  if (isEqual) {console.log('Equal - nothing to update'); return newrow;}
  console.log('Rows are different, needs updating');

  var what = ''; 
  if (cmd == 'SAVEROW') {
    $('figure[data-key="' + key + '"] div.capValue').text(newrow[5]);
    what = 'Gallery';
  }
  if (cmd == 'SAVETITLE') {
    what = 'Folders';
    $('#galleryData div.theTitle').text(newrow[5]);
  }
  
  if (what != '') {
  google.script.run
        .withSuccessHandler(onSaveSuccess)
        .updateRow(key, what ,oldrow, newrow);
  }
  return newrow;
}
  
  function onForgotSuccess(ret) {
    console.log(ret);
    $('#accountMsg').html(ret.message);
    if (ret.status == 'success' ) {
      $('#accountMsg').css('color','green');
    }
    else {
      $('#accountMsg').css('color','red');
    }
    sendPostMessage();
  }


  function onLoginSuccess(ret) {
    console.log('entry onLoginSuccess');
    console.log(ret);
    $('#accountMsg').html(ret.message);
    if (ret.status == 'success' ) {
      $('#accountMsg').css('color','green');
      $('#container, #galleryContainer').removeClass('login');
      $('#logoutEmail').html('(' + ret.email + ') ');
      //$('#addButton').css('display','block');
      $('#inputPass').val('')
      $('#enableEdit').css('display','inline-block'); 
      $('#container, #galleryContainer').addClass('canEdit');
      $('#container, #galleryContainer').removeClass('noedit');
      $('#myLoginModal').hide();
      $('#loginLink').hide();
      $('#logoutLink').show(); 
      setAdminStatus('noEdit');
      loggedIn = false;
    }
    else {
      $('#accountMsg').css('color','red');
    }
    
    sendPostMessage();
  }

  function onLogoutSuccess(ret) {
    console.log('entry onLogoutSuccess');
    console.log(ret);
    $('#accountMsg').html(ret.message);
    if (ret.status == 'success' ) {
      $('#container, #galleryContainer').removeClass('canEdit');
      $('#container, #galleryContainer').addClass('noedit');
      $('#container').removeClass('forgot');
      $('#container').removeClass('login');
      $('#accountMsg').css('color','green');
      $('#loginLink').show();
      $('#logoutLink').hide(); 
      loggedIn = false;

    }
    else {
      $('#accountMsg').css('color','red');
    }
    $('#enableEdit').hide(); 
    setAdminStatus('noEdit');
    sendPostMessage();
  }


  function setAdminStatus(status = 'canEdit') {
    console.log('entry SetAdminStatus status=' + status);

    jQuery("body.canEdit #displayType").off(); 
    jQuery("body.canEdit #doRefresh").off();
     jQuery("body.canEdit .imageGalleryCheck").off();
     jQuery("body.canEdit figure a img").off();
     jQuery('body.canEdit .captionControl').off();
     jQuery('body.canEdit .titleControl').off();
     jQuery('body.canEdit #doReconcile').off();
     $('body').removeClass('canEdit');
     $('#loginBtn').text('Login');
     jQuery('textarea.captionControl').hide();
     jQuery('div.capValue').show();
     jQuery('#galleryData div.theTitle').show();
     jQuery('#infoForm').hide();

    if (status == 'canEdit') {

      jQuery('body').addClass('canEdit');
      jQuery('#loginBtn').text('Logoff');
      jQuery('textarea.captionControl').show();
      jQuery('div.capValue').hide();
      jQuery('#galleryData div.theTitle').hide();
      jQuery('#infoForm').show();


      jQuery("body.canEdit #displayType").change(function(event) {
          debug('Change: #displayType');
          searchModifier = jQuery(this).find(":selected").val();
          jQuery('figure').removeClass('active');
          jQuery(currentSearch + searchModifier + searchName).addClass('active');
          console.log('calling setupLightbox2 point 11');
          setupLightbox2();
        })

        jQuery("body.canEdit #doRefresh").click(function(event) {
          debug('Click: #doRefresh');
          event.preventDefault();
          jQuery('figure').removeClass('active');
          jQuery(currentSearch + searchModifier + searchName).addClass('active');
          jQuery(this).hide();
          console.log('calling setupLightbox2 point 12');
          setupLightbox2();
        })

        jQuery("body.canEdit .imageGalleryCheck").click(function(e) {
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
          rows[key] = saveDataRow('SAVEROW', key, oldrow, newrow, rows); 
        })

        jQuery("body.canEdit figure a img").hover(function(){
          debug('Hover: #cards canEdit figure a img');
          jQuery(this).closest('figure').find("div.imageGalleryCheck").show();
          }, function(){
          jQuery(this).closest('figure').find("div.imageGalleryCheck").hide();
        });

        jQuery('body.canEdit .captionControl').keypress(function(event) {
          debug('keypress: .captionControl');
          if (event.which == 13) {
            var key = jQuery(this).closest('figure').data('key');
            var chk = 'Y';
            var checkbox = jQuery(this).closest('figure').find('.imageGalleryCheck input').is(':checked');
            if (!checkbox) {chk = 'N';}
            else {chk = 'Y';}
            var oldrow = rows[key];
            var newrow = rows[key].slice(); // make a separate clone 
            newrow[4] = chk;
            newrow[5] = jQuery(this).val();
            jQuery(this).closest('figure').attr("data-name", newrow[5]);
            rows[key] = saveDataRow('SAVEROW',key, oldrow, newrow, rows);
            event.preventDefault();
          }
        });

        jQuery('body.canEdit .captionControl').on('change',function() {
          debug('Change: .captionControl');
          var key = jQuery(this).closest('figure').data('key');    
          var chk = 'Y';
          var checkbox = jQuery(this).closest('figure').find('.imageGalleryCheck input').is(':checked');
          if (!checkbox) {chk = 'N';}
          var oldrow = rows[key];
          var newrow = rows[key].slice(); // make a separate clone 
          newrow[4] = chk;
          newrow[5] = jQuery(this).val();
          jQuery(this).closest('figure').attr("data-name", newrow[5]);
          rows[key] = saveDataRow('SAVEROW',key, oldrow, newrow, rows);
        })

        jQuery('body.canEdit .titleControl').keypress(function(event) {
          debug('Keypress: .titleControl');
          if (event.which == 13) {
            var key = jQuery(this).data('key');
            console.log('key=' + key);
            console.log(folderData);
            var oldrow = folderData[key];
            var newrow = folderData[key].slice();
            newrow[5] = jQuery(this).val();
            folderData[key] = saveDataRow('SAVETITLE',key, oldrow, newrow, rows);
            event.preventDefault();
          }
        });

        jQuery('body.canEdit .titleControl').on('change',function() {
          debug('Change: .titleControl');
            var key = jQuery(this).data('key');
            var oldrow = folderData[key];
            var newrow = folderData[key].slice();
            newrow[5] = jQuery(this).val();
            folderData[key] = saveDataRow('SAVETITLE',key, oldrow, newrow, rows);
            event.preventDefault();
        });

        jQuery('body.canEdit #doReconcile').click(function(event) {
          debug('Click: #doReconcile');
    
        });
    } // if status == canEdit
  }

  function setupForEditing(selectorID) {

    var editHtml = `<div id="container" class="noedit">
        <div id="account">
          <div>
            <span id="accountMsg">Login to edit</span>
            <span id="logoutLink"><span id="logoutEmail"></span><a href="#">Logout</a></span>
            <span id="loginLink"><a href="#">Login</a></span>

            <form id="loginForm">
              Email:&nbsp;<input type=email id="inputEmail" class="input-lg" required>
              Password:&nbsp;<input type=password id="inputPass"  class="input-lg" required>
              <button id="accontSubmit" type="submit">Login</button>
              <div id="forgot"><a href="#">Reset password</a></div>
            </form>

            <form id="keyRequestForm">
              Email:&nbsp;<input type=email id="inputRequestEmail"  class="input-lg" required>
              <button  type="submit">Request activation key</button>
            </form>

            <form id="enterKeyForm">
              Activation key:&nbsp;<input type=text id="inputKeyActivate" class="input-lg"  required>
              New password:&nbsp;<input type=password id="inputKeyPass" class="input-lg"  required>
              <button  type="submit">Save password</button>
            </form>
          </div>
        </div>
        <div id="messageBox"></div>
      </div><!-- end container -->`;

     var editHtml = `<div id="container" class="noedit">
        <div id="account">
          <div>
            <span id="accountMsg">Login to edit</span>
            <span id="logoutLink"><span id="logoutEmail"></span><a href="#">Logout</a></span>
            <span id="loginLink"><a href="#">Login</a></span>
        </div>
        <div id="messageBox"></div>
      </div><!-- end container -->`;


    $(editHtml).insertBefore(selectorID);
    
    $('#container').css('display','block'); 
    $('#loading').css('display','none');
    $("#container").css('visibility','visible');
    $('#menu').hide();
    //$('#accountMsg').hide();


    $('#forgot').click(function(event) {
        event.preventDefault();
        $('#accountMsg').html('');
        $('#container').addClass('forgot');
        $('#container').removeClass('login');
        sendPostMessage();
    });
    $('#loginLink a').click(function(event) {
        event.preventDefault();
        $('#container').removeClass('forgot');
        $('#container').addClass('login');
        $('#accountMsg').html('Enter you login credentials');
        $('#accountMsg').css('color','green');
        $('#myLoginModal').show();
        sendPostMessage();
    });

    $('#logoutLink a').click(function(event) {
        event.preventDefault();
        google.script.run
        .withSuccessHandler(onLogoutSuccess)
        .logOut();
        sendPostMessage();
    });

    $('#account #keyRequestForm').submit(function(event) {
        event.preventDefault();
        var username = $('#inputRequestEmail').val();
        google.script.run
        .withSuccessHandler(onForgotSuccess)
        .sendForgotEmail(username);
        sendPostMessage();
    });

    $('#account #enterKeyForm').submit(function(event) {
        event.preventDefault();
        $('#container').removeClass('forgot');
        $('#container').removeClass('login');
        $('#accountMsg').html('Password reset, thank you');
        $('#accountMsg').css('color','green');
        var key = $('#inputKeyActivate').val(); 
        var pass = $('#inputKeyPass').val();
        google.script.run
        .withSuccessHandler(onLoginSuccess)
        .resetPassword(key, pass);
        sendPostMessage();
    });

    $('#account #loginForm').submit(function(event) {
        event.preventDefault();
        var username = $('#inputEmail').val();
        var password = $('#inputPass').val(); 
        var ret = google.script.run
        .withSuccessHandler(onLoginSuccess)
        .checkLogin(username, password); 
        sendPostMessage();
    });

    $('#loginFormModal').submit(function(event) {
        event.preventDefault();
        var username = $('#loginFormModal #inputEmail').val();
        var password = $('#loginFormModal #inputPass').val(); 
        var ret = google.script.run
        .withSuccessHandler(onLoginSuccess)
        .checkLogin(username, password); 
        sendPostMessage();
    });

  /*  $('#loginLink a').click(function(event) {
        event.preventDefault();
        $('#container').removeClass('forgot');
        $('#container').addClass('login');
        $('#accountMsg').html('Enter you login credentials');
        $('#accountMsg').css('color','green');
        sendPostMessage();
    });
    */
  }
  
  