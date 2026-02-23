import { View, StyleSheet } from 'react-native';

type BudgetProgressBarProps = {
  spent: number;
  limit: number;
};

const HEIGHT = 10;
const RADIUS = 999;
const TRACK_COLOR = '#E8EAF0';
const FILL_COLOR = '#2EC4B6'; // brand.secondary
const WARNING_COLOR = '#FF9800'; // status.warning
const ERROR_COLOR = '#F44336'; // status.error
const WARNING_THRESHOLD = 0.85;
const ERROR_THRESHOLD = 1.0;

export default function BudgetProgressBar({ spent, limit }: BudgetProgressBarProps) {
  const progress = limit > 0 ? Math.min(spent / limit, 1) : 0;
  let fillColor = FILL_COLOR;
  if (progress >= ERROR_THRESHOLD) fillColor = ERROR_COLOR;
  else if (progress >= WARNING_THRESHOLD) fillColor = WARNING_COLOR;

  return (
    <View style={styles.track}>
      <View
        style={[
          styles.fill,
          { width: `${progress * 100}%`, backgroundColor: fillColor },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: HEIGHT,
    borderRadius: RADIUS,
    backgroundColor: TRACK_COLOR,
    overflow: 'hidden',
  },
  fill: {
    height: HEIGHT,
    borderRadius: RADIUS,
    minWidth: 0,
  },
});
