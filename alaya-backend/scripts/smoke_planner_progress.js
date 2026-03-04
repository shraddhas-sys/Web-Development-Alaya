const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const TOKEN = process.env.TOKEN;
const USER_ID = process.env.USER_ID;

if (!TOKEN || !USER_ID) {
  console.error("Missing env. Required: TOKEN, USER_ID. Optional: BASE_URL");
  process.exit(1);
}

const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${TOKEN}`
};

const fetchJson = async (path, opts = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...opts,
    headers: { ...headers, ...(opts.headers || {}) }
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
};

const assert = (cond, msg) => {
  if (!cond) {
    console.error(` FAIL: ${msg}`);
    process.exit(1);
  }
  console.log(` ${msg}`);
};

(async () => {
  console.log("\n--- Alaya smoke test: Planner → Complete → Dashboard progress ---\n");

  const today = new Date().toISOString().split('T')[0];
  const yogaType = "Vinyasa";

  // 1) Create plan
  const created = await fetchJson(`/api/plans/add`, {
    method: "POST",
    body: JSON.stringify({ userId: Number(USER_ID), date: today, yogaType, duration: 30, notes: "smoke test" })
  });
  assert(created.ok && created.data?.success, "Create plan (planned) works");
  const planId = created.data.data.id;
  assert(created.data.data.status === "planned", "New plan is stored as status=planned");

  // 2) Ensure it appears in plans list
  const plans = await fetchJson(`/api/plans/all/${USER_ID}`, { method: "GET" });
  assert(plans.ok && plans.data?.success, "Fetch plans works");
  const found = (plans.data.data || []).find(p => String(p.id) === String(planId));
  assert(!!found, "Created plan is retrievable");
  assert(String(found.status) === "planned", "Created plan stays planned before completion");

  // 3) Complete the plan
  const completed = await fetchJson(`/api/plans/${planId}/complete`, { method: "PATCH" });
  assert(completed.ok && completed.data?.success, "Complete plan endpoint works");
  assert(completed.data.data?.plan?.status === "completed", "Plan status becomes completed");
  assert(!!completed.data.data?.session?.id, "Completing a plan creates a completed session record");
  assert(String(completed.data.data.session.sourcePlanId) === String(planId), "Session stores sourcePlanId");

  // 4) Sessions list contains the created session
  const sessions = await fetchJson(`/api/sessions/all/${USER_ID}`, { method: "GET" });
  assert(sessions.ok && sessions.data?.success, "Fetch sessions works");
  const hasSession = (sessions.data.data || []).some(s => String(s.sourcePlanId) === String(planId));
  assert(hasSession, "Session list includes the completion from the plan");

  // 5) Notifications created
  const notifs = await fetchJson(`/api/notifications/me`, { method: "GET" });
  assert(notifs.ok && notifs.data?.success, "Fetch notifications works");
  const notifMsgs = (notifs.data.data || []).map(n => n.message || "");
  assert(notifMsgs.some(m => m.includes("Planned:")), "Planner notification exists (Planned)");
  assert(notifMsgs.some(m => m.includes("Completed:")) || notifMsgs.some(m => m.includes("Logged:")), "Completion notification exists");

  console.log("\n ALL CHECKS PASSED\n");
  process.exit(0);
})().catch((e) => {
  console.error("ERROR:", e);
  process.exit(1);
});
