import React from 'react';
import { ScrollView, View } from 'react-native';
import { GridListProps } from './types';

export function GridListVariant<T>({
  data,
  renderItem,
  keyExtractor,
  columns = 2,
  className = '',
  contentContainerClassName = '',
  showSeparator = false,
  separatorClassName = 'h-px bg-gray-200',
  itemSpacing = 'gap-2',
  rowSpacing = 'gap-2',
}: GridListProps<T>) {
  const defaultKeyExtractor = (item: T, index: number) => 
    keyExtractor ? keyExtractor(item, index) : index.toString();

  // Split data into rows based on columns
  const gridData = React.useMemo(() => {
    const rows: T[][] = [];
    for (let i = 0; i < data.length; i += columns) {
      rows.push(data.slice(i, i + columns));
    }
    return rows;
  }, [data, columns]);

  return (
    <ScrollView className={className} contentContainerStyle={{ flexGrow: 1 }}>
      <View className={contentContainerClassName}>
        <View className={`flex-col ${rowSpacing}`}>
          {gridData.map((row, rowIndex) => (
            <React.Fragment key={`row-${rowIndex}`}>
              <View className={`flex-row ${itemSpacing}`} style={{ flex: 1 }}>
                {row.map((item, itemIndex) => {
                  const globalIndex = rowIndex * columns + itemIndex;
                  const itemKey = defaultKeyExtractor(item, globalIndex);
                  
                  return (
                    <View 
                      key={itemKey} 
                      className="flex-1"
                      style={{ 
                        flexBasis: `${100 / columns}%`,
                        maxWidth: `${100 / columns}%`
                      }}
                    >
                      {renderItem(item, globalIndex)}
                    </View>
                  );
                })}
                {/* Fill remaining space if last row has fewer items */}
                {row.length < columns && Array.from({ length: columns - row.length }).map((_, emptyIndex) => (
                  <View 
                    key={`empty-${rowIndex}-${emptyIndex}`} 
                    className="flex-1"
                    style={{ 
                      flexBasis: `${100 / columns}%`,
                      maxWidth: `${100 / columns}%`
                    }}
                  />
                ))}
              </View>
              {showSeparator && rowIndex < gridData.length - 1 && (
                <View className={separatorClassName} />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}