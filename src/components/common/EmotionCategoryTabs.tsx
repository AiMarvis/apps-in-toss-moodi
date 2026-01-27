import type { EmotionCategory } from '../../types/emotion';
import './EmotionCategoryTabs.css';

interface EmotionCategoryTabsProps {
  selectedCategory: EmotionCategory;
  onCategoryChange: (category: EmotionCategory) => void;
  disabled?: boolean;
}

const CATEGORY_LABELS: Record<EmotionCategory, { label: string; emoji: string }> = {
  positive: { label: '긍정', emoji: '😊' },
  neutral: { label: '중립', emoji: '😌' },
  negative: { label: '부정', emoji: '😢' },
};

const CATEGORY_ORDER: EmotionCategory[] = ['positive', 'neutral', 'negative'];

export const EmotionCategoryTabs = ({
  selectedCategory,
  onCategoryChange,
  disabled = false,
}: EmotionCategoryTabsProps) => {
  return (
    <div className="emotion-category-tabs" role="tablist">
      {CATEGORY_ORDER.map((category) => {
        const { label, emoji } = CATEGORY_LABELS[category];
        const isSelected = selectedCategory === category;

        return (
          <button
            key={category}
            role="tab"
            aria-selected={isSelected}
            className={`category-tab ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
            onClick={() => onCategoryChange(category)}
            disabled={disabled}
          >
            <span className="category-emoji">{emoji}</span>
            <span className="category-label">{label}</span>
          </button>
        );
      })}
    </div>
  );
};
