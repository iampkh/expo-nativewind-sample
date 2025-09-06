import { TouchableOpacityProps } from 'react-native';

export interface BaseImageCardProps extends TouchableOpacityProps {
  imagePath: string | number;
  title: string;
  description: string;
  className?: string;
  onPress?: () => void;
}

export interface DefaultImageCardProps extends BaseImageCardProps {
  // Default variant specific props can be added here
}

export interface BottomSheetImageCardProps extends BaseImageCardProps {
  imageSize?: number;
}

export type ImageCardVariant = 'default' | 'bottomSheet';

export interface ImageCardProps extends BaseImageCardProps {
  variant?: ImageCardVariant;
  imageSize?: number;
}