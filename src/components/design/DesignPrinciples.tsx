import React from 'react';

const defaultPrinciples = [
  { id: 1, title: "DESIGN TO DELIGHT AND INSPIRE" },
  { id: 2, title: "BE THOUGHTFUL FIRST" },
  { id: 3, title: "DELIVER LATER" },
  { id: 4, title: "DESIGN WITH RESTRAINTS" },
  { id: 5, title: "DESIGN SYSTEMS THAT INSPIRE TRUST" },
  { id: 6, title: "DESIGN TO EMPOWER PEOPLE" },
  { id: 7, title: "HAVE A REASON FOR WHAT YOU DO" },
  { id: 8, title: "GOOD DESIGN IS REDUCTIVE" }
];

export default function DesignPrinciples() {
  return (
    <div 
      style={{ 
        backgroundColor: '#EC6A5C',
        borderRadius: '32px'
      }} 
      className="p-12"
    >
      <span className="font-mono text-4xl inline" style={{ color: '#521710' }}>
        SEVEN DESIGN PRINCIPLES: 
        {defaultPrinciples.map((principle, index) => (
          <React.Fragment key={principle.id}>
            <span 
              className="cursor-pointer"
              style={{ 
                color: '#521710',
                transition: 'color 400ms ease-in-out'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#521710'}
            >
              {String(principle.id).padStart(2, '0')}. {principle.title}
            </span>
            {' '}
          </React.Fragment>
        ))}
      </span>
    </div>
  );
}
