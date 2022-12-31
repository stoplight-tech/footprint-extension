// This file is ran as a background script

import { createClient } from '@supabase/supabase-js'




chrome.windows.onCreated.addListener(async () => {
    await chrome.storage.session.set({currentSessionBytes: 0, currentSessionCo2: 0})
  })

chrome.tabs.onCreated.addListener(async() => {
    const { currentSessionBytes, currentSessionCo2 } = await chrome.storage.session.get(['currentSessionBytes', 'currentSessionCo2'])
    if (currentSessionBytes === undefined || currentSessionCo2 === undefined) {
        await chrome.storage.session.set({currentSessionBytes: 0, currentSessionCo2: 0})
    }

})
const byteToKwhconversion = (numberOfBytes: number) => {
    return numberOfBytes * 0.000000000224;
  }
  
  const kwhToCo2Conversion = (kwh: number) => {
    return kwh *  0.386;
  }


chrome.windows.onRemoved.addListener(async function(windowid) {
    const {session} = await chrome.storage.session.get(['session'])

    const parsedSession = JSON.parse(session)

    const user = parsedSession.user

    const { currentSessionBytes } = await chrome.storage.session.get(['currentSessionBytes'])


    const supabase = createClient(process.env.REACT_APP_SUPABASE_URL as string, process.env.REACT_APP_SUPABASE_ANON_KEY as string, {global: { headers: {
        Authorization: `Bearer ${parsedSession.access_token}`
      }}})

    const { data, error }: {data: any, error: any} = await supabase
    .from('total_bytes')
    .select()
    .eq('user_id', user.id)
    let total_bytes = currentSessionBytes ? currentSessionBytes : 0
    if (data && data[0] && data[0].total_bytes) {
        total_bytes = data.total_bytes + total_bytes
    }

    const res = await supabase
    .from('total_bytes')
    .upsert({ user_id: user.id, total_bytes: total_bytes },{ onConflict: 'user_id' })
    .select()

    
    console.log('Closing window now')
})

chrome.webRequest.onCompleted.addListener(async (details) => {
    let { currentSessionBytes } = await chrome.storage.session.get(['currentSessionBytes'])
    const responseHeaders = details.responseHeaders;
    let bytesSent = 0;
    if (responseHeaders) {    
        responseHeaders.map( async (responseHeader) => {
            if (responseHeader.name === "content-length" || responseHeader.name === "Content-Length") {
                bytesSent += parseFloat(responseHeader.value as string);

        }
    
    });}
    const newSessionTotal = currentSessionBytes + bytesSent
    await chrome.storage.session.set({currentSessionBytes: newSessionTotal})
    await chrome.storage.session.set({currentSessionCo2: kwhToCo2Conversion(byteToKwhconversion(newSessionTotal))})
}, { urls: ["<all_urls>"] }, ["responseHeaders"])