import { createContext, useEffect, useState,useRef } from "react";
import {useRouter} from 'next/router'
import Pusher, { Members, PresenceChannel } from "pusher-js";

 let Pushercontext = createContext()

export function Pusherprovider(props){
  
    const [username, setusername] = useState('');
    const [roomName, setRoomName] = useState('');
    const [notify, setnotify] = useState([]);
    const [newmsg, setnewmsg] = useState([]);
    const [friendemail, setfriendemail] = useState('');

    const pusherRef = useRef();
    const channelRef = useRef();
    async function initiatchange(){
        await fetch(`/api/mongochange`)
    }
    
    useEffect(()=>{
        
        if(username){
            initiatchange()
            pusherRef.current = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
                authEndpoint: "/api/pusher/auth",
                auth: {
                  params: { username: username },
                },
                cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
                });
                
                
               channelRef.current = pusherRef.current.subscribe('chat',);
           
               channelRef.current.bind('newNotify',(doc)=>{
                    listennotify(doc)
               });
            //    channelRef.current.bind('newIncommingMessage',(doc)=>{
            //        listennewmsg(doc)
            //    });
               console.log(channelRef.current)
        }
    },[username])

    // function listennewmsg(doc){
    //     if(doc.users.includes(friendemail)){
    //         setnewmsg(showmassage(doc.massages))
    //     }
    // }

    async function listennotify(doc){
        let notify = doc
        
        if(friendemail){
            console.log(friendemail)
          notify = doc.filter(item => item.email !== friendemail  );
          if(doc.find(item=>item.email == friendemail )){

          
           const res = await fetch(`/api/getmassage`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },body:JSON.stringify({
                user:username,
                friend:friendemail
      
            })
      
          })
           let data = await res.json()
           console.log(data.massages)
           setnewmsg(data.massages)
           }
        }
        console.log(notify)
        setnotify(notify)
    }

    console.log(notify)
    //console.log(newmsg)
   
    return (
        <Pushercontext.Provider value={{
                                    setusername,
                                    setfriendemail,
                                    notify,
                                    newmsg
                                     }}>
            {props.children}
        </Pushercontext.Provider>
    )

}

export default Pushercontext;