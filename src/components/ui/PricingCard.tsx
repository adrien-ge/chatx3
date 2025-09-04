import React from 'react';
import { Check } from 'lucide-react';

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  delay?: number;
}

const PricingCard: React.FC<PricingCardProps> = ({
  name,
  price,
  period,
  description,
  features,
  cta,
  highlighted = false,
  delay = 0,
}) => {
  return (
    <div 
      className={`rounded-xl overflow-hidden card-hover-animation ${
        highlighted 
          ? 'border-2 border-primary-500 shadow-xl' 
          : 'border border-gray-200 shadow-md'
      }`}
      style={{ 
        animationDelay: `${delay}s`,
        opacity: 0,
        animation: `fadeIn 0.5s ease-out ${delay}s forwards, slideUp 0.5s ease-out ${delay}s forwards`
      }}
    >
      {highlighted && (
        <div className="bg-primary-500 py-2 text-center">
          <span className="text-white text-sm font-medium">Recommandé</span>
        </div>
      )}
      
      <div className="p-6 sm:p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        
        <div className="mb-6">
          <span className="text-4xl font-bold">{price}€</span>
          <span className="text-gray-500 ml-2">{period}</span>
        </div>
        
        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-primary-500 mr-2 shrink-0 mt-0.5" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        
        <a
          href="#"
          className={`block w-full py-3 px-4 rounded-md text-center font-medium transition-colors ${
            highlighted
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'bg-white text-primary-600 border border-primary-600 hover:bg-primary-50'
          }`}
        >
          {cta}
        </a>
      </div>
    </div>
  );
};

export default PricingCard;