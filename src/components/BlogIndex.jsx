import { useState, useEffect } from 'react';

const defaultPosts = [
  {
    slug: 'coffee-and-favorites',
    title: 'Coffee & my favorite things',
    date: '2024-11-25',
    color: '#EC6A5C'
  },
  {
    slug: 'ios-app-with-claude',
    title: 'Making an iOS app with Claude',
    date: '2024-11-12',
    color: '#E69D72'
  },
  {
    slug: 'favorite-albums',
    title: 'My favorite albums of 2024',
    date: '2024-10-05',
    color: '#77B7EA'
  },
  {
    slug: 'ai-thoughts',
    title: "What's the deal with AI, anyway?",
    date: '2024-09-23',
    color: '#A8D5B1'
  }
];

const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const onChange = (event) => setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  return prefersReducedMotion;
};

const adjustColor = (hex, percent) => {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, ((num >> 16) + amt));
  const G = Math.min(255, (((num >> 8) & 0x00FF) + amt));
  const B = Math.min(255, ((num & 0x0000FF) + amt));
  return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
};

const BlogCard = ({ post, prefersReducedMotion }) => {
  const [isHovered, setIsHovered] = useState(false);
  const bgColor = isHovered ? adjustColor(post.color, 10) : post.color;
  
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    month: '2-digit', day: '2-digit', year: '2-digit'
  }).replace(/\//g, '.');

  return (
    <a 
      href={`/blog/${post.slug}`}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-3xl mx-12"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="h-24 rounded-3xl flex justify-between items-center transition-colors duration-200 px-12"
        style={{ backgroundColor: bgColor }}
      >
        <div className="flex items-center">
          <span className="font-mono">{post.title}</span>
          <div className="relative ml-2">
            <span 
              aria-hidden="true"
              style={{
                display: 'inline-block',
                transform: isHovered ? 'translateX(8px)' : 'translateX(0)',
                transition: prefersReducedMotion ? 'none' : 'transform 0.2s ease-in-out'
              }}
            >
              →
            </span>
          </div>
        </div>
        <time dateTime={post.date} className="font-mono text-sm">{formattedDate}</time>
      </div>
    </a>
  );
};

const BlogIndex = ({ posts = defaultPosts }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="w-full space-y-6 py-12">
      <div className="mx-12">
        <div 
          className="h-72 rounded-3xl flex items-center"
          style={{ backgroundColor: '#EDE9E5' }}
        >
          <h1 className="font-mono text-6xl px-12">
            /blog: My thoughts on<br />
            design, music, and culture
          </h1>
        </div>
      </div>
      
      <div className="space-y-6">
        {posts.map((post) => (
          <BlogCard 
            key={post.slug}
            post={post}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </div>
    </div>
  );
};

export default BlogIndex;