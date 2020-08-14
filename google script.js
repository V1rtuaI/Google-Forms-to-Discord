const POST_URL = "WEBHOOK URL";
const EMBED_TITLE = "TOP TEXT CHANGE THIS IN SCRIPT";
const EMBED_FOOTER_TEXT = "BOTTOM TEXT CHANGE THIS IN SCRIPT";
const SUBMITTED_TIMESTAMP = true; // set to false to disable showing the timestamp of the response submission
const FORM_LINK_AS_URL = false; // set to true to set the URL for the embed to the form response
const MESSAGE = ""; // set an additional message to be sent in the webhook (ex: a role ping)

const onSubmit = e => {
    const form = FormApp.getActiveForm();
    const allResponses = form.getResponses();
    const latestResponse = allResponses[allResponses.length - 1];
    const response = latestResponse.getItemResponses();
    const items = [];

    for (let i = 0; i < response.length; i++) {
        const question = response[i].getItem().getTitle();
        const answer = response[i].getResponse();
        let parts;

        try {
            parts = answer.match(/[\s\S]{1,1024}/g) || [];
        } catch (e) {
            parts = answer;
        }

        if (answer === "") continue;

        items.push({
            "name": question,
            "value": parts.join(', '),
            "inline": false
        });
    }

    const embed = {
        "title": EMBED_TITLE,
        "url": FORM_LINK_AS_URL ? latestResponse.getEditResponseUrl() : null,
        "fields": items,
        "timestamp": SUBMITTED_TIMESTAMP ? latestResponse.getTimestamp() : null,
        "footer": {
            "text": SUBMITTED_TIMESTAMP ? "Submitted on" : EMBED_FOOTER_TEXT
        }
    };

    const options = {
        "method": "post",
        "headers": {
            "Content-Type": "application/json",
        },
        "payload": JSON.stringify({
            "content": MESSAGE ? message : null, // This is not an empty string if not used
            "embeds": [embed]
        })
    };

    UrlFetchApp.fetch(POST_URL, options);
};
