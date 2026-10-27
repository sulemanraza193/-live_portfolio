import Blog from '../models/Blog.js';

// GET /api/blog — public, published only, supports pagination/search/category/tag
export async function getPublishedBlogs(req, res, next) {
  try {
    const { page = 1, limit = 6, category, tag, search, featured } = req.query;
    const filter = { status: 'published' };

    if (category && category !== 'All') filter.category = category;
    if (tag) filter.tags = tag;
    if (search) filter.$text = { $search: search };

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(24, Math.max(1, parseInt(limit, 10) || 6));

    const [posts, total] = await Promise.all([
      Blog.find(filter)
        .select('-content')
        .sort({ publishedAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Blog.countDocuments(filter),
    ]);

    // Featured post is the single most recent published post, used by the
    // blog homepage hero — only computed when explicitly requested so
    // paginated list calls don't do the extra query.
    let featuredPost = null;
    if (featured === 'true') {
      featuredPost = await Blog.findOne({ status: 'published' })
        .select('-content')
        .sort({ publishedAt: -1 });
    }

    res.json({
      posts,
      featuredPost,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/blog/categories — public, distinct category list for filter UI
export async function getBlogCategories(req, res, next) {
  try {
    const categories = await Blog.distinct('category', { status: 'published' });
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

// GET /api/blog/:slug — public, single post + related articles, increments views
export async function getBlogBySlug(req, res, next) {
  try {
    const post = await Blog.findOneAndUpdate(
      { slug: req.params.slug, status: 'published' },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    const related = await Blog.find({
      _id: { $ne: post._id },
      status: 'published',
      $or: [{ category: post.category }, { tags: { $in: post.tags } }],
    })
      .select('-content')
      .sort({ publishedAt: -1 })
      .limit(3);

    res.json({ post, related });
  } catch (err) {
    next(err);
  }
}

// --- Admin ---

// GET /api/blog/admin/all — admin only, all posts regardless of status
export async function getAllBlogsAdmin(req, res, next) {
  try {
    const { search, status } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }
    const posts = await Blog.find(filter).select('-content').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    next(err);
  }
}

// GET /api/blog/admin/:id — admin only, full post for editing
export async function getBlogByIdAdmin(req, res, next) {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }
    res.json(post);
  } catch (err) {
    next(err);
  }
}

// POST /api/blog — admin only
export async function createBlog(req, res, next) {
  try {
    const post = await Blog.create(req.body);
    res.status(201).json(post);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400);
      return next(new Error('A post with that slug already exists'));
    }
    next(err);
  }
}

// PUT /api/blog/:id — admin only
export async function updateBlog(req, res, next) {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }
    Object.assign(post, req.body);
    await post.save(); // triggers pre-validate hook for slug/readingTime/publishedAt
    res.json(post);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400);
      return next(new Error('A post with that slug already exists'));
    }
    next(err);
  }
}

// DELETE /api/blog/:id — admin only
export async function deleteBlog(req, res, next) {
  try {
    const post = await Blog.findByIdAndDelete(req.params.id);
    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
}
