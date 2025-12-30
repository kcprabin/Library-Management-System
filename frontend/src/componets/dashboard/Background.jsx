import React, { useState } from 'react';

const BackgroundComponent = () => {
  const [status, setStatus] = useState('idle');

  return (
    <>
     
      <img
        src="/images/Background.jpg"
        alt="bookshelf background"
        className="fixed inset-0 w-full h-full object-cover z-[-10]"
        onLoad={() => { setStatus('loaded'); console.info('Background image loaded'); }}
        onError={(e) => { setStatus('error'); console.error('Background image failed to load', e); }}
      />

     </>
  );
};

export default BackgroundComponent;
