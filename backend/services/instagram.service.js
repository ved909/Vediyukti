const fetch  = require('node-fetch');
const config = require('../server/config');

let cachedPosts = null;
let cacheExpiry = 0;
const CACHE_MS  = 30 * 60 * 1000;

async function getFeed() {
  if (cachedPosts && Date.now() < cacheExpiry) {
    return { posts: cachedPosts, cached: true };
  }

  const { INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_USER_ID } = config;

  if (!INSTAGRAM_ACCESS_TOKEN || !INSTAGRAM_USER_ID) {
    return null;
  }

  const fields = 'id,media_type,media_url,thumbnail_url,permalink,caption,timestamp';
  const url    = `https://graph.instagram.com/${INSTAGRAM_USER_ID}/media?fields=${fields}&access_token=${INSTAGRAM_ACCESS_TOKEN}&limit=9`;

  const igRes = await fetch(url);
  const data  = await igRes.json();

  if (data.error) {
    console.error('Instagram API error:', data.error);
    throw new Error(data.error.message);
  }

  const posts = (data.data || []).filter(p =>
    ['IMAGE', 'CAROUSEL_ALBUM', 'VIDEO'].includes(p.media_type)
  );

  cachedPosts = posts;
  cacheExpiry = Date.now() + CACHE_MS;

  return { posts, cached: false };
}

module.exports = { getFeed };
