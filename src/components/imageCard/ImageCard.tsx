import React from 'react';
import { DefaultVariant } from './DefaultVariant';
import { BottomSheetVariant } from './BottomSheetVariant';
import { ImageCardProps } from './types';

export function ImageCard({
  variant = 'default',
  ...props
}: ImageCardProps) {
  switch (variant) {
    case 'bottomSheet':
      return <BottomSheetVariant {...props} />;
    case 'default':
    default:
      return <DefaultVariant {...props} />;
  }
}