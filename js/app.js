function handleError(error) {
  if (error) {
    alert(error.message);
  }
}

function initializeSession() {
  var session = OT.initSession(apiKey, sessionId);

  // Create a publisher // takes the div element with the specified id  - in this case 'publisher'.
  // also specifies the properties of the element.
  var publisher = OT.initPublisher('publisher', {
    insertMode: 'append',
    width: '100%',
    height: '100%'
  }, handleError);
  // publisher object will show video in the div now, but it is not connected or published until they are done below.

  // this will create a publisher object for screen-share
  // var screenShare = OT.initPublisher('screen-share', {
  //   videoSource: 'screen',
  //   insertMode: 'append',
  //   width: '100%',
  //   height: '100%'
  // }, handleError);

  // Connect to the session
  session.connect(token, function(error) {
    // If the connection is successful, publish to the session
    if (error) {
      handleError(error);
    } else {
      // publisher is published only when below is done with session.publish
      session.publish(publisher, handleError);
      session.publish(screenShare, handleError);
    }
  });

  // Listen for the event when stream is created, and run the call back function.
  session.on('streamCreated', function(event) {
    console.log('stream created!');
    // Subscribe to a newly created stream
    // and append the stream object to the div with the id called 'subscriber'
    const uniqueId = Math.random();
    const subscriberId =  "subscriber"+uniqueId;

    const cardElement = document.createElement("div");
    cardElement.setAttribute("class", 'card');
    cardElement.innerHTML = `Subscriber: ${uniqueId}`;
    const element = document.createElement("div");
    element.setAttribute("id", subscriberId);
    element.setAttribute("class", 'subscriber');
    cardElement.appendChild(element);

    document.getElementById('subscribers').appendChild(cardElement);
    session.subscribe(event.stream, subscriberId, {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    }, handleError);
  });
}

// fetch openTok details
fetch(server_base_url + '/session').then(function(res) {
  return res.json()
}).then(function(res) {
  apiKey = res.apiKey;
  sessionId = res.sessionId;
  token = res.token;
  initializeSession();
}).catch(handleError);

