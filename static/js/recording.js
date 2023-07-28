"use strict";

document.addEventListener("DOMContentLoaded", () => {
	const startRecording = document.querySelector("#start-recording");
	const stopRecording = document.querySelector("#stop-recording");
	const recordStatus = document.querySelector("#record-status");

	let recorder;
	let chunks = [];

	startRecording.addEventListener("click", () => {
		navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
			recorder = new MediaRecorder(stream);
			recorder.start();
			recordStatus.innerHTML = "Recording...";
			startRecording.disabled = true;
			stopRecording.disabled = false;
			chunks = [];
			recorder.addEventListener("dataavailable", (event) => {
				chunks.push(event.data);
			});
			recorder.addEventListener("stop", () => {
				recordStatus.innerHTML = "";
				const audioBlob = new Blob(chunks);
				sendAudioData(audioBlob);
			});
		});
	});

	stopRecording.addEventListener("click", () => {
		recorder.stop();
		recordStatus.innerHTML = "Finishing...";
		startRecording.disabled = false;
		stopRecording.disabled = true;
		const mediaStream = recorder.stream;
		mediaStream.getTracks().forEach((track) => track.stop());
	});

	function sendAudioData(audioBlob) {
		const formdata = new FormData();
		formdata.append("audio", audioBlob, "recording.wav");
		fetch("/audio", {
			method: "POST",
			body: formdata,
			mode: "no-cors",
		});
	}
});
