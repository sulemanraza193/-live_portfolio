import 'dotenv/config';
import connectDB from '../config/db.js';
import Blog from '../models/Blog.js';

const posts = [
  {
    title: 'Building a Cross-Domain Auth System with Passport.js',
    description:
      'How I set up secure session-based authentication between a Vercel-hosted frontend and a Railway-hosted backend on different domains.',
    content: `Cross-domain authentication trips up a lot of MERN developers the first time they deploy frontend and backend separately. Here's what actually worked.

## The problem

Sessions rely on cookies, and cookies are domain-scoped. When your React app is on vercel.app and your API is on railway.app, the browser won't send the session cookie back by default.

## The fix

Three things had to line up: setting \`sameSite: 'none'\` and \`secure: true\` on the session cookie, configuring CORS with \`credentials: true\` and an explicit origin (not a wildcard), and setting \`withCredentials: true\` on the frontend's axios instance.

## Gotchas

Local development breaks if you're not careful, since \`secure: true\` cookies require HTTPS. I ended up branching the cookie config on \`NODE_ENV\` so local dev still works over plain HTTP.

The other trap: proxy settings in Vite only apply during \`npm run dev\`, not in production, so I had to handle the API base URL differently between environments.`,
    thumbnail: '',
    tags: ['Node.js', 'Authentication', 'Passport.js', 'Deployment'],
    category: 'Backend',
    status: 'published',
  },
  {
    title: 'Automating WhatsApp Replies with n8n and the Cloud API',
    description:
      'A walkthrough of wiring Meta\'s WhatsApp Cloud API into n8n for tool-calling automation with persistent memory.',
    content: `n8n turned out to be a much faster path to a working WhatsApp bot than writing the webhook handling myself from scratch.

## Setup

Meta's WhatsApp Cloud API needs a verified business number, a permanent system user token (temporary tokens expire in 24 hours and will break your automation), and a webhook endpoint n8n can expose publicly.

## The flow

Incoming messages hit an n8n webhook trigger, get routed through a switch node based on intent, and get answered either by a simple response node or by handing off to an LLM node with tool-calling enabled for anything that needs to look something up.

## Persistent memory

The trickiest part was giving the bot memory across messages, since WhatsApp doesn't give you a session concept. I ended up keying a simple key-value store off the sender's phone number and loading recent context back in before each LLM call.`,
    thumbnail: '',
    tags: ['n8n', 'WhatsApp Cloud API', 'Automation'],
    category: 'Automation',
    status: 'published',
  },
  {
    title: 'Fine-Tuning ResNet50 for a Final Year Image Classifier',
    description:
      'Notes from building a Flask-based image classification app using transfer learning on a pre-trained ResNet50 model.',
    content: `Transfer learning made this project far more tractable than training a CNN from scratch on a student laptop with no GPU.

## Why ResNet50

Pre-trained on ImageNet, ResNet50 already has strong general-purpose feature extraction. I froze the early convolutional layers and only fine-tuned the final classification head on my own dataset.

## Serving it

Flask handles the web layer — a simple upload form posts to an endpoint that loads the image, runs it through the model, and returns the predicted class with a confidence score. Auth is handled separately via SQLAlchemy against a Neon Postgres database, so results can be tied to a logged-in user.

## What I'd do differently

Training on CPU only was the real bottleneck — a single epoch over a modest dataset took long enough that I had to be very deliberate about which hyperparameters were worth experimenting with, rather than grid-searching freely.`,
    thumbnail: '',
    tags: ['Flask', 'PyTorch', 'Machine Learning', 'ResNet50'],
    category: 'Machine Learning',
    status: 'published',
  },
  {
    title: 'Notes on Tailwind CSS v4 (Draft)',
    description: 'Early impressions of the CSS-first config approach — not ready to publish yet.',
    content: `Still collecting thoughts on the @theme directive and how it compares to the old tailwind.config.js approach. Will finish this once I've used it on a second project.`,
    thumbnail: '',
    tags: ['Tailwind CSS'],
    category: 'Frontend',
    status: 'draft',
  },
];

async function seedBlog() {
  await connectDB();
  await Blog.deleteMany({});
  for (const post of posts) {
    await Blog.create(post); // create (not insertMany) so the pre-validate hook runs per-doc
  }
  console.log(`Seeded ${posts.length} blog posts.`);
  process.exit(0);
}

seedBlog().catch((err) => {
  console.error(err);
  process.exit(1);
});
