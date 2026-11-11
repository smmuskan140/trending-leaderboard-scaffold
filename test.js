// test.js — proves the leaderboard works.
// Run with: npm test (run npm run seed first)

import assert from "node:assert/strict";
import { upvote, getTop, redis } from "./leaderboard.js";

async function run() {
  const target = "post:50";

  try {
    // Upvote the target 50 times.
    for (let i = 0; i < 50; i++) {
      await upvote(target);
    }

    const top = await getTop(10);
    console.log("Top 10:");
    top.forEach((p, i) => console.log(`  #${i + 1}  ${p.id}  score=${p.score}  ${p.title} (${p.author})`));

    const madeIt = top.some((p) => p.id === target);
    assert.equal(madeIt, true, `${target} should reach the top 10 after 50 upvotes`);
    console.log(`\nPASS ✅  ${target} reached the top 10`);
  } finally {
    await redis.quit();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
