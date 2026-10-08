import React from 'react';

interface PageIntroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
  children?: React.ReactNode;
}

const PageIntro: React.FC<PageIntroProps> = ({
  eyebrow,
  title,
  description,
  centered = false,
  children,
}) => (
  <header className={`page-intro ${centered ? 'text-center' : ''}`}>
    {eyebrow && <p className="page-eyebrow">{eyebrow}</p>}
    <h1 className="page-title">{title}</h1>
    {description && <p className="page-description">{description}</p>}
    {children && <div className={`mt-6 flex flex-wrap gap-3 ${centered ? 'justify-center' : ''}`}>{children}</div>}
  </header>
);

export default PageIntro;
