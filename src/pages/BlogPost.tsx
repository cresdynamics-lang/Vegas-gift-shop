import { Link, useParams } from 'react-router-dom';
import { Calendar, Clock, ChevronRight, ArrowLeft } from 'lucide-react';
import { getBlogBySlug, BLOG_POSTS } from '../data/blogs';
import { formatDisplayText } from '../utils/formatText';
import OptimizedImage from '../components/OptimizedImage';

const BlogPost = () => {
  const { slug } = useParams();
  const post = slug ? getBlogBySlug(slug) : undefined;

  if (!post) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold mb-4">Article not found</h1>
        <Link to="/blog" className="text-red-600 font-semibold hover:underline">
          Back to blog
        </Link>
      </div>
    );
  }

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article className="bg-white min-h-screen">
      <div className="relative h-[40vh] min-h-[280px] max-h-[480px] bg-gray-900">
        <OptimizedImage
          src={post.image}
          alt=""
          priority
          sizes="100vw"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
        <div className="max-w-3xl mx-auto px-4 h-full flex flex-col justify-end pb-10 relative z-10 text-white">
          <nav className="text-sm text-white/60 mb-4">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight size={14} className="inline mx-1" />
            <Link to="/blog" className="hover:text-white">
              Blog
            </Link>
          </nav>
          <span className="text-red-400 text-xs font-bold uppercase tracking-widest mb-2">
            {post.category}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            {formatDisplayText(post.title)}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-white/70">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(post.date).toLocaleDateString('en-KE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {post.readMinutes} min read
            </span>
            <span>By {post.author}</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 lg:py-16">
        <p className="text-xl text-gray-600 leading-relaxed mb-10 font-medium border-l-4 border-red-600 pl-6">
          {formatDisplayText(post.excerpt)}
        </p>
        <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed text-lg">
          {post.content.map((para, i) => (
            <p key={i}>{formatDisplayText(para)}</p>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-red-600 font-bold hover:underline"
          >
            <ArrowLeft size={18} />
            All articles
          </Link>
        </div>
      </div>

      {related.length > 0 && (
        <section className="bg-gray-50 py-14 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">More to read</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to={`/blog/${r.slug}`}
                  className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-all"
                >
                  <div className="aspect-video overflow-hidden">
                    <OptimizedImage
                      src={r.image}
                      alt=""
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-red-600">
                      {formatDisplayText(r.title)}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
};

export default BlogPost;
