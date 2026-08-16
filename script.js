const $ = (s, c = document) => c.querySelector(s),
  $$ = (s, c = document) => [...c.querySelectorAll(s)];
const header = $("#header"),
  menuBtn = $(".menu-toggle"),
  nav = $(".main-nav"),
  backTop = $(".back-top");
const closeMenu = () => {
  nav.classList.remove("open");
  menuBtn.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.setAttribute("aria-label", "Open navigation");
  document.body.classList.remove("menu-open");
};
menuBtn.addEventListener("click", () => {
  const open = !nav.classList.contains("open");
  nav.classList.toggle("open", open);
  menuBtn.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute(
    "aria-label",
    open ? "Close navigation" : "Open navigation",
  );
  document.body.classList.toggle("menu-open", open);
});
$$(".main-nav a").forEach((a) => a.addEventListener("click", closeMenu));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", scrollY > 70);
  backTop.classList.toggle("show", scrollY > 650);
});
backTop.addEventListener("click", () =>
  scrollTo({ top: 0, behavior: "smooth" }),
);
const sections = $$("main section[id]"),
  links = $$(".main-nav a");
const setActive = () => {
  let current = "home";
  sections.forEach((s) => {
    if (scrollY >= s.offsetTop - 180) current = s.id;
  });
  links.forEach((a) =>
    a.classList.toggle("active", a.getAttribute("href") === "#" + current),
  );
};
addEventListener("scroll", setActive);
const revealObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        revealObserver.unobserve(e.target);
      }
    }),
  { threshold: 0.12 },
);
$$(".reveal").forEach((el) => revealObserver.observe(el));

$$(".filter").forEach((btn) =>
  btn.addEventListener("click", () => {
    $$(".filter").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    $$(".tour-card").forEach((card) =>
      card.classList.toggle(
        "hidden",
        filter !== "all" && card.dataset.category !== filter,
      ),
    );
  }),
);

const modal = $("#contentModal"),
  modalContent = $("#modalContent"),
  modalClose = $(".modal-close");
let modalTrigger;
function openModal(html, trigger) {
  modalTrigger = trigger;
  modalContent.innerHTML = html;
  modal.showModal();
  modalClose.focus();
}
function closeModal() {
  modal.close();
  modalTrigger?.focus();
}
modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
modal.addEventListener("cancel", (e) => {
  e.preventDefault();
  closeModal();
});
const routeMap = {
  "Essential Sri Lanka": [
    "Colombo arrival and coastal rest",
    "Sigiriya rock fortress and village lunch",
    "Dambulla and Kandy traditions",
    "Tea country train to Ella",
    "Little Adam’s Peak and local cooking",
    "Galle Fort and the southern coast",
  ],
  "Wildlife & Wilderness": [
    "Colombo arrival",
    "Wilpattu safari",
    "Sigiriya and Minneriya",
    "Gal Oya boat safari",
    "Hill-country nature walk",
    "Yala safari",
    "Southern coast wind-down",
  ],
  "Highlands to Coast": [
    "Kandy and cultural evening",
    "Tea-country rail journey",
    "Ella trails and waterfalls",
    "Udawalawe elephant country",
    "Mirissa beach time",
    "Galle Fort finale",
  ],
  "Romantic Ceylon": [
    "Private Colombo welcome",
    "Kandy heritage stay",
    "Hatton tea bungalow",
    "Ella scenic rail",
    "Tangalle hideaway",
    "Sunset in Galle",
  ],
};
$$(".itinerary-btn").forEach((btn) =>
  btn.addEventListener("click", () => {
    const name = btn.dataset.tour;
    openModal(
      `<p class="eyebrow">Sample journey</p><h2>${name}</h2><p>Every itinerary is flexible. Here is a taste of how your days might unfold.</p><div class="itinerary-days">${routeMap[name].map((d, i) => `<div><b>Day ${i + 1}</b> — ${d}</div>`).join("")}</div><button class="btn modal-plan" style="margin-top:22px">Customise this tour</button>`,
      btn,
    );
    $(".modal-plan", modal).addEventListener("click", () => {
      closeModal();
      prefillTour(name);
    });
  }),
);
$(".open-story").addEventListener("click", (e) =>
  openModal(
    `<p class="eyebrow">People behind your journey</p><h2>Local insight, personal care.</h2><h3>Anjali Perera — Senior Travel Designer</h3><p>Anjali turns traveller wish-lists into beautifully paced routes, balancing Sri Lanka's icons with quiet discoveries.</p><h3>Dinesh Fernando — Operations Manager</h3><p>Dinesh keeps every detail moving smoothly, from trusted guides to last-minute changes on the road.</p><h3>Kavindu Silva — Senior Driver-Guide</h3><p>Kavindu brings history, humour and a genuine love of his island to every mile.</p>`,
    e.currentTarget,
  ),
);
$$(".policy-btn").forEach((btn) =>
  btn.addEventListener("click", () =>
    openModal(
      `<p class="eyebrow">Serendib Trails</p><h2>${btn.dataset.policy}</h2><p>This demonstration website respects visitor privacy and does not transmit form data to a server. In a production website, this page would explain data collection, booking terms, cancellation conditions and responsible-travel commitments in full.</p><p>For assessment purposes, all business details, reviews and offers shown here are fictional.</p>`,
      btn,
    ),
  ),
);

