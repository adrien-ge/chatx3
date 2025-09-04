import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon: Icon, delay = 0 }) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-md p-6 card-hover-animation"
      style={{ 
        animationDelay: `${delay}s`,
        opacity: 0,
        animation: `fadeIn 0.5s ease-out ${delay}s forwards, slideUp 0.5s ease-out ${delay}s forwards`
      }}
    >
      <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center mb-6">
        <Icon className="h-6 w-6 text-primary-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;