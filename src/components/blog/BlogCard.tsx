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
        className="h-24 rounded-3xl p-8 flex justify-between items-center transition-colors duration-500"
        style={{ backgroundColor: bgColor }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center">
          <span className="font-mono text-inherit">{post.title}</span>
          <div
            className={`ml-2 transform inline-block ${
              prefersReducedMotion
                ? ""
                : "transition-transform duration-500 ease-in-out"
            }`}
            style={{
              transform: isHovered ? "translateX(0.75rem)" : "translateX(0)",
            }}
          >
            →
          </div>
        </div>
        <span className="font-mono text-sm">{formatDate(post.date)}</span>
      </div>
    </a>
  );
};
