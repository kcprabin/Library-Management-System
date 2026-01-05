import React from 'react';

const Background = () => {
  return (
    <>
      
      <div 
        className="fixed inset-0 z-[-10] bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30"
        aria-hidden="true"
      />
      
    
      <div 
        className="fixed top-0 right-0 w-[500px] h-[500px] bg-purple-300 rounded-full 
                   mix-blend-multiply filter blur-3xl opacity-20 animate-blob z-[-9]"
        style={{
          animation: 'blob 20s infinite'
        }}
        aria-hidden="true"
      />
      
    
      <div 
        className="fixed top-0 left-0 w-[500px] h-[500px] bg-blue-300 rounded-full 
                   mix-blend-multiply filter blur-3xl opacity-20 animate-blob z-[-9]"
        style={{
          animation: 'blob 20s infinite 7s'
        }}
        aria-hidden="true"
      />
      
    
      <div 
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] 
                   bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl 
                   opacity-20 animate-blob z-[-9]"
        style={{
          animation: 'blob 20s infinite 14s'
        }}
        aria-hidden="true"
      />
      
      
      <div 
        className="fixed inset-0 z-[-8] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}
        aria-hidden="true"
      />

      
      <div 
        className="fixed inset-0 z-[-7] opacity-5"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 100%)'
        }}
        aria-hidden="true"
      />

      
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }
      `}</style>
    </>
  );
};

export default Background;