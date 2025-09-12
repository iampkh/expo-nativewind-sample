/**
 * AnimatedIcon Component
 * 
 * Animated version of the centralized icon system
 * Supports rotation, bounce, pulse, and fade animations
 * 
 * Usage: <AnimatedIcon name="heart" size={24} color="#000" animation="bounce" />
 */

import React, { useEffect, useRef } from "react";
import { Animated, ViewStyle } from "react-native";
import { Icon, IconName, IconProps } from "./Icon";

type AnimationType = 
  | "rotate" 
  | "bounce" 
  | "pulse" 
  | "fade" 
  | "scale" 
  | "shake";

export type AnimatedIconProps = Omit<IconProps, 'style'> & {
  animation?: AnimationType;
  duration?: number;
  loop?: boolean;
  style?: ViewStyle;
};

/**
 * AnimatedIcon component with various animation types
 * 
 * @param name - The icon name from IconName type
 * @param size - Size of the icon (default: 24)
 * @param color - Color of the icon (default: "black")
 * @param animation - Type of animation to apply
 * @param duration - Animation duration in milliseconds (default: 1000)
 * @param loop - Whether to loop the animation (default: true)
 * @param style - Additional style properties
 * @param testID - Test identifier for testing
 */
export const AnimatedIcon = ({
  name,
  size = 24,
  color = "black",
  animation,
  duration = 1000,
  loop = true,
  style,
  testID,
}: AnimatedIconProps) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animation) return;

    const createAnimation = () => {
      switch (animation) {
        case "rotate":
          return Animated.timing(animatedValue, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          });

        case "bounce":
          return Animated.sequence([
            Animated.timing(animatedValue, {
              toValue: 1,
              duration: duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
              toValue: 0,
              duration: duration / 2,
              useNativeDriver: true,
            }),
          ]);

        case "pulse":
          return Animated.sequence([
            Animated.timing(animatedValue, {
              toValue: 1,
              duration: duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
              toValue: 0,
              duration: duration / 2,
              useNativeDriver: true,
            }),
          ]);

        case "fade":
          return Animated.sequence([
            Animated.timing(animatedValue, {
              toValue: 1,
              duration: duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
              toValue: 0,
              duration: duration / 2,
              useNativeDriver: true,
            }),
          ]);

        case "scale":
          return Animated.sequence([
            Animated.timing(animatedValue, {
              toValue: 1,
              duration: duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
              toValue: 0,
              duration: duration / 2,
              useNativeDriver: true,
            }),
          ]);

        case "shake":
          return Animated.sequence([
            Animated.timing(animatedValue, {
              toValue: 1,
              duration: duration / 8,
              useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
              toValue: -1,
              duration: duration / 4,
              useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
              toValue: 1,
              duration: duration / 4,
              useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
              toValue: -1,
              duration: duration / 4,
              useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
              toValue: 0,
              duration: duration / 8,
              useNativeDriver: true,
            }),
          ]);

        default:
          return null;
      }
    };

    const runAnimation = () => {
      const anim = createAnimation();
      if (anim) {
        if (loop) {
          Animated.loop(anim).start();
        } else {
          anim.start();
        }
      }
    };

    animatedValue.setValue(0);
    runAnimation();

    return () => {
      animatedValue.stopAnimation();
    };
  }, [animation, duration, loop, animatedValue]);

  const getAnimatedStyle = (): ViewStyle => {
    if (!animation) return {};

    switch (animation) {
      case "rotate":
        return {
          transform: [
            {
              rotate: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "360deg"],
              }),
            },
          ],
        };

      case "bounce":
        return {
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -10],
              }),
            },
          ],
        };

      case "pulse":
        return {
          opacity: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.5, 1],
          }),
        };

      case "fade":
        return {
          opacity: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 1],
          }),
        };

      case "scale":
        return {
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1.2],
              }),
            },
          ],
        };

      case "shake":
        return {
          transform: [
            {
              translateX: animatedValue.interpolate({
                inputRange: [-1, 1],
                outputRange: [-5, 5],
              }),
            },
          ],
        };

      default:
        return {};
    }
  };

  const combinedStyle = [
    getAnimatedStyle(),
    style,
  ];

  return (
    <Animated.View style={combinedStyle} testID={testID}>
      <Icon
        name={name}
        size={size}
        color={color}
      />
    </Animated.View>
  );
};