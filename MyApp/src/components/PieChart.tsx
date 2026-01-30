import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { PieSegment } from '../types';

interface PieChartProps {
  data: PieSegment[];
  title?: string;
}

const PieChart: React.FC<PieChartProps> = ({ data, title = 'Spending Overview' }) => (
  <View style={styles.section}>
    <Text style={styles.title}>{title}</Text>
    <View style={styles.chartContainer}>
      <View style={styles.chart}>
        {data.map((segment, index) => (
          <View
            key={index}
            style={[
              styles.segment,
              { flex: segment.value, backgroundColor: segment.color },
            ]}
          />
        ))}
      </View>
    </View>
    <View style={styles.legend}>
      {data.map((segment, index) => (
        <View key={index} style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: segment.color }]} />
          <Text style={styles.legendText}>{segment.value}%</Text>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 12,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  chart: {
    flexDirection: 'row',
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
  segment: {
    height: '100%',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#555',
  },
});

export default PieChart;
