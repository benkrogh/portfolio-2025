import { useState } from "react";
import type { Post } from "@/types/blog";
import { formatDate, adjustColor } from "@/utils/blogUtils";

interface BlogCardProps {
  post: Post;
  prefersReducedMotion: boolean;
}

export const BlogCard = ({ post, prefersReducedMotion }: BlogCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const bgColor = isHovered ? adjustColor(post.color, 10) : post.color;

  return (
    <a
      href={`/blog/posts/${post.slug}`}
      className="block no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-3xl"
    >
      <div
        className="h-24 rounded-3xl m-4 p-8 flex justify-between items-center transition-colors duration-400"
        style={{ backgroundColor: bgColor }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center">
          <span className="text-[1.5rem] leading-[2rem]">{post.title}</span>
          <div
            className={`ml-4 text-[1.5rem] leading-[2rem] transform inline-block ${
              prefersReducedMotion
                ? ""
                : "transition-transform duration-400 ease-in-out"
            }`}
            style={{
              transform: isHovered ? "translateX(0.25rem)" : "translateX(0)",
            }}
          >
            →
          </div>
        </div>
        <span className="text-[1.5rem] leading-[2rem]">{formatDate(post.date)}</span>
      </div>
    </a>
  );
};
