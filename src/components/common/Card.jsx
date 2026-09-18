import React from 'react';
import './Card.css';

export const Card = ({
  children,
  title,
  subtitle,
  headerAction,
  className = '',
  padding = 'normal',
  bordered = true,
  hoverable = false,
  footer
}) => {
  return (
    <div
      className={`card ${bordered ? 'card-bordered' : ''} ${hoverable ? 'card-hoverable' : ''} padding-${padding} ${className}`}
    >
      {(title || subtitle || headerAction) && (
        <div className="card-header">
          <div className="card-header-titles">
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {headerAction && <div className="card-header-action">{headerAction}</div>}
        </div>
      )}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};
