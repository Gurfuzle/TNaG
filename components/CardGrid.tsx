import { ReactNode } from 'react';

export default function CardGrid({ children }: { children: ReactNode }) {
  return <div className="card-grid">{children}</div>;
}
