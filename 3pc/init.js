var refreshBtn = document.getElementById("refreshButton");
var voidBtn = document.getElementById("voidButton");

window.onload = async function () {
  var token = "";

  if (!!window.location.hash) {
    token = window.location.hash.slice(1).split("&")[0].split("=")[1];
    window.sessionStorage.setItem("app-dsat", token);
    window.location.hash = "";
  }

  token = window.sessionStorage.getItem("app-dsat");

  var greeting = "";
  var message = "";
  var envelopeVoided = false;

  var dsStatus = document.getElementById("docusign-status");
  var dsFrame = document.getElementById("docusign-iframe");

  var currPath = window.location.pathname;
  var currHost = window.location.hostname;
  var currProt = window.location.protocol;

  message = `Connect your demo account <a href='https://account-d.docusign.com/oauth/auth?response_type=token&scope=signature cors&client_id=ac4f43c8-49ef-4665-ae45-978983eea3b7&redirect_uri=${currProt}//${currHost}${currPath}'>here</a>`;

  if (!!token) {
    await docusign.auth(token).config({ debug: true });

    userData = await docusign.userinfo();

    let { given_name } = userData;

    message = `Thank you, ${given_name}. You're good to go!`;

    let { account_id, base_uri } = userData.accounts.find(
      (account) => (account.is_default = true)
    );

    docusign.config({
      accountId: account_id,
      baseUrl: base_uri,
    });

    let envelope = await docusign.create("envelopes");

    let { envelopeId } = envelope;

    let { url } = await docusign.envelope(envelopeId).view("sender");

    dsFrame.src = url;

    refreshBtn.addEventListener("click", async () => {
      if (!envelopeVoided) {
        console.log("Voiding envelope...");
        await docusign.envelope(envelopeId).void();
      }

      console.log("Refreshing page...");
      location.reload();
    });

    voidBtn.addEventListener("click", async () => {
      console.log("Voiding envelope...");
      await docusign.envelope(envelopeId).void();
      envelopeVoided = true;
      voidBtn.disabled = true;
      voidBtn.innerHTML = "<h2>Envelope voided. Please refresh page.<h2>"

    });
  }

  dsStatus.innerHTML = message;
};
