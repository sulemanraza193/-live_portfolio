import 'dotenv/config';
import connectDB from '../config/db.js';
import User from '../models/User.js';

async function seedAdmin() {
  await connectDB();

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const username = process.env.ADMIN_USERNAME || 'admin';

  if (!email || !password) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before running this script.');
    process.exit(1);
  }

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`Admin user already exists for ${email}. No changes made.`);
    process.exit(0);
  }

  await User.create({ username, email, password, role: 'admin' });
  console.log(`Admin user created: ${email}`);
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
