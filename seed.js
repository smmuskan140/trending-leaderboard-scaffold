// seed.js — load 100 fake posts into the leaderboard.
// Run with: npm run seed

import { redis } from "./leaderboard.js";

async function seed() {
  try {
    await redis.del("trending:posts");

    const pipeline = redis.pipeline();
    for (let i = 1; i <= 100; i++) {
      const id = "post:" + i;
      pipeline.hset(id + ":meta", "title", "Post number " + i, "author", "@user" + i);
      pipeline.zadd("trending:posts", Math.floor(Math.random() * 50), id);
    }

    const results = await pipeline.exec();
    for (const [error] of results) {
      if (error) throw error;
    }

    console.log("Seeded 100 posts.");
  } finally {
    await redis.quit();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
