import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { BLOG_POSTS } from '../data/blogs';
import { formatDisplayText } from '../utils/formatText';
import OptimizedImage from '../components/OptimizedImage';

const Blog = () => {
  const [featured, ...rest] = BLOG_POSTS;

  return (
    <div className="bg-white min-h-screen">
      <section className="relative bg-[#0a0a0a] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-600/30 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 py-16 lg:py-20 relative z-10">
          <p className="text-red-400 text-xs font-bold uppercase tracking-[0.2em] mb-3">
            The Luxury Journal
          </p>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Gift guides &amp; inspiration</h1>
          <p className="text-white/60 max-w-xl text-lg">
            Ideas for corporate gifting, personalization, romance, and celebrating every occasion in
            Nairobi and beyond.
          </p>
        </div>
      </section>

      {featured && (
        <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-20 pb-12">
          <Link
            to={`/blog/${featured.slug}`}
            className="group grid lg:grid-cols-2 gap-0 bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow"
          >
            <div className="aspect-[16/10] lg:aspect-auto lg:min-h-[320px] overflow-hidden">
              <OptimizedImage
                src={featured.image}
                alt=""
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="p-8 lg:p-10 flex flex-col justify-center">
              <span className="text-red-600 text-xs font-bold uppercase tracking-widest mb-2">
                Featured · {featured.category}
              </span>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                {formatDisplayText(featured.title)}
              </h2>
              <p className="text-gray-600 mb-6 line-clamp-3">{featured.excerpt}</p>
              <span className="inline-flex items-center gap-2 text-red-600 font-bold text-sm">
                Read article <ArrowRight size={16} />
              </span>
            </div>
          </Link>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.map((post) => (
            <article
              key={post.slug}
              className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
            >
              <Link to={`/blog/${post.slug}`} className="block aspect-[16/10] overflow-hidden">
                <OptimizedImage
                  src={post.image}
                  alt=""
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
              <div className="p-6">
                <span className="text-xs font-bold text-red-600 uppercase tracking-wide">
                  {post.category}
                </span>
                <h3 className="font-bold text-gray-900 mt-2 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
                  <Link to={`/blog/${post.slug}`}>{formatDisplayText(post.title)}</Link>
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(post.date).toLocaleDateString('en-KE', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {post.readMinutes} min read
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Blog;
