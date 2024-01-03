
  /* 
  Authcode - functions used to edit and maintain photogallery
  George Crane, 1/3/2024
  */
  
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
    console.log(ret);
    $('#accountMsg').html(ret.message);
    if (ret.status == 'success' ) {
      $('#accountMsg').css('color','green');
      $('#container, #galleryContainer').removeClass('noedit');
      $('#container, #galleryContainer').addClass('canEdit');
      $('#container, #galleryContainer').removeClass('login');
      $('#logoutEmail').html('(' + ret.email + ') ');
      //$('#addButton').css('display','block');
      $('#inputPass').val('')
      //$('#container #loginForm').removeClass('login');
      //document.cookie = "login=" + ret.email + "; SameSite=Lax; max-age=" + 5*60 + "; path=/;";
    }
    else {
      $('#accountMsg').css('color','red');
      //document.cookie = "login=None; SameSite=Lax; max-age=0; path=/;";
    }
    sendPostMessage();
  }

  function onLogoutSuccess(ret) {
    console.log(ret);
    $('#accountMsg').html(ret.message);
    if (ret.status == 'success' ) {
      $('#container, #galleryContainer').removeClass('canEdit');
      $('#container, #galleryContainer').addClass('noedit');
      $('#container').removeClass('forgot');
      $('#container').removeClass('login');
      $('#accountMsg').css('color','green');
    }
    else {
      $('#accountMsg').css('color','red');
    }
    sendPostMessage();
  }
/* looks the same
  function onLogoutSuccess(ret) {
    console.log(ret);
    $('#accountMsg').html(ret.message);
    if (ret.status == 'success' ) {
      $('#container').addClass('noedit');
      $('#container').removeClass('forgot');
      $('#container').removeClass('login');
      $('#accountMsg').css('color','green');
    }
    else {
      $('#accountMsg').css('color','red');
    }
    sendPostMessage();
  }
*/
  function setAdminStatus(status = 'canEdit') {

    jQuery("body.canEdit #displayType").off(); 
    jQuery("body.canEdit #doRefresh").off();
     jQuery("body.canEdit .imageGalleryCheck").off();
     jQuery("body.canEdit #cards.canEdit figure a img").off();
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
          saveDataRow('SAVEROW', key, oldrow, newrow); 
        })

        jQuery("body.canEdit #cards.canEdit figure a img").hover(function(){
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
            saveDataRow('SAVEROW',key, oldrow, newrow);
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
          saveDataRow('SAVEROW',key, oldrow, newrow);
        })

        jQuery('body.canEdit .titleControl').keypress(function(event) {
          debug('Keypress: .titleControl');
          if (event.which == 13) {
            var key = jQuery(this).data('key');
            var oldrow = groupRows[key];
            var newrow = groupRows[key].slice();
            newrow[5] = jQuery(this).val();
            saveDataRow('SAVETITLE',key, oldrow, newrow);
            groupRows[key] = newrow;
            event.preventDefault();
          }
        });

        jQuery('body.canEdit .titleControl').on('change',function() {
          debug('Change: .titleControl');
            var key = jQuery(this).data('key');
            var oldrow = groupRows[key];
            var newrow = groupRows[key].slice();
            newrow[5] = jQuery(this).val();
            saveDataRow('SAVETITLE',key, oldrow, newrow);
            groupRows[key] = newrow;
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

    $(editHtml).insertBefore(selectorID);
    
    $('#container').css('display','block'); 
    $('#loading').css('display','none');
    $("#container").css('visibility','visible');
    $('#menu').hide();
    //$('#accountMsg').hide();


    $('#account #forgot').click(function(event) {
        event.preventDefault();
        $('#accountMsg').html('');
        $('#container').addClass('forgot');
        $('#container').removeClass('login');
        sendPostMessage();
    });
    $('#account #loginLink a').click(function(event) {
        event.preventDefault();
        $('#container').removeClass('forgot');
        $('#container').addClass('login');
        $('#accountMsg').html('Enter you login credentials');
        $('#accountMsg').css('color','green');
        sendPostMessage();
    });

    $('#account #logoutLink a').click(function(event) {
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

    $('#account #loginLink a').click(function(event) {
        event.preventDefault();
        $('#container').removeClass('forgot');
        $('#container').addClass('login');
        $('#accountMsg').html('Enter you login credentials');
        $('#accountMsg').css('color','green');
        sendPostMessage();
    });
  }