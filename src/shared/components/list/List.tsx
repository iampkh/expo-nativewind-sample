import React from 'react';
import { SimpleListVariant } from './SimpleListVariant';
import { GroupedListVariant } from './GroupedListVariant';
import { ListProps } from './types';

export function List<T, K = string>(props: ListProps<T, K>) {
  switch (props.variant) {
    case 'simple':
      return <SimpleListVariant {...props} />;
    case 'grouped':
      return <GroupedListVariant {...props} />;
    default:
      return <SimpleListVariant {...(props as any)} />;
  }
}