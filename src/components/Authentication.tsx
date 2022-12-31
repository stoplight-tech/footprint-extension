import { useState, useEffect } from 'react'

import Account from './Accounts'

import { Session } from "@supabase/gotrue-js/src/lib/types"

import { supabase } from '../utils/supabaseClient'

import Cookies from 'universal-cookie';
const cookies = new Cookies();


export function Authentication() {
    const [email, setEmail] = useState(''); // email of the user
    const [password, setPassword] = useState(''); // password of the user
    const [username, setUsername] = useState(''); // username of the user
    const [Rmsg, setRMsg] = useState(''); // Registration message
    const [Lmsg, setLMsg] = useState(''); // Login message
    const [user, setUser] = useState(''); // User object after registration / login
    const [session, setSession] = useState<Session>(); // session object after registration / login

    useEffect(() => {
      const fetchData = async () => {
        const {data: data} = await supabase.auth.getSession()
        return data.session
      }
      
      fetchData().then((session: any) => {
        
        if (session) {
          setSession(session)
        }
      })
      
    }, [])

    const Register = async () => {
        const {data, error} = await supabase.auth.signUp({
          email,
          password,
        })
        if(error){
          setRMsg(error.message)
        }else{
          setRMsg('User created successfully')
            setUser(data.user as any)
        }
      }
      const Login = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if(error){
          setLMsg(error.message)
        }else{
          setLMsg('Login successfully')
          setUser(data.user as any)
          setSession(data.session as any)
          await chrome.storage.session.set(
            {session: JSON.stringify(data.session)})
        }
      }
    return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
  {!session ?  
      <div>
        <div className="App">
          <h1>Register User</h1>
          email:<input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" /><br/>
          Password:<input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Enter your Password" /><br/>
          username:<input type="text" onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" /><br/>
          <button onClick={Register}>Register</button><br/>
          <p>{Rmsg}</p>
        </div>
        <div>
          <h1>Login</h1>
          email:<input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" /><br/>      Password:<input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Enter your Password" /><br/>
          <button onClick={Login}>Login</button><br/>
          <p>{Lmsg}</p>
      </div> 
    </div>
          : 
          <div>
          <Account key={session.user.id} session={session} />       
          <button type="button" className="button block" onClick={async () => {
            await supabase.auth.signOut()
            setSession(undefined)
            await chrome.storage.session.set(
              {session: null})
            
            }}>
            Sign Out
          </button>
          </div>}
          
    </div>
     

      );
}