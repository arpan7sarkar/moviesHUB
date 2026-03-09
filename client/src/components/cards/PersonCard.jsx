import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { resolvePoster, handlePosterError, getBlurBackground } from '../../utils/mediaFallbacks';

const PersonCard = ({ person }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgUrl = resolvePoster(person.profile_path, 'w300');

  return (
    <Link
      to={`/person/${person.id}`}
      className="flex flex-col items-center group flex-shrink-0 w-24 md:w-28"
    >
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-elevated border-2 border-border group-hover:border-accent transition-all shadow-card mb-2 flex-shrink-0">
        <img
          src={imgUrl}
          alt={person.name}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={handlePosterError}
          className={`w-full h-full object-cover transition-all duration-500 ${
            imgLoaded ? 'blur-0 scale-100 opacity-100' : 'blur-xl scale-[1.04] opacity-75'
          }`}
          style={getBlurBackground('thumb')}
        />
      </div>
      <p className="text-xs md:text-sm font-medium text-text-primary text-center truncate w-full leading-tight">
        {person.name}
      </p>
      <p className="text-[10px] md:text-xs text-text-muted text-center truncate w-full">
        {person.character || person.job || ''}
      </p>
    </Link>
  );
};

export default React.memo(PersonCard);
