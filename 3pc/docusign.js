var docusign = {
    accessToken: null,
    accountId: null,
    envelopeId: null,
    baseUrl: null,
    debug: null,
    auth: function (token) {
      this.accessToken = token;
      return this;
    },
    config: function ({ accountId, baseUrl, debug }) {
      this.accountId = accountId ? accountId : this.accountId;
      this.baseUrl = baseUrl ? baseUrl : this.baseUrl;
      this.debug = debug ? debug : this.debug;
      return this;
    },
    envelope: function (envelopeId) {
      this.envelopeId = envelopeId;
      return this;
    },
    debugResult: function (json) {
      console.log(json);
      return this;
    },
    userinfo: async function () {
      let response = await fetch(
        "https://account-d.docusign.com/oauth/userinfo",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      let json = await response.json();

      if (this.debug) this.debugResult(json);

      return json;
    },
    create: async function (path) {
      let response = await fetch(
        `https://demo.docusign.net/restapi/v2.1/accounts/${this.accountId}/${path}`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documents: [
              {
                documentId: 1,
                htmlDefinition: {
                  source: "<html><h2>Probably you are seeing a content here. I hope so.</h2></html>"
                },
                name: "3PC Document Test",
                fileFormat: "html"
              }
            ],
            emailSubject: "Third-Party Cookies (test envelope)",
            status: "created",
          }),
        }
      );

      let json = await response.json();

      if (this.debug) this.debugResult(json);

      return json;
    },
    view: async function (path) {
      let response = await fetch(
        `https://demo.docusign.net/restapi/v2.1/accounts/${this.accountId}/envelopes/${this.envelopeId}/views/${path}`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            returnUrl: "https://httpbin.org/post",
          }),
        }
      );

      let json = await response.json();

      if (this.debug) this.debugResult(json);

      return json;
    },
    void: async function () {
      let response = await fetch(
        `https://demo.docusign.net/restapi/v2.1/accounts/${this.accountId}/envelopes/${this.envelopeId}`,
        {
          method: "PUT",
          mode: "cors",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "voided",
            voidedReason: "Deleting the test envelope after loading it.",
          }),
        }
      );

      let json = await response.json();

      if (this.debug) this.debugResult(json);

      return json;
    },
  };