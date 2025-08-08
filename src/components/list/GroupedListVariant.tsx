import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { GroupedListProps } from './types';

export function GroupedListVariant<T, K = string>({
  data,
  renderItem,
  keyExtractor,
  groupBy,
  renderGroupHeader,
  className = '',
  contentContainerClassName = '',
  showSeparator = false,
  separatorClassName = 'h-px bg-gray-200',
  groupHeaderClassName = 'px-4 py-2 bg-gray-50',
}: GroupedListProps<T, K>) {
  const defaultKeyExtractor = (item: T, index: number) => 
    keyExtractor ? keyExtractor(item, index) : index.toString();

  const groupedData = React.useMemo(() => {
    const groups = new Map<K, T[]>();
    
    data.forEach((item) => {
      const groupKey = groupBy(item);
      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(item);
    });
    
    return Array.from(groups.entries()).map(([key, items]) => ({
      groupKey: key,
      items,
    }));
  }, [data, groupBy]);

  const defaultRenderGroupHeader = (groupKey: K) => (
    <View className={groupHeaderClassName}>
      <Text className="text-sm font-medium text-gray-700">
        {String(groupKey)}
      </Text>
    </View>
  );

  return (
    <ScrollView className={className} contentContainerStyle={{ flexGrow: 1 }}>
      <View className={contentContainerClassName}>
        {groupedData.map(({ groupKey, items }, groupIndex) => (
          <View key={String(groupKey)}>
            {renderGroupHeader 
              ? renderGroupHeader(groupKey, items)
              : defaultRenderGroupHeader(groupKey)
            }
            {items.map((item, itemIndex) => {
              const globalIndex = data.indexOf(item);
              return (
                <React.Fragment key={defaultKeyExtractor(item, globalIndex)}>
                  {renderItem(item, globalIndex)}
                  {showSeparator && itemIndex < items.length - 1 && (
                    <View className={separatorClassName} />
                  )}
                </React.Fragment>
              );
            })}
            {showSeparator && groupIndex < groupedData.length - 1 && (
              <View className="h-2 bg-gray-100" />
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}