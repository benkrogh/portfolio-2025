import React from 'react';

const defaultPrinciples = [
  { id: 1, title: "DESIGN TO DELIGHT AND INSPIRE" },
  { id: 2, title: "BE THOUGHTFUL FIRST, CLEVER LATER" },
  { id: 3, title: "DESIGN WITH RESTRAINTS" },
  { id: 4, title: "DESIGN SYSTEMS THAT INSPIRE TRUST" },
  { id: 5, title: "DESIGN TO EMPOWER PEOPLE" },
  { id: 6, title: "HAVE A REASON FOR WHAT YOU DO" },
  { id: 7, title: "GOOD DESIGN IS REDUCTIVE" }
];

const DesignPrinciples = () => {
  return (
    <div className="p-12" style={{ backgroundColor: '#EC6A5C', borderRadius: '32px' }}>
      <div className="font-mono text-4xl" style={{ color: '#521710' }}>
        SEVEN DESIGN PRINCIPLES:{' '}
        {defaultPrinciples.map((principle, index) => (
          <React.Fragment key={principle.id}>
            <span 
              className="cursor-pointer"
              style={{ 
                transition: 'color 400ms ease-in-out'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#521710'}
            >
              {String(principle.id).padStart(2, '0')}. {principle.title}
            </span>
            {index < defaultPrinciples.length - 1 ? ' ' : ''}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default DesignPrinciples;