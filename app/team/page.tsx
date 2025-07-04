import React from 'react';

// Change from React.FC to a regular function component
export default function TeamPage() {
  const teamMembers = [
    {
      name: 'John Doe',
      role: 'Team Lead',
      imageUrl: '/john-doe.jpg',
      bio: 'John is an experienced team lead with a passion for innovation.',
    },
    {
      name: 'Jane Smith',
      role: 'Software Engineer',
      imageUrl: '/jane-smith.jpg',
      bio: 'Jane is a talented software engineer specializing in frontend development.',
    },
    {
      name: 'Peter Jones',
      role: 'Data Scientist',
      imageUrl: '/peter-jones.jpg',
      bio: 'Peter is a data scientist with expertise in machine learning and statistical analysis.',
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Our Team</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4">
            <img
              src={member.imageUrl}
              alt={member.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{member.name}</h2>
            <p className="text-gray-600 mb-2">{member.role}</p>
            <p className="text-gray-700">{member.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
}