function prefillTour(name) {
  const form = $("#inquiryForm");
  form.elements.tour.value = name;
  $("#plan").scrollIntoView({ behavior: "smooth" });
  setTimeout(() => form.elements.name.focus(), 600);
}
$("#tripFinder").addEventListener("submit", (e) => {
  e.preventDefault();
  const fields = [
    $("#finderMonth"),
    $("#finderDuration"),
    $("#finderGuests"),
    $("#finderInterest"),
  ];
  const invalid = fields.find((f) => !f.value);
  if (invalid) {
    invalid.focus();
    invalid.reportValidity();
    return;
  }
  const form = $("#inquiryForm");
  form.elements.month.value = $("#finderMonth").value;
  form.elements.duration.value = $("#finderDuration").value;
  form.elements.travellers.value = $("#finderGuests").value;
  form.elements.message.value = `Main interest: ${$("#finderInterest").value}`;
  $("#plan").scrollIntoView({ behavior: "smooth" });
});

const planData = {
  interests: [],
  duration: "",
  style: "",
  month: "",
  guests: "",
};
let planStep = 1;
$$(".choices.multi button").forEach((b) =>
  b.addEventListener("click", () => {
    b.classList.toggle("selected");
    planData.interests = $$(".choices.multi button.selected").map(
      (x) => x.textContent,
    );
    $('.plan-step[data-step="1"] .next-step').disabled =
      !planData.interests.length;
  }),
);
$$(".choices.single").forEach((group) =>
  $$("button", group).forEach((b) =>
    b.addEventListener("click", () => {
      $$("button", group).forEach((x) => x.classList.remove("selected"));
      b.classList.add("selected");
      const step = +b.closest(".plan-step").dataset.step;
      if (step === 2) planData.duration = b.textContent;
      if (step === 3) planData.style = b.textContent;
      $(".next-step", b.closest(".plan-step")).disabled = false;
    }),
  ),
);
$$(".next-step").forEach((btn) =>
  btn.addEventListener("click", () => {
    planStep++;
    $$(".plan-step").forEach((s) =>
      s.classList.toggle("active", +s.dataset.step === planStep),
    );
    $$(".planner-progress span").forEach((s, i) =>
      s.classList.toggle("active", i < planStep),
    );
  }),
);
$("#completePlan").addEventListener("click", () => {
  planData.month = $("#planMonth").value;
  planData.guests = $("#planGuests").value;
  const f = $("#inquiryForm");
  f.elements.month.value = planData.month;
  f.elements.duration.value = planData.duration;
  f.elements.travellers.value = planData.guests;
  f.elements.message.value = `Interests: ${planData.interests.join(", ")}\nTravel style: ${planData.style}`;
  $("#plan").scrollIntoView({ behavior: "smooth" });
});

$$(".faq-item>button").forEach((btn) =>
  btn.addEventListener("click", () => {
    const item = btn.parentElement,
      open = item.classList.contains("open");
    $$(".faq-item").forEach((i) => {
      i.classList.remove("open");
      $("button", i).setAttribute("aria-expanded", "false");
    });
    if (!open) {
      item.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
    }
  }),
);

let reviewIndex = 0;
const slides = $$(".review-slide"),
  dots = $$(".review-dots button");
function showReview(i) {
  reviewIndex = (i + slides.length) % slides.length;
  slides.forEach((s, n) => s.classList.toggle("active", n === reviewIndex));
  dots.forEach((d, n) => d.classList.toggle("active", n === reviewIndex));
}
$("#nextReview").addEventListener("click", () => showReview(reviewIndex + 1));
$("#prevReview").addEventListener("click", () => showReview(reviewIndex - 1));
dots.forEach((d) =>
  d.addEventListener("click", () => showReview(+d.dataset.slide)),
);

