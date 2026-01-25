import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

const KnowledgeBaseSection: React.FC = () => {
  const navigate = useNavigate();
  const items = [
    { title: 'Tracking my Package', q: 'How can I track my active ClickBazaar order?' },
    { title: 'Payment Reversals', q: 'What is the timeline for a failed payment refund?' },
    { title: 'Prime Membership Benefits', q: 'Tell me about the January 2026 Prime Elite membership.' }
  ];

  return (
    <ul className="space-y-4 text-sm font-bold text-gray-500">
      {items.map(item => (
        <li
          key={item.title}
          onClick={() => {
            navigate('/#ai-assistant');
          }}
          className="flex items-center gap-2 hover:text-indigo-600 cursor-pointer transition-colors"
        >
          <CheckCircle2 size={16} /> {item.title}
        </li>
      ))}
    </ul>
  );
};

export default KnowledgeBaseSection;
