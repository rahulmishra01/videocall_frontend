import React, { useRef, useState, useEffect } from "react";
import Peer from "peerjs";
import styles from "./style.module.css";
import { v4 as uuidv4 } from "uuid";

const TempVideoPage = () => {

  const [peerId, setPeerId] = useState("");
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerRef = useRef();
  const [remotePeerId, setRemotePeerId] = useState("");

  useEffect(() => {  
    const userId = uuidv4();
    const peer = new Peer(userId);
    setPeerId(userId);
    peerRef.current = peer;

    peer.on("call", (call) => {
      navigator.mediaDevices.getUserMedia(
        { video: true, audio: true },
        (stream) => {
          localVideoRef.current.srcObject = stream;
          call.answer(stream); // Answer the call with an A/V stream.
          call.on("stream", (remoteStream) => {
            // Show stream in some <video> element.
            remoteVideoRef.current.srcObject = remoteStream;
          });
        },
        (err) => {
          console.error("Failed to get local stream", err);
        },
      );
    });


  }, []);

  const startCall = () => {
    navigator.mediaDevices.getUserMedia(
      { video: true, audio: true },
      (stream) => {
        localVideoRef.current.srcObject = stream;
        const call = peerRef.current.call(remotePeerId, stream);
        call.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
        });
      },
      (err) => {
        console.error("Failed to get local stream", err);
      },
    );
  }


  return (
    <div>
      <h1>Video Chat</h1>
      <video
        ref={localVideoRef}
        className={styles.video}
        autoPlay
        playsInline
      ></video>
      <video
        ref={remoteVideoRef}
        className={styles.video}
        autoPlay
        playsInline
      ></video>
      <p>this devices peerId : {peerId} </p>{" "}
      <button onClick={() => navigator.clipboard.writeText(peerId)}>
        Copy
      </button>
      <div>
        <input
          type="text"
          placeholder="Remote Peer ID"
          value={remotePeerId}
          onChange={(e) => setRemotePeerId(e.target.value)}
        />
        <button onClick={startCall}>Start Call</button> 
      </div>
      {/* <div>
        {incomingCall && (
            <button
              onClick={answerCall}
              className="bg-green-500 text-white p-2 rounded"
            >
              Answer Call
            </button>
        )}
        {call && (
          <button
            onClick={endCall}
            className="bg-red-500 text-white p-2 rounded"
          >
            End Call
          </button>
        )}
      </div> */}
    </div>
  );
};

export default TempVideoPage;
