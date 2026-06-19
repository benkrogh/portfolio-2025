import React, { useState } from "react";
import type { Post } from "@/types/blog";
import { formatDate } from "@/utils/blogUtils";
import { adjustColor, TEXT_COLOR } from "@/utils/colorUtils";

interface BlogCardProps {
  post: Post;
  prefersReducedMotion: boolean;
}

export default function BlogCard({ post, prefersReducedMotion }: BlogCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const bgColor = isHovered ? adjustColor(post.color, 10) : post.color;

  return (
    <a
      href={`/blog/${post.slug}`}
      className="block no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-3xl"
    >
      <div data-blog-card>
        <div
          className="rounded-3xl my-2 md:my-4 p-6 md:p-12 flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-0 min-h-[7rem] md:min-h-0 transition-colors duration-400"
          style={{ 
            backgroundColor: bgColor,
            color: TEXT_COLOR
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-center md:mb-0">
            <span className="font-mono text-lg md:text-[1.5rem] leading-snug md:leading-[2rem]">
              {post.title}
            </span>
            <div
              className={`ml-2 md:ml-4 text-lg md:text-[1.5rem] leading-snug md:leading-[2rem] transform inline-block shrink-0 ${
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
          <span className="font-mono text-base md:text-[1.5rem] leading-snug md:leading-[2rem] md:shrink-0">
            {formatDate(post.date)}
          </span>
        </div>
      </div>
    </a>
  );
}
