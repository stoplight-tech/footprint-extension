// This file is ran as a background script

console.log("Hello from background script!")

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
    //Make api request to add to Total
    console.log('hi')
})

chrome.webRequest.onCompleted.addListener(async (details) => {
    let { currentSessionBytes } = await chrome.storage.session.get(['currentSessionBytes'])
    console.log(currentSessionBytes)
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