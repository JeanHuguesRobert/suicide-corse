(function () {
  var STORAGE_KEY = "suicide-corse-guide-conversation";
  var GUIDE_BASE = document.body.getAttribute("data-guide-base") || "https://cogentia.fractavolta.com";
  var RECIPIENTS = {
    "submit-testimony": "institutmariani@gmail.com",
    "report-correction": "institutmariani@gmail.com",
    "technical-report": "jhr@baronsmariani.org",
    "pilot-contact": "jhr@baronsmariani.org",
  };

  var log = document.getElementById("log");
  var form = document.getElementById("ask");
  var question = document.getElementById("question");
  var draftTo = document.getElementById("draft-to");
  var draftSubject = document.getElementById("draft-subject");
  var draftBody = document.getElementById("draft-body");
  var status = document.getElementById("draft-status");
  var turns = loadTurns();

  render();

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    ask(question.value);
  });
  document.getElementById("prepare-testimony").addEventListener("click", function () {
    prepare("submit-testimony");
  });
  document.getElementById("prepare-correction").addEventListener("click", function () {
    prepare("report-correction");
  });
  document.getElementById("copy-draft").addEventListener("click", copyDraft);

  function ask(text) {
    var clean = String(text || "").trim();
    if (!clean) return;
    var history = turns.slice();
    turns.push({ role: "user", content: clean });
    saveTurns();
    render();
    question.value = "";
    status.textContent = "Le Guide réfléchit. Rien n'est envoyé.";
    postJson("/guide/chat", {
      profile: "suicide-corse",
      locale: "fr",
      question: clean,
      history: history,
    }).then(function (body) {
      var answer = body && body.answer ? String(body.answer) : "Le Guide n'a pas fourni de réponse. Rien n'a été envoyé.";
      turns.push({ role: "assistant", content: answer });
      saveTurns();
      render();
      status.textContent = "Réponse affichée. Ce n'est pas un témoignage, et rien n'a été envoyé.";
    }).catch(function () {
      status.textContent = "Le Guide n'a pas répondu. Aucun message n'a été envoyé.";
    });
  }

  function prepare(act) {
    draftTo.value = RECIPIENTS[act] || "";
    status.textContent = "Préparation du brouillon. Rien n'est envoyé.";
    var latestUser = lastUserText();
    postJson("/guide/prepare-act", {
      profile: "suicide-corse",
      act: act,
      locale: "fr",
      context: latestUser,
      history: turns,
    }).then(function (body) {
      var draft = body && body.prepared_act;
      if (!draft || draft.executed !== false) {
        status.textContent = "Préparation refusée. Rien n'a été envoyé.";
        return;
      }
      draftTo.value = draft.to || draftTo.value;
      draftSubject.value = draft.subject || "";
      draftBody.value = draft.body || "";
      status.textContent = "Brouillon — non envoyé. Vous pouvez le modifier et le copier.";
    }).catch(function () {
      status.textContent = "Le brouillon n'a pas pu être préparé. Rien n'a été envoyé.";
    });
  }

  function copyDraft() {
    var text = [
      "Brouillon — non envoyé",
      "Destinataire : " + draftTo.value,
      "Objet : " + draftSubject.value,
      "",
      draftBody.value,
    ].join("\n");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        status.textContent = "Brouillon copié. Rien n'a été envoyé.";
      }).catch(selectDraft);
      return;
    }
    selectDraft();
  }

  function selectDraft() {
    draftBody.focus();
    draftBody.select();
    status.textContent = "Copie automatique indisponible. Le texte est sélectionné. Rien n'a été envoyé.";
  }

  function postJson(route, payload) {
    return fetch(GUIDE_BASE + route, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    }).then(function (response) {
      if (!response.ok) throw new Error("guide_http_" + response.status);
      return response.json();
    });
  }

  function loadTurns() {
    try {
      var parsed = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]");
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(isTurn).slice(-16);
    } catch (error) {
      return [];
    }
  }

  function saveTurns() {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(turns.slice(-16)));
  }

  function render() {
    log.replaceChildren();
    turns.forEach(function (turn) {
      var item = document.createElement("div");
      item.className = "turn";
      var who = document.createElement("div");
      who.className = "who";
      who.textContent = turn.role === "assistant" ? "Guide" : "Vous";
      var body = document.createElement("p");
      body.textContent = turn.content;
      item.append(who, body);
      log.append(item);
    });
  }

  function lastUserText() {
    for (var i = turns.length - 1; i >= 0; i -= 1) {
      if (turns[i].role === "user" && turns[i].content) return turns[i].content;
    }
    return "";
  }

  function isTurn(item) {
    return item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string";
  }
}());
