import React from 'react';

interface SpinnerProps {
  size?: number;
  colorClass?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 32,
  colorClass = 'border-indigo-500',
}) => {
  const borderSize = 2;
  const spinnerStyle = {
    height: `${size}px`,
    width: `${size}px`,
  };

  return (
    <div className="h-full w-full flex justify-center items-center py-16">
      <div
        className={`animate-spin rounded-full border-t-${borderSize} border-b-${borderSize} ${colorClass}`}
        style={spinnerStyle}
      />
    </div>
  );
};

export default Spinner;
