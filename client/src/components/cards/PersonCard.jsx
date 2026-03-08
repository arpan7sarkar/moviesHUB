import React from 'react';
import { Link } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';

const TMDB_IMG = 'https://image.tmdb.org/t/p';

const PersonCard = ({ person }) => {
  const imgUrl = person.profile_path
    ? `${TMDB_IMG}/w185${person.profile_path}`
    : null;

  return (
    <Link
      to={`/person/${person.id}`}
      className="flex flex-col items-center group flex-shrink-0 w-24 md:w-28"
    >
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-elevated border-2 border-border group-hover:border-accent transition-all shadow-card mb-2 flex-shrink-0">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={person.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted bg-surface">
            <FiUser size={28} />
          </div>
        )}
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
