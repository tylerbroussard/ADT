<html>
  <head>
      <script
      src="https://code.jquery.com/jquery-3.3.1.min.js"
      integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
      crossorigin="anonymous"></script>
      <script src="https://alexgibson.github.io/notify.js/js/notify.js"></script>
      <style type="text/css">
      
      .custom-alert {
        padding: 5px 12px;
        font-size: 3em;
      }
      
      </style>
    <script type="text/javascript">


      var metadata;
      var checkInterval;
      var audioElement;
      /////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////
      // Enter Prompt Name here.
      var promptName = "CallMayBeRecorded";
      var promptId;
      var debug = false;
      /////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////

      $(document).ready(function() {

        ///////////////////////////////////////////////////////////////////////////////////////
        // The following line is the only piece needed to customize in this script
        ///////////////////////////////////////////////////////////////////////////////////////
        //window.parent.$('span:contains("Script")').click();
        setTimeout( notificationWrapper(), 1000);

      });

      function notificationWrapper() {

          // get metadata
          $.when( getMetaData() ).then(
            function(status) {
              ConsoleWrapper("getMetaData:\n" + JSON.stringify(status));

              $.when( getCalls() ).then(
                function(status) {
                  ConsoleWrapper("getCalls:\n" + JSON.stringify(status));
                  if (status && status.length == 1 && status[0]["state"] == "TALKING") {
                    ConsoleWrapper("talking");
                    // check if it's greater than 10 minutes
                    callId = status[0]["id"];
                    $.when( getPrompts(callId)).then(
                      function(status) {
                        ConsoleWrapper("got prompts");
                        var x;
                        for (x in status.skillPrompts) {

                          if (status.skillPrompts[x].name == promptName) {
                            promptId = status.skillPrompts[x].id;
                            
                            playPrompts(callId, promptId);
                          }
                        }
                      }
                    ); // end asynch getPrompts

                  } else {
                    // try again 
                    ConsoleWrapper("state: " + status[0]["state"]);
                    setTimeout( notificationWrapper(), 1000);
                    //NotifyMe("We aren't talking anymore");

                  }
                }  
              ); // end asynchronous getCalls                                    
            }  
          ); // end asynchronous getMetaData()
          
      } // end stop recording wrapper

      function ConsoleWrapper(message) {
        if (debug) {
          console.log("----------------------------------------------");
          console.log(message);
          console.log("----------------------------------------------");
        }
      }

      function getMetaData() {
          var deferred = new $.Deferred();

          $.ajax({
              url: 'https://app.five9.com/appsvcs/rs/svc/auth/metadata',
              dataType: 'json',
              xhrFields: {
                  withCredentials: true
              },
              complete: function(jqXHR, status) {
                  try {
                      var response = JSON.parse(jqXHR.responseText);
                      if (status === 'success') {
                          metadata = response;
                          deferred.resolve(response);
                      } else {
                          deferred.reject(response.five9ExceptionDetail);
                      }
                  } catch(e) {}
              }
          });

          return deferred.promise();
      }

      function getCalls() {
          var deferred = new $.Deferred();

          $.ajax({
              url: 'https://'+metadata.metadata.dataCenters[0].apiUrls[0].host+'/appsvcs/rs/svc/agents/'
              +metadata.userId+'/interactions/calls',
              dataType: 'json',
              xhrFields: {
                  withCredentials: true
              },
              complete: function(jqXHR, status) {
                  try {
                      var response = JSON.parse(jqXHR.responseText);
                      if (status === 'success') {
                          deferred.resolve(response);

                      } else {
                          deferred.reject(response.five9ExceptionDetail);
                      }
                  } catch(e) {}
              }
          });

          return deferred.promise();
      }

      function getPrompts(callId) {
          var deferred = new $.Deferred();

          $.ajax({
              url: 'https://'+metadata.metadata.dataCenters[0].apiUrls[0].host+'/appsvcs/rs/svc/agents/'
              +metadata.userId+'/interactions/calls/'+callId+'/audio',
              dataType: 'json',
              xhrFields: {
                  withCredentials: true
              },
              complete: function(jqXHR, status) {
                  try {
                      var response = JSON.parse(jqXHR.responseText);
                      if (status === 'success') {
                          deferred.resolve(response);

                      } else {
                          deferred.reject(response.five9ExceptionDetail);
                      }
                  } catch(e) {}
              }
          });

          return deferred.promise();
      }

      function playPrompts(callId, promptId) {
          var deferred = new $.Deferred();

          $.ajax({
              url: 'https://'+metadata.metadata.dataCenters[0].apiUrls[0].host+'/appsvcs/rs/svc/agents/'
              +metadata.userId+'/interactions/calls/'+callId+'/audio/player/play_prompt',
              //dataType: 'json',
              processData: false,
              data: JSON.stringify({value: String(promptId) }),
              contentType: "application/json",
              method: 'put',
              xhrFields: {
                  withCredentials: true
              },
              complete: function(jqXHR, status) {
                  try {
                      var response = JSON.parse(jqXHR.responseText);
                      if (status === 'success') {
                          deferred.resolve(response);

                      } else {
                          deferred.reject(response.five9ExceptionDetail);
                      }
                  } catch(e) {}
              }
          });

          return deferred.promise();
      }


    </script>


  </head>
  <body>

    <br>
    <h3>
    <p>Campaign: @Call.campaign_name@ </p>
    <p>Language: @Customer.Language@ </p>
    <p>Skill: @Call.skill_name@ </p>
    <p>ANI: @Call.ANI@ </p>
    <p>DNIS: @Call.DNIS@ </p>
    </h3>
    </br>
    
  </body>
</html>
