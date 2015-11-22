// DOM받아와서 변수선언
var chatbot = io.connect('http://93.188.161.83:5000/chatbot');

var Stream = null;
var peerConnection = null;
var localVideo = null;
var remoteVideo = null;
var hangupButton = document.getElementById("hangupButton");

// hangupButton.disabled = true;
// hangupButton.onclick = hangup;

chatbot.on('systemMsg', function (participant, msg) {
	start();
	console.log(msg);
});

chatbot.on('offer', function(desc) {
	peerConnection.setRemoteDescription(new RTCSessionDescription(desc));
	peerConnection.createAnswer(function (desc) {
		trace("send answering to server");
		peerConnection.setLocalDescription(desc);
		chatbot.emit('description', desc);
	}, function(error) {
		alert("createAnswer Err : " + error);
	});
});

chatbot.on('hangup', function() {
	trace("hangup from server");
	peerConnection.close();
	peerConnection = null;
});

chatbot.on('answer', function (desc) {
	trace("receive answer from server");
	peerConnection.setRemoteDescription(new RTCSessionDescription(desc));
});

chatbot.on('candidateFromServer', function (candidate) {
	trace("candidate From Server");
	peerConnection.addIceCandidate(new RTCIceCandidate({
		sdpMLineIndex: candidate.sdpMLineIndex,
		candidate: candidate.candidate
	}));
});

function initialize() {
	trace("initialize");
	trace("Requesting local stream");
	// 해당 컴퓨터의 video와 audio stream을 받아온다.
	// 성공했을 때 gotStream 함수가 callback으로 호출된다.
	localVideo = document.getElementById("localVideo");
	remoteVideo = document.getElementById("remoteVideo");
	getUserMedia({ audio:true, video:true }, gotStream, function(error) {
		trace("getUserMedia error: ", error);
	});
}

function start() {
	peerConnection.createOffer(function (desc) {
		trace("Offer from peerConnection");
		peerConnection.setLocalDescription(desc);
		chatbot.emit('description', desc);
	}, handleError);
}

// getUserMedia함수를 호출했을 때 성공하면 실행되는 callback함수
function gotStream(stream){
	trace("Received local stream");

	// 해당 stream을 html의 localVideo에 연결해준다.
	localVideo.src = URL.createObjectURL(stream);

	// Stream변수에 받아온 stream을 assign
	Stream = stream;

	var servers = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
	// 여기서 servers는 configuration
	peerConnection = new RTCPeerConnection(servers);
	
	trace("Created local peer connection object peerConnection");
	peerConnection.onicecandidate = gotLocalIceCandidate;
	peerConnection.onaddstream = onaddstream;
	peerConnection.addStream(Stream);
}

function onaddstream(event) {
	if (!event) return;
	remoteVideo.src = URL.createObjectURL(event.stream);
}

function gotLocalIceCandidate(event){
	if (event.candidate) {
		trace("Local ICE candidate: \n" + event.candidate.candidate);
		chatbot.emit('candidate', event.candidate);
	}
}

function handleError(){

}

function hangup() {
	trace("Ending call");
	chatbot.emit('hangupToServer');
	peerConnection.close();
	peerConnection = null;
}
// function gotLocalDescription(desc){
// 	peerConnection.setLocalDescription(desc);
// 	trace("Offer from peerConnection: \\n" + desc.sdp);
// 	remotePeerConnection.setRemoteDescription(desc);
// 	remotePeerConnection.createAnswer(gotRemoteDescription,handleError);
// }
