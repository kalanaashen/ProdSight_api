const API_URL =
"http://localhost:5000/api/webusage";


const TOKEN =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2YTExOGQ5NDYxNjg0NDJhNjFkNzM4OWYiLCJpYXQiOjE3Nzk2MDA1NzV9.Q0Km34fag-4_jn3U_CIyZmUg8zZ4SoxZULRDNyVtiok";

let activeTabStart =
Date.now();

let previousTab = null;


function extractDomain(url) {

    try {

        return new URL(url)
            .hostname;

    } catch {

        return "unknown";

    }

}


chrome.tabs.onActivated
.addListener(async (activeInfo) => {

    const tab =
        await chrome.tabs.get(
            activeInfo.tabId
        );

    processTab(tab);

});


chrome.tabs.onUpdated
.addListener((tabId,
              changeInfo,
              tab) => {

    if (
        changeInfo.status ===
        "complete"
    ) {

        processTab(tab);

    }

});


async function processTab(tab) {

    if (
        !tab.url ||
        !tab.title
    ) return;

    const now = Date.now();

    if (previousTab) {

        const duration =
            Math.floor(

                (now -
                 activeTabStart)

                / 1000

            );

        const data = {

            domain:
                extractDomain(
                    previousTab.url
                ),

            url:
                previousTab.url,

            title:
                previousTab.title,

            duration:
                duration

        };

        console.log(data);

        sendWebUsage(data);

    }

    previousTab = tab;

    activeTabStart = now;

}


async function sendWebUsage(
    data
) {

    try {

        const response =
            await fetch(

                API_URL,

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "x-auth-token":
                            TOKEN

                    },

                    body:
                        JSON.stringify(data)

                }

            );

        console.log(
            await response.text()
        );

    } catch (error) {

        console.error(error);

    }

}