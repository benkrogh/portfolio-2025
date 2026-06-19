import React, { useEffect, useState } from "react";
import AnimatedTitle from "../AnimatedTitle";
import BlogCard from "./BlogCard";
import { getPostColor } from "@/utils/colorUtils";

const defaultPosts = [
  {
    slug: "coffee-and-favorites",
    title: "Coffee & my favorite things",
    date: "2024-11-25",
    color: getPostColor(0),
  },
  {
    slug: "favorite-albums-2024",
    title: "My favorite albums of 2024",
    date: "2024-03-20",
    color: getPostColor(1),
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
      <header className="mt-6 mb-4">
        <AnimatedTitle 
          text="/blog: My thoughts on[BR] design, music, and culture"
          id="blog-title"
          isHomepage={true}
        />
      </header>

      <div className="w-full">
        {posts.map((post, index) => (
          <div key={post.slug} className={index > 0 ? "mt-4" : ""}>
            <BlogCard
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
