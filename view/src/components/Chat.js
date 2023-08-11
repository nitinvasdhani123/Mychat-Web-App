import React, { useState, useEffect } from "react";
import "./Chat.css";
import Image from "./letchat.jpg";
import axios from "axios";
import {useNavigate} from 'react-router-dom'

import io from "socket.io-client";

const socket = io("http://localhost:8080");


function Chat() {
  const [ID1, setID1] = useState("show-user-chat-container");
  const [ID2, setID2] = useState("display");
  const [data, setdata] = useState({});
  const [users, setusers] = useState([]);
  const [user, setuser] = useState({});
  const [message,setmessage] = useState('')
  const [receiverid,setreceiverid] = useState('')
  const [allchats,setallchats] = useState([])
  // const [latestmessage,setlatestmessage] = useState('')
  // const [latestmessagereceiverid,setlatestmessagereceiverid] = useState('')
  // const [latestmessagesenderid,setlatestmessagesenderid] = useState('')
  // const [calllatest,setcalllatest] = useState(0)
  // const [session,setsession] = useState(true)
  const [call,setcall] = useState(0)
  const navigate = useNavigate();

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const changeclass = async(id) => {
    if (ID1 === "show-user-chat-container" && ID2 === "display") {
      setID1("display");
      setID2("show-user-chats");
    } 
    // else {
    //   setID1("show-user-chat-container");
    //   setID2("display");
    // }
    getclickuserdetails(id);
  };

  const getclickuserdetails= async(id)=>{
    try {
      setreceiverid(id)
      const response3 = await axios.get(
        `http://localhost:8080/getuserwhichisclick/${id}`
        );
      setuser(response3.data)
      // getallchats(id)
      setcall(call+1)
    } catch (error) {
      console.log(`Error ${error}`);
    }
  }
  
  useEffect(()=>{
    const getallchats=async(receiver_id)=>{
      try {
        console.log(call)
          if(call !== 0){
            const sender_id = localStorage.getItem('Myid')
            const response5 = await axios.get(`http://localhost:8080/getallconversations/${sender_id}/${receiverid}`);
            setallchats(response5.data)
            // getlatesmessageofparticularuser(receiver_id)
          }
      } catch (error) {
        console.log(`Error ${error}`);
      }
    }
    getallchats()
  },[call])


  // useEffect(()=>{
    // const getlatesmessageofparticularuser = async(receiver_id)=>{
    //   const sender_id = localStorage.getItem('Myid')
    //   const response6 = await axios.get(`http://localhost:8080/getlatestconversations/${sender_id}/${receiver_id}`);
    //   setlatestmessage(response6.data[0].message)
    //   console.log(response6.data[0].message)
    //   setlatestmessagereceiverid(response6.data[0].receiver_id)
    //   console.log(response6.data[0].receiver_id)
    //   setlatestmessagesenderid(response6.data[0].sender_id)
    //   console.log(response6.data[0].sender_id)
    // }
    // getlatesmessageofparticularuser()
  // },[calllatest])

    
    

  useEffect(() => {
    async function getdata() {
      try {
        const Token = localStorage.getItem("token");
        const response1 = await axios.get(
          `http://localhost:8080/getloginuser/${Token}`
        );
        setdata(response1.data);
        const response2 = await axios.get(
          `http://localhost:8080/getallusersexceptloginuser/${Token}`
        );
        setusers(response2.data);
      } catch (error) {
        console.log(`Error ${error}`);
      }
    }
    getdata();
  }, []);

  const logout =()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("Myid");
    sessionStorage.removeItem("Myid");
    // setsession(false)
    navigate('/Login');
  }

  const sendmessagetodatabase=async()=>{
    console.log(message)
    try {
      const response4 = await axios.post(
        `http://localhost:8080/addconversations`,{
          sender_id:localStorage.getItem('Myid'),
          receiver_id:receiverid,
          message : message
        }
      );
      // console.log(response4.data)
      setmessage('')
      sendMessage()
      setcall(call+1)
      // setcalllatest(calllatest+1)
    } catch (error) {
      console.log(`Error ${error}`);
    }
  }


  // Function to send a message to the server via Socket.io
  const sendMessage = () => {
    // socket.emit("message", {
    //   sender_id: localStorage.getItem("Myid"),
    //   receiver_id: receiverid,
    //   message: message,
    // });

    // const now = new Date();
    // const hour = now.getHours().toString().padStart(2, '0');
    // const minute = now.getMinutes().toString().padStart(2, '0');

    // const messageObject = {
    //   sender_id: localStorage.getItem("Myid"),
    //   receiver_id: receiverid,
    //   message: message,
    //   timestamp: `${hour}:${minute}`
    // };

    // socket.emit("message", messageObject);

    const timestamp = new Date().toISOString();

    socket.emit("message", {
      sender_id: localStorage.getItem("Myid"),
      receiver_id: receiverid,
      message: message,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  };

  // Function to update the 'allchats' state with new messages
  const handleIncomingMessage = (messageData) => {
    // Update 'allchats' state with the new message data
    // console.log(messageData)
    setallchats((prevChats) => [...prevChats, messageData]);
    // console.log("latest messages are : ",allchats)
  };

  // useEffect to handle incoming messages from the server
  useEffect(() => {
    // Listen for incoming messages from the server
    socket.on("message", handleIncomingMessage);

    // Emit an event to join the room
    socket.emit("joinRoom", receiverid);
    
    // Cleanup the event listener on component unmount
    return () => {
      socket.off("message");
    };
  }, []);


  return (
    <div id="main-container">

      <div id="show-user-container">
        <div className="my-profile">
          <img src={data.pic} alt="error" />
          <p>{data.name}</p>
          <button onClick={logout}><i className="fa-solid fa-right-from-bracket"></i></button>
        </div>
        <div className="users-profile">
          {
            users.map((users,index)=>{
              // const isLatestMessageReceiver = user._id === latestmessagereceiverid || user._id === latestmessagesenderid;
              // console.log(isLatestMessageReceiver)
              return(
                    <div className="one-user-profile" onClick={()=>{changeclass(users._id)}} key={index}>
                      <img src={users.pic} alt="error"/>
                        <div>
                          <p>{users.name}</p>
                          {/* {isLatestMessageReceiver && (
                            <p>{latestmessage}</p>
                          )} */}
                        </div>
                    </div>
                )
            })
          }
        </div>
      </div>

      <div id={ID2}>

        <div className="top">
          <img src={user.pic} alt="error" />
          <div>
            <p>{user.name}</p>
          </div>
        </div>

        <div className="middle">
          {
            allchats.map((chat,index)=>{
              // const messageDate = new Date(chat.createdAt);
              // const formattedTime = `${messageDate.getHours()}:${messageDate.getMinutes()}`;
              const formattedTime = formatTime(chat.createdAt);
              if (localStorage.getItem('Myid') === chat.sender_id) {
                return (<div className="my-message" key={index}>{chat.message}<span>{formattedTime}</span></div>);
              }
              else{
                return (<div className="user-message" key={index}>{chat.message}<span>{formattedTime}</span></div>);
              }
          })
        }
        </div>

        <div className="end">
          <input type="text" placeholder="Enter Your Message Here !!!!" onChange={(event)=>{setmessage(event.target.value)}} value={message}></input>
          <button onClick={sendmessagetodatabase}>Send</button>
        </div>
      </div>

      <div id={ID1}>
        <img src={Image} alt="error"></img>
        <h1>My Chat</h1>
        <p>LET'S TALK TOGETHER !</p>
      </div>

    </div>
  );
}

export default Chat;
