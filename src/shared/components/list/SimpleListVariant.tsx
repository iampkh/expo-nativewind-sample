import React from 'react';
import { ScrollView, View } from 'react-native';
import { SimpleListProps } from './types';

export function SimpleListVariant<T>({
  data,
  renderItem,
  keyExtractor,
  className = '',
  contentContainerClassName = '',
  showSeparator = false,
  separatorClassName = 'h-px bg-gray-200',
}: SimpleListProps<T>) {
  const defaultKeyExtractor = (item: T, index: number) => 
    keyExtractor ? keyExtractor(item, index) : index.toString();

  return (
    <ScrollView className={className} contentContainerStyle={{ flexGrow: 1 }}>
      <View className={contentContainerClassName}>
        {data.map((item, index) => (
          <React.Fragment key={defaultKeyExtractor(item, index)}>
            {renderItem(item, index)}
            {showSeparator && index < data.length - 1 && (
              <View className={separatorClassName} />
            )}
          </React.Fragment>
        ))}
      </View>
    </ScrollView>
  );
}