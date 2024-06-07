import React, { useRef, useState, useEffect } from "react";
import Peer from "peerjs";
import styles from "./style.module.css";
import { v4 as uuidv4 } from "uuid";

const TempVideoPage = () => {

  const [peerId, setPeerId] = useState("");
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerInstance = useRef(null);

  useEffect(() => {
    const peer = new Peer(undefined, {
      host: process.env.REACT_APP_PEER_HOST,
      port: process.env.REACT_APP_PEER_PORT,
      path: '/peerjs',
      secure: process.env.REACT_APP_PEER_SECURE === "true",
      debug: 3,
    });

    peer.on("open", (id) => {
      setPeerId(id);
      console.log("akash", id);
    });
  },[])

  useEffect(() => {  
    const userId = uuidv4();
    console.log("userId", userId);
    const peer = new Peer(userId);
    console.log("peer", peer);
    setPeerId(userId);
    peerRef.current = peer;

    peer.on("call", (call) => {
      console.log("call connected");
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
          localVideoRef.current.srcObject = stream;
          call.answer(stream); // Answer the call with an A/V stream.
          call.on("stream", (remoteStream) => {
            console.log(remoteStream);
            remoteVideoRef.current.srcObject = remoteStream;
          });
        }).catch((err) => {
          if(err.name === "NotFoundError"){
            const emptyStream = new MediaStream();
            localVideoRef.current.srcObject = emptyStream;
            call.answer(emptyStream);
            call.on("stream", (remoteStream) => {
              console.log(remoteStream);
              remoteVideoRef.current.srcObject = remoteStream;
            });
          }
        })
    });

    return () => {
      peer.disconnect();
    }
  }, []);

  const setPeer = () => {
    const peer = new Peer(peerId);
    peerRef.current = peer;
    console.log("peer changed", peer);
  }

  const startCall = () => {
    console.log("call started");
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        localVideoRef.current.srcObject = stream;
        const call = peerRef.current.call(remotePeerId, stream);
        call.on("stream", (remoteStream) => {
          console.log(remoteStream);
          remoteVideoRef.current.srcObject = remoteStream;
        });
      }).catch((err) => {
        if(err.name === "NotFoundError"){
          const emptyStream = new MediaStream();
          localVideoRef.current.srcObject = emptyStream;
          const call = peerRef.current.call(remotePeerId, emptyStream);
          call.on("stream", (remoteStream) => {
            console.log(remoteStream);
            remoteVideoRef.current.srcObject = remoteStream;
          });
        }
      })
  }


  return (
    <div>
      <h1>Video Chat</h1>
      <div>
        <input
          type="text"
          placeholder="This device Peer ID"
          value={peerId}
          onChange={(e) => setPeerId(e.target.value)}
        />
        <button onClick={setPeer}>Change peerId</button> 
      </div>

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
