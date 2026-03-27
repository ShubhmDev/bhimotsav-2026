'use client';

import React, { useState } from 'react';
import { ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react';

interface Member {
  name: string;
  role: string;
  imageUrl: string;
}

const members: Member[] = [
  { name: 'Raviraj Sarvade', role: 'President', imageUrl: '/images/committee/raviraj-sarvade.jpeg' },
  { name: 'Sumit Talwade', role: 'Vice President', imageUrl: '/images/committee/sumit-talwade.jpeg' },
  { name: 'Shubham Pote', role: 'Secretary', imageUrl: '/images/committee/shubham-pote.jpeg' },
  { name: 'Yuraj Gaikwad', role: 'Secretary', imageUrl: '/images/committee/yuraj-gaikwad.jpeg' },
  { name: 'Tanish Sidam', role: 'Treasurer', imageUrl: '/images/committee/tanish-sidam.jpeg' },
  { name: 'Ganesh Ingole', role: 'Treasurer', imageUrl: '/images/committee/ganesh-ingole.jpeg' },
  { name: 'Mithun Ganachari', role: 'Joint Secretary', imageUrl: '/images/committee/mithun-ganachari.jpeg' },
  { name: 'Yash Bhalerao', role: 'Advisor', imageUrl: '/images/committee/yash-bhalerao.jpeg' },
  { name: 'Adesh Jawale', role: 'Advisor', imageUrl: '/images/committee/adesh-jawale.jpeg' },
  { name: 'Yash Sawarkar', role: 'Cultural Committee Head', imageUrl: '/images/committee/yash-sawarkar.jpeg' },
  { name: 'Suraj Tayde', role: 'Social Media Head', imageUrl: '/images/committee/suraj-tayde.jpg' },
  { name: 'Onkar Satpute', role: 'Technical Team', imageUrl: '/images/committee/onkar-satpute.jpeg' },
];

export default function CommitteeMembers() {
  const [showAll, setShowAll] = useState(false);

  return (
    <section className="w-full py-24 bg-black px-4 sm:px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <span className="text-accent-blue text-sm font-bold tracking-widest uppercase block mb-4">Our Team</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">Committee Members</h2>
          </div>
          <div className="hidden md:block">
            <button className="text-accent-blue hover:text-white transition-colors flex items-center gap-2 group">
              <span className="text-sm font-bold uppercase tracking-widest">Connect With Us</span>
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member, index) => (
            <div
              key={index}
              className={`
                group relative flex items-center gap-6 p-6 bg-[#0a0a0a] border border-white/5 
                md:hover:border-accent-blue/50 transition-all duration-300 rounded-lg overflow-hidden
                ${index >= 8 && !showAll ? 'hidden md:flex' : 'flex'}
              `}
            >
              {/* Image Section */}
              <div className="relative w-24 h-24 flex-shrink-0 md:grayscale md:group-hover:grayscale-0 transition-all duration-500">
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>

              {/* Info Section */}
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-white md:group-hover:text-accent-blue transition-colors">
                  {member.name}
                </h3>
                <p className="text-gray-500 text-sm mt-1">{member.role}</p>
              </div>

              {/* Arrow Icon */}
              <div className="absolute top-4 right-4">
                {/* <ArrowUpRight className="w-5 h-5 text-gray-700 group-hover:text-accent-blue transition-colors duration-300" /> */}
              </div>

              {/* Hover effect background glow - Only on Desktop */}
              <div className="hidden md:block absolute -bottom-10 -right-10 w-32 h-32 bg-accent-blue/10 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>

        {/* Mobile "See More" Button */}
        {!showAll && members.length > 8 && (
          <div className="mt-12 flex justify-center md:hidden">
            <button
              onClick={() => setShowAll(true)}
              className="group flex items-center gap-2 text-accent-blue border border-accent-blue/30 px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-accent-blue hover:text-white transition-all bg-[#0a0a0a]"
            >
              <span>See More</span>
              <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        )}

        {/* Mobile "See Less" Button (Optional, but good for UX) */}
        {showAll && (
          <div className="mt-12 flex justify-center md:hidden">
            <button
              onClick={() => setShowAll(false)}
              className="group flex items-center gap-2 text-accent-blue border border-accent-blue/30 px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-accent-blue hover:text-white transition-all bg-[#0a0a0a]"
            >
              <span>See Less</span>
              <ChevronUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        )}

        <div className="mt-12 md:hidden">
          <button className="text-accent-blue hover:text-white transition-colors flex items-center gap-2 group">
            <span className="text-sm font-bold uppercase tracking-widest">Connect With Us</span>
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
