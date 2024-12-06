import React from 'react';

interface Project {
  title: string;
  image: string;
  gradient: string;
}

interface ProjectGridProps {
  projects: Project[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map((project, index) => (
        <div
          key={index}
          className={`relative overflow-hidden rounded-lg bg-gradient-to-br ${project.gradient} p-4 aspect-square`}
        >
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      ))}
    </div>
  );
} 