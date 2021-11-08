chrome.tabs.query({'active': true}, function (tabs) {
  attemptSave(tabs);
  $('#loginform').submit(function(event) {
    event.preventDefault();
    var i = event.target.querySelector("#loginidentifier").value;
    var p = event.target.querySelector("#loginpassword").value;
    $.ajax({
      type : 'POST',
      url : 'http://localhost:3001/api/users/sign_in',
      data : {
        identifier: i,
        password: p
      },
      dataType: 'json',
      success: function(data) {
        chrome.storage.local.set({'token_id': data.auth_token}, function() {
          $('#unsuccessfuldiv').hide();
          $('#logindiv').hide();
          attemptSave(tabs);
        })
      },
      error: function(data) {
        $('#unsuccessfuldiv').show();
      }
    });
    
  });
  $('#settingslink').click(function(event) {
    $('#settingslink').hide();
    $('#logoutcontainer').show();
    //alert('settings');
  });
  $('#logoutform').submit(function(event) {
    event.preventDefault();
    chrome.storage.local.clear(function() {
      $('#settingslink').hide();
      $('#tryingdiv').hide();
      $('#unsuccessfuldiv').hide();
      $('#successdiv').hide();
      $('#logindiv').show();
    })
  });
  $('#closeform').submit(function(event) {
    event.preventDefault();
    window.close();
  });
});

function attemptSave(tabs) {
  $('#tryingdiv').show();
  chrome.storage.local.get("token_id", function (data) {
    if (data["token_id"]) {
      selectedVar = data["token_id"];
      var url = tabs[0].url;
      var title = tabs[0].title;
      
      $.ajax({
        type : 'POST',
        url : 'http://localhost:3001/api/resources',
        headers : {
          Authorization: "Bearer " + selectedVar
        },
        data : {
          url: url,
          usage: title
        },
        dataType: 'json',
        success: function(data) {
          $('#settingslink').show();
          $('#tryingdiv').hide();
          $('#successdiv').show();
        },
        error: function(data) {
          $('#settingslink').hide();
          $('#tryingdiv').hide();
          $('#logindiv').show();
        }
      });
    } else {
      $('#settingslink').hide();
      $('#tryingdiv').hide();
      $('#logindiv').show();
    }
  });
}
