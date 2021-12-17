(async function () {
  let alternateAudioURL,
    chunks = [],
    mediaRecorder,
    state = "initial";
  const loopCheckbox = document.getElementById("loop");
  const outputAudio = document.getElementById("output") as HTMLAudioElement;
  const ratesFieldset = document.getElementById("rates");
  const ratesRadios = document.querySelectorAll("[name='rate']");
  const recordButton = document.getElementById("record");

  function getAudioURLFromChunks(chunks) {
    return window.URL.createObjectURL(
      new Blob(chunks, { type: "audio/ogg; codecs=opus" })
    );
  }

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log("getUserMedia supported.");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
    } catch (err) {
      console.log("The following getUserMedia error occurred: " + err);
    }
  } else {
    console.log("getUserMedia not supported on your browser!");
  }

  mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
  mediaRecorder.onstop = (_) => {
    outputAudio.src = getAudioURLFromChunks(chunks);
    outputAudio.play();
    chunks = [];
  };

  loopCheckbox.addEventListener("change", (e) => {
    outputAudio.loop = e.target.checked;
  });

  ratesFieldset.addEventListener("click", (e) => {
    if (e.target.name === "rate") {
      outputAudio.playbackRate = e.target.value;
      ratesRadios.forEach((radio) => {
        radio.setAttribute("checked", e.target.value === radio.value);
      });
      e.stopPropagation();
    }
  });

  recordButton.addEventListener("click", (event) => {
    if (state === "initial") {
      mediaRecorder.start();
      state = "recording";
    } else if (state === "recording") {
      mediaRecorder.stop();
      state = "initial";
    }
    document.body.dataset.state = state;
  });
})();