$("#inquiryForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.currentTarget,
    status = $(".form-status", form);
  status.textContent = "";
  if (!form.checkValidity()) {
    form.reportValidity();
    const first = $$("[required]", form).find((x) => !x.validity.valid);
    first?.focus();
    status.textContent = "Please complete the highlighted required fields.";
    return;
  }
  const data = new FormData(form);
  const message = [
    "NEW SERENDIB TRAILS INQUIRY",
    "",
    `Name: ${data.get("name")}`,
    `Email: ${data.get("email")}`,
    `Phone / WhatsApp: ${data.get("phone")}`,
    `Travel month: ${data.get("month")}`,
    `Trip duration: ${data.get("duration")}`,
    `Travellers: ${data.get("travellers")}`,
    `Preferred journey: ${data.get("tour")}`,
    `Trip ideas: ${data.get("message") || "Not specified"}`,
  ].join("\n");
  const whatsappUrl = `https://wa.me/94770582630?text=${encodeURIComponent(message)}`;
  status.textContent =
    "Your inquiry is ready. WhatsApp is opening—tap Send to deliver it to our travel designer.";
  status.style.color = "#123d35";
  const opened = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  if (!opened) window.location.href = whatsappUrl;
});
$("#newsletter").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = $("#newsletterEmail");
  if (!email.checkValidity()) {
    email.reportValidity();
    return;
  }
  $("#newsletterStatus").textContent =
    "Thank you. Your email has been added to this website demonstration.";
  e.currentTarget.reset();
});
$("#year").textContent = new Date().getFullYear();
// Chat Box එක විවෘත කිරීම සහ වැසීම[cite: 5]
function toggleChat() {
  const chatBox = document.getElementById("ai-chat-box");
  if (chatBox) {
    chatBox.style.display = chatBox.style.display === "none" ? "block" : "none";
  }
}

// Enter බොත්තම එබූ විට පණිවිඩය යැවීමට[cite: 5]
function handleKeyPress(event) {
  if (event.key === "Enter") {
    sendToGemini();
  }
}

// Gemini වෙත පණිවිඩය යැවීම සහ පිළිතුරු ලබා ගැනීම[cite: 5]
async function sendToGemini() {
  const inputField = document.getElementById("ai-user-input");
  const messagesDiv = document.getElementById("ai-chat-messages");
  if (!inputField || !messagesDiv) return;

  const userText = inputField.value.trim();
  if (!userText) return;

  // පාරිභෝගිකයාගේ පණිවිඩය චැට් එකට එකතු කිරීම[cite: 5]
  messagesDiv.innerHTML += `<div style="background: #123d35; color: white; padding: 8px 12px; border-radius: 8px; max-width: 80%; align-self: flex-end; margin-left: auto;">${userText}</div>`;
  inputField.value = "";
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  // Loading සටහන[cite: 5]
  const loadingId = "loading-" + Date.now();
  messagesDiv.innerHTML += `<div id="${loadingId}" style="background: #e2e8f0; padding: 8px 12px; border-radius: 8px; max-width: 80%;">Thinking...</div>`;
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  const apiKey = "AQ.Ab8RN6Kj6DCr81hl3IztNVHvQnPYzCrWZD9WFu5NMEYxL3Tqeg"; // මෙතනට ඔබේ Google AI Studio API Key එක දාන්න[cite: 5]
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text:
                  "You are a friendly and helpful travel assistant for 'Serendib Trails', a private Sri Lankan travel agency. Answer this customer's question concisely: " +
                  userText,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    const reply = data.candidates[0].content.parts[0].text;

    // Loading ඉවත් කර AI ප්‍රතිචාරය පෙන්වීම[cite: 5]
    document.getElementById(loadingId).remove();
    messagesDiv.innerHTML += `<div style="background: #e2e8f0; color: #333; padding: 8px 12px; border-radius: 8px; max-width: 80%;">${reply}</div>`;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  } catch (error) {
    const loadingElem = document.getElementById(loadingId);
    if (loadingElem) loadingElem.remove();
    messagesDiv.innerHTML += `<div style="background: #fee2e2; color: #991b1b; padding: 8px 12px; border-radius: 8px; max-width: 80%;">Sorry, I'm having trouble connecting right now.</div>`;
  }
}
