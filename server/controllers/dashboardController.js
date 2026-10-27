import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import Contact from '../models/Contact.js';
import Blog from '../models/Blog.js';

export async function getStats(req, res, next) {
  try {
    const [totalProjects, totalSkills, unreadMessages, totalMessages, blogPosts] = await Promise.all([
      Project.countDocuments(),
      Skill.countDocuments(),
      Contact.countDocuments({ read: false }),
      Contact.countDocuments(),
      Blog.countDocuments(),
    ]);

    const [recentMessages, recentProjects] = await Promise.all([
      Contact.find().sort({ createdAt: -1 }).limit(5),
      Project.find().sort({ createdAt: -1 }).limit(5),
    ]);

    res.json({
      totals: {
        projects: totalProjects,
        skills: totalSkills,
        unreadMessages,
        totalMessages,
        blogPosts,
        visitors: 0,
      },
      recentMessages,
      recentProjects,
    });
  } catch (err) {
    next(err);
  }
}
