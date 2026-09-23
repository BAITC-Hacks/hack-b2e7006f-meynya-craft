// Run with Node after installing dependencies. --live makes two paid AI requests.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Load backend TypeScript without changing Next.js config or emitting build files.
function loader(mockAI) {
  const cache = new Map();
  function load(filename) {
    filename = path.resolve(filename);
    if (mockAI && filename === path.join(root, "lib", "openai.ts")) return mockAI;
    if (cache.has(filename)) return cache.get(filename).exports;
    const loadedModule = { exports: {} };
    cache.set(filename, loadedModule);
    const source = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
      fileName: filename,
    }).outputText;
    const nativeRequire = createRequire(filename);
    const localRequire = (id) => {
      if (id.startsWith("@/")) return load(path.join(root, id.slice(2)) + ".ts");
      if (id.startsWith(".")) return load(path.resolve(path.dirname(filename), id) + ".ts");
      return nativeRequire(id);
    };
    new Function("require", "module", "exports", source)(localRequire, loadedModule, loadedModule.exports);
    return loadedModule.exports;
  }
  return (file) => load(path.join(root, file));
}

function request(body) {
  return new Request("http://localhost/api/test", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
}

async function offline() {
  let reply = "", calls = 0;
  const load = loader({ generateAIText: async () => { calls++; return reply; } });
  const { calculateScore } = load("lib/score.ts");
  const { seedTasks, seedTeams } = load("lib/seed.ts");
  const { createTaskStore, getCatalog, useTaskStore } = load("lib/store.ts");
  const { createTaskDraft } = load("lib/api/tasks.ts");
  const { analyzeTask, buildTaskCard } = load("lib/ai.ts");
  const analyze = load("app/api/analyze/route.ts").POST;
  const cardRoute = load("app/api/card/route.ts").POST;

  assert.equal(seedTasks.length, 8);
  assert.equal(seedTeams.length, 5);
  const proposals = seedTasks.flatMap((task) => task.proposals);
  assert.equal(proposals.length, 8);
  for (const items of [seedTasks, seedTeams, proposals]) assert.equal(new Set(items.map((item) => item.id)).size, items.length);
  assert.ok(proposals.every((proposal) => seedTeams.some((team) => team.name === proposal.team)));
  assert.equal(new Set(seedTasks.map((task) => calculateScore(task).level)).size, 4);
  for (const task of seedTasks) {
    const score = calculateScore(task);
    assert.equal(score.total, task.score);
    assert.equal(score.level, task.level);
    assert.deepEqual(score.categories.map((item) => item.maxScore), [20, 20, 15, 15, 10, 10, 10]);
    assert.equal(score.categories.reduce((sum, item) => sum + item.maxScore, 0), 100);
    assert.equal(score.hints.reduce((sum, hint) => sum + Number(hint.match(/^\+(\d+):/)[1]), 0), 100 - score.total);
    assert.deepEqual(calculateScore(task), score);
  }

  // Exercise both sides of every level boundary with actual field combinations.
  const boundaries = new Map([[0, "Draft"], [39, "Draft"], [40, "Working"], [69, "Working"], [70, "Ready"], [89, "Ready"], [90, "Priority"], [100, "Priority"]]);
  const gradedFields = ["context", "need", "users", "data", "constraints", "expectedResult", "contact", "successCriteria"];
  const texts = ["Не указано", "Кратко", "Подробное описание результата с измеримой целью сократить время до 5 минут."];
  for (let combination = 0; combination < 3 ** gradedFields.length && boundaries.size; combination++) {
    const candidate = { ...seedTasks[0] };
    let remaining = combination;
    for (const field of gradedFields) { candidate[field] = texts[remaining % 3]; remaining = Math.floor(remaining / 3); }
    const score = calculateScore(candidate);
    if (boundaries.has(score.total)) { assert.equal(score.level, boundaries.get(score.total)); boundaries.delete(score.total); }
  }
  assert.equal(boundaries.size, 0, "Every level boundary must be tested");

  const store = createTaskStore(seedTasks);
  assert.equal(getCatalog(store.getState().tasks).length, 6);
  const snapshot = JSON.stringify(seedTasks);
  store.getState().publishTask("task-07");
  store.getState().updateTask("task-07", { users: "Администраторы кофейни, которые принимают и распределяют заказы.", score: 999 });
  const task = store.getState().tasks.find((item) => item.id === "task-07");
  assert.equal(task.score, calculateScore(task).total);
  const proposalId = store.getState().submitProposal(task.id, { team: "Test", idea: "Idea", plan: "Plan", deadline: "2 weeks", link: "" });
  store.getState().acceptProposal(task.id, proposalId);
  assert.equal(store.getState().tasks.find((item) => item.id === task.id).status, "in_progress");
  assert.throws(() => store.getState().rejectProposal(task.id, proposalId));
  assert.equal(JSON.stringify(seedTasks), snapshot);

  await assert.rejects(() => analyzeTask(" "));
  assert.equal(calls, 0);
  reply = "not JSON";
  await assert.rejects(() => analyzeTask("Test task"));
  reply = JSON.stringify({ gaps: [], questions: [{ field: "users", question: "Кто пользователи?" }] });
  await assert.rejects(() => analyzeTask("Test task"));
  reply = JSON.stringify({ gaps: [], questions: [] });
  assert.deepEqual(await analyzeTask("Test task"), { gaps: [], questions: [] });

  const id = seedTasks[0].id;
  const content = Object.fromEntries(Object.entries(seedTasks[0]).filter(
    ([key]) => !["id", "score", "level", "status", "proposals"].includes(key),
  ));
  reply = JSON.stringify(content);
  const built = await buildTaskCard("Test task", []);
  assert.equal(built.status, "draft");
  assert.equal(built.proposals.length, 0);
  assert.notEqual(built.id, id);
  assert.equal(built.score, calculateScore(built).total);
  assert.equal(built.level, calculateScore(built).level);
  const before = calls;
  await assert.rejects(() => buildTaskCard("Test", [{ field: "users", answer: "A" }, { field: "users", answer: "B" }]));
  assert.equal(calls, before);

  const saved = { key: process.env.OPENAI_API_KEY, model: process.env.OPENAI_MODEL };
  try {
    process.env.OPENAI_API_KEY = "mock-key";
    process.env.OPENAI_MODEL = "mock-model";
    for (const route of [analyze, cardRoute]) {
      assert.equal((await route(new Request("http://localhost", { method: "POST", body: "{" }))).status, 400);
      assert.equal((await route(request({ text: "" }))).status, 400);
    }
    assert.equal((await cardRoute(request({ text: "Test", answers: [{ field: "unknown", answer: "x" }] }))).status, 400);
    assert.equal((await cardRoute(request({ text: "Test", answers: [{ field: "users", answer: "A" }, { field: "users", answer: "B" }] }))).status, 400);
    reply = JSON.stringify(content);
    const result = await cardRoute(request({ text: "Test", answers: [] }));
    assert.equal(result.status, 200);
    const data = await result.json();
    assert.equal(data.card.score, data.score.total);
    assert.equal(data.card.level, data.score.level);

    // Integration: API response -> saved editable draft -> explicit publication.
    const originalFetch = globalThis.fetch;
    const initialCount = useTaskStore.getState().tasks.length;
    try {
      globalThis.fetch = async (url, options) => {
        assert.equal(url, "/api/card");
        return cardRoute(new Request("http://localhost" + url, options));
      };
      const generated = await createTaskDraft("Test", []);
      assert.equal(useTaskStore.getState().tasks.length, initialCount + 1);
      assert.equal(generated.card.status, "draft");
      assert.ok(!getCatalog(useTaskStore.getState().tasks).some((task) => task.id === generated.card.id));
      useTaskStore.getState().updateTask(generated.card.id, { data: "Не указано" });
      useTaskStore.getState().publishTask(generated.card.id);
      const published = getCatalog(useTaskStore.getState().tasks).find((task) => task.id === generated.card.id);
      assert.ok(published);
      assert.equal(published.score, calculateScore(published).total);
      assert.equal(published.level, calculateScore(published).level);
      reply = "invalid JSON";
      await assert.rejects(() => createTaskDraft("Test", []), (error) => error.retryable === true);
      assert.equal(useTaskStore.getState().tasks.length, initialCount + 1);
      globalThis.fetch = async () => Response.json({ card: { id: "broken" } });
      await assert.rejects(() => createTaskDraft("Test", []));
      assert.equal(useTaskStore.getState().tasks.length, initialCount + 1);
    } finally {
      globalThis.fetch = originalFetch;
    }
    reply = "not JSON";
    const failed = await analyze(request({ text: "Test" }));
    assert.equal(failed.status, 502);
    assert.equal((await failed.json()).retryable, true);
    delete process.env.OPENAI_API_KEY;
    assert.equal((await analyze(request({ text: "Test" }))).status, 503);
  } finally {
    if (saved.key === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = saved.key;
    if (saved.model === undefined) delete process.env.OPENAI_MODEL;
    else process.env.OPENAI_MODEL = saved.model;
  }
  console.log("PASS: real Zod, Zustand, score, seed, AI parsing and API handlers. Only AI transport mocked.");
}

async function live() {
  if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_MODEL) throw new Error("Set OPENAI_API_KEY and OPENAI_MODEL.");
  const load = loader();
  const text = "У нас кофейня. Два администратора записывают заявки на доставку в блокнот, иногда теряют заказы. Нужен список заказов со статусами.";
  const analyze = load("app/api/analyze/route.ts").POST;
  const build = load("app/api/card/route.ts").POST;
  console.log("LIVE: analyzing task (paid request)...");
  const analysisResponse = await analyze(request({ text }));
  if (!analysisResponse.ok) throw new Error(`Analyze returned HTTP ${analysisResponse.status}. Check API credentials, model, credits or AI response format.`);
  const analysis = await analysisResponse.json();
  console.log(`PASS: analyze returned ${analysis.questions.length} questions.`);
  console.log("LIVE: building card (paid request)...");
  const cardResponse = await build(request({ text, answers: [{ field: "successCriteria", answer: "Оформление заказа должно занимать не более 2 минут." }] }));
  if (!cardResponse.ok) throw new Error(`Card returned HTTP ${cardResponse.status}. Check API settings or AI response format.`);
  const result = await cardResponse.json();
  assert.equal(result.card.status, "draft");
  assert.equal(result.card.score, result.score.total);
  assert.equal(result.score.categories.length, 7);
  console.log(`PASS: card generated, score ${result.score.total}, level ${result.score.level}.`);
}

(async () => {
  await offline();
  if (process.argv.includes("--live")) await live();
})().catch((error) => {
  // Never log raw provider errors or environment values.
  console.error("Backend check failed:", error instanceof assert.AssertionError ? "Assertion failed; review the checks." : error.message);
  process.exitCode = 1;
});
