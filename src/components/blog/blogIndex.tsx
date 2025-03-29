import React, { useState, useEffect } from "react";
import AnimatedTitle from "../AnimatedTitle";
import { getPostColor, adjustColor, TEXT_COLOR } from "@/utils/colorUtils";

const defaultPosts = [
  {
    slug: "coffee-and-favorites",
    title: "Coffee & my favorite things",
    date: "2024-11-25",
    color: getPostColor(0),
  },
  {
    slug: "ios-app-with-claude",
    title: "Making an iOS app with Claude",
    date: "2024-11-12",
    color: getPostColor(1),
  },
  {
    slug: "favorite-albums",
    title: "My favorite albums of 2024",
    date: "2024-10-05",
    color: getPostColor(2),
  },
  {
    slug: "ai-thoughts",
    title: "What's the deal with AI, anyway?",
    date: "2024-09-23",
    color: getPostColor(3),
  },
];

const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const onChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  return prefersReducedMotion;
};

interface Post {
  slug: string;
  title: string;
  date: string;
  color: string;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date
    .toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    })
    .replace(/\//g, ".");
};

const BlogPost = ({
  post,
  prefersReducedMotion,
}: {
  post: Post;
  prefersReducedMotion: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const bgColor = isHovered ? adjustColor(post.color, 10) : post.color;
  const shouldReduceMotion = prefersReducedMotion;
  // Placeholder for shouldReduceMotion
  console.log(shouldReduceMotion);
  return (
    <a
      href={`/blog/${post.slug}`}
      className="block no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-3xl"
    >
      <div
        className="h-24 rounded-3xl p-12 flex justify-between items-center transition-colors duration-200"
        style={{ 
          backgroundColor: bgColor,
          color: TEXT_COLOR
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center">
          <span className="font-mono text-[1.5rem] leading-[2rem]">
            {post.title}
          </span>
          <div className="relative ml-2">
            <span
              aria-hidden="true"
              style={{
                display: "inline-block",
                transform: isHovered ? "translateX(12px)" : "translateX(0)",
                transition: "transform 0.2s ease-in-out",
              }}
            >
              →
            </span>
          </div>
        </div>
        <span className="font-mono text-[1.5rem] leading-[2rem]">
          {formatDate(post.date)}
        </span>
      </div>
    </a>
  );
};

const BlogIndex = ({ posts = defaultPosts }: { posts?: Post[] }) => {
  const prefersReducedMotion = useReducedMotion();

  if (!posts?.length) {
    return (
      <div className="px-4 py-8">
        <h1 className="font-mono text-2xl mb-8">No posts found</h1>
      </div>
    );
  }

  return (
    <div className="w-full">
      <header className="h-[55vh] mt-6 mb-4">
        <div className="w-full h-full font-light flex items-center">
          <AnimatedTitle 
            text="/blog: My thoughts on[BR]design, music, and culture"
            id="blog-title"
            isHomepage={true}
          />
        </div>
      </header>

      <div className="w-full">
        {posts.map((post, index) => (
          <div key={post.slug} className={index > 0 ? 'mt-4' : ''}>
            <BlogPost
              post={post}
              prefersReducedMotion={prefersReducedMotion}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogIndex;
