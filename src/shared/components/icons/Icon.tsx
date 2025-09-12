/**
 * Icon Component
 * 
 * Centralized icon system for the entire application
 * Supports Expo vector icons (Ionicons, MaterialIcons, etc.) and custom SVGs
 * 
 * Usage: <Icon name="home" size={24} color="#000" />
 */

import React from "react";
import { View, ViewStyle } from "react-native";
import { Ionicons, MaterialIcons, AntDesign, Feather, FontAwesome, Entypo } from "@expo/vector-icons";

// Custom SVG imports (add your custom SVGs here)
// import Logo from "./custom/Logo.svg";
// import Settings from "./custom/Settings.svg";

// Define all available icon names
export type IconName =
  // Navigation & General
  | "home"
  | "back"
  | "forward"
  | "close"
  | "menu"
  | "more-vertical"
  | "more-horizontal"
  | "search"
  | "filter"
  | "refresh"
  | "external-link"
  
  // User & Account
  | "user"
  | "users"
  | "user-plus"
  | "user-minus"
  | "profile"
  | "avatar"
  
  // Communication & Chat
  | "message"
  | "messages"
  | "chat"
  | "send"
  | "phone"
  | "video"
  | "mail"
  | "notification"
  | "bell"
  
  // Actions
  | "add"
  | "plus"
  | "minus"
  | "edit"
  | "delete"
  | "trash"
  | "save"
  | "copy"
  | "share"
  | "download"
  | "upload"
  | "like"
  | "heart"
  | "star"
  | "bookmark"
  
  // Status & Feedback
  | "check"
  | "checkmark"
  | "close-circle"
  | "alert"
  | "warning"
  | "info"
  | "help"
  | "success"
  | "error"
  
  // Media & Files
  | "image"
  | "camera"
  | "video-camera"
  | "file"
  | "folder"
  | "attachment"
  | "mic"
  | "speaker"
  | "volume-up"
  | "volume-down"
  | "mute"
  
  // Settings & Configuration
  | "settings"
  | "gear"
  | "options"
  | "preferences"
  | "admin"
  | "security"
  | "privacy"
  | "lock"
  | "unlock"
  | "key"
  
  // Navigation & Direction
  | "arrow-up"
  | "arrow-down"
  | "arrow-left"
  | "arrow-right"
  | "chevron-up"
  | "chevron-down"
  | "chevron-left"
  | "chevron-right"
  
  // Business & Finance
  | "dollar"
  | "credit-card"
  | "bank"
  | "receipt"
  | "calculator"
  | "chart"
  | "trending-up"
  | "trending-down"
  
  // Time & Calendar
  | "calendar"
  | "clock"
  | "time"
  | "schedule"
  | "timer"
  | "stopwatch"
  
  // Tasks & Productivity
  | "task"
  | "todo"
  | "checklist"
  | "clipboard"
  | "document"
  | "note"
  | "tag"
  | "flag"
  
  // Social & Community
  | "community"
  | "group"
  | "team"
  | "collaboration"
  | "handshake"
  | "thumbs-up"
  | "thumbs-down"
  
  // Technology & Code
  | "code"
  | "terminal"
  | "database"
  | "server"
  | "cloud"
  | "wifi"
  | "bluetooth"
  | "battery"
  
  // Location & Maps
  | "location"
  | "map"
  | "pin"
  | "compass"
  | "globe"
  
  // Theme & Display
  | "sun"
  | "moon"
  | "eye"
  | "eye-off"
  | "color-palette"
  | "brightness"
  
  // Shopping & E-commerce
  | "cart"
  | "bag"
  | "price-tag"
  | "gift"
  | "coupon"
  
  // Health & Fitness
  | "heart-pulse"
  | "activity"
  | "fitness"
  | "health"
  
  // Custom App Icons (add your custom SVGs here)
  | "logo"
  | "app-icon";

// Icon registry mapping icon names to their respective components
const iconRegistry: Record<IconName, (props: any) => React.JSX.Element | null> = {
  // Navigation & General
  home: (props) => <Ionicons name="home" {...props} />,
  back: (props) => <Ionicons name="arrow-back" {...props} />,
  forward: (props) => <Ionicons name="arrow-forward" {...props} />,
  close: (props) => <Ionicons name="close" {...props} />,
  menu: (props) => <Ionicons name="menu" {...props} />,
  "more-vertical": (props) => <Feather name="more-vertical" {...props} />,
  "more-horizontal": (props) => <Feather name="more-horizontal" {...props} />,
  search: (props) => <Ionicons name="search" {...props} />,
  filter: (props) => <Ionicons name="filter" {...props} />,
  refresh: (props) => <Ionicons name="refresh" {...props} />,
  "external-link": (props) => <Feather name="external-link" {...props} />,
  
  // User & Account
  user: (props) => <Ionicons name="person" {...props} />,
  users: (props) => <Ionicons name="people" {...props} />,
  "user-plus": (props) => <Feather name="user-plus" {...props} />,
  "user-minus": (props) => <Feather name="user-minus" {...props} />,
  profile: (props) => <Ionicons name="person-circle" {...props} />,
  avatar: (props) => <Ionicons name="person-circle-outline" {...props} />,
  
  // Communication & Chat
  message: (props) => <Ionicons name="chatbubble" {...props} />,
  messages: (props) => <Ionicons name="chatbubbles" {...props} />,
  chat: (props) => <Ionicons name="chatbox" {...props} />,
  send: (props) => <Ionicons name="send" {...props} />,
  phone: (props) => <Ionicons name="call" {...props} />,
  video: (props) => <Ionicons name="videocam" {...props} />,
  mail: (props) => <Ionicons name="mail" {...props} />,
  notification: (props) => <Ionicons name="notifications" {...props} />,
  bell: (props) => <Ionicons name="notifications-outline" {...props} />,
  
  // Actions
  add: (props) => <Ionicons name="add" {...props} />,
  plus: (props) => <Ionicons name="add" {...props} />,
  minus: (props) => <Ionicons name="remove" {...props} />,
  edit: (props) => <Ionicons name="create" {...props} />,
  delete: (props) => <Ionicons name="trash" {...props} />,
  trash: (props) => <Ionicons name="trash-outline" {...props} />,
  save: (props) => <Ionicons name="save" {...props} />,
  copy: (props) => <Ionicons name="copy" {...props} />,
  share: (props) => <Ionicons name="share" {...props} />,
  download: (props) => <Ionicons name="download" {...props} />,
  upload: (props) => <Ionicons name="cloud-upload" {...props} />,
  like: (props) => <Ionicons name="thumbs-up" {...props} />,
  heart: (props) => <Ionicons name="heart" {...props} />,
  star: (props) => <Ionicons name="star" {...props} />,
  bookmark: (props) => <Ionicons name="bookmark" {...props} />,
  
  // Status & Feedback
  check: (props) => <Ionicons name="checkmark" {...props} />,
  checkmark: (props) => <Ionicons name="checkmark-circle" {...props} />,
  "close-circle": (props) => <Ionicons name="close-circle" {...props} />,
  alert: (props) => <Ionicons name="alert-circle" {...props} />,
  warning: (props) => <Ionicons name="warning" {...props} />,
  info: (props) => <Ionicons name="information-circle" {...props} />,
  help: (props) => <Ionicons name="help-circle" {...props} />,
  success: (props) => <Ionicons name="checkmark-circle" {...props} />,
  error: (props) => <Ionicons name="close-circle" {...props} />,
  
  // Media & Files
  image: (props) => <Ionicons name="image" {...props} />,
  camera: (props) => <Ionicons name="camera" {...props} />,
  "video-camera": (props) => <Ionicons name="videocam" {...props} />,
  file: (props) => <Ionicons name="document" {...props} />,
  folder: (props) => <Ionicons name="folder" {...props} />,
  attachment: (props) => <Ionicons name="attach" {...props} />,
  mic: (props) => <Ionicons name="mic" {...props} />,
  speaker: (props) => <Ionicons name="volume-high" {...props} />,
  "volume-up": (props) => <Ionicons name="volume-high" {...props} />,
  "volume-down": (props) => <Ionicons name="volume-low" {...props} />,
  mute: (props) => <Ionicons name="volume-mute" {...props} />,
  
  // Settings & Configuration
  settings: (props) => <Ionicons name="settings" {...props} />,
  gear: (props) => <Ionicons name="settings-outline" {...props} />,
  options: (props) => <Ionicons name="options" {...props} />,
  preferences: (props) => <Ionicons name="list" {...props} />,
  admin: (props) => <MaterialIcons name="admin-panel-settings" {...props} />,
  security: (props) => <Ionicons name="shield" {...props} />,
  privacy: (props) => <Ionicons name="eye-off" {...props} />,
  lock: (props) => <Ionicons name="lock-closed" {...props} />,
  unlock: (props) => <Ionicons name="lock-open" {...props} />,
  key: (props) => <Ionicons name="key" {...props} />,
  
  // Navigation & Direction
  "arrow-up": (props) => <Ionicons name="arrow-up" {...props} />,
  "arrow-down": (props) => <Ionicons name="arrow-down" {...props} />,
  "arrow-left": (props) => <Ionicons name="arrow-back" {...props} />,
  "arrow-right": (props) => <Ionicons name="arrow-forward" {...props} />,
  "chevron-up": (props) => <Ionicons name="chevron-up" {...props} />,
  "chevron-down": (props) => <Ionicons name="chevron-down" {...props} />,
  "chevron-left": (props) => <Ionicons name="chevron-back" {...props} />,
  "chevron-right": (props) => <Ionicons name="chevron-forward" {...props} />,
  
  // Business & Finance
  dollar: (props) => <FontAwesome name="dollar" {...props} />,
  "credit-card": (props) => <Ionicons name="card" {...props} />,
  bank: (props) => <FontAwesome name="bank" {...props} />,
  receipt: (props) => <Ionicons name="receipt" {...props} />,
  calculator: (props) => <Ionicons name="calculator" {...props} />,
  chart: (props) => <Ionicons name="bar-chart" {...props} />,
  "trending-up": (props) => <Ionicons name="trending-up" {...props} />,
  "trending-down": (props) => <Ionicons name="trending-down" {...props} />,
  
  // Time & Calendar
  calendar: (props) => <Ionicons name="calendar" {...props} />,
  clock: (props) => <Ionicons name="time" {...props} />,
  time: (props) => <Ionicons name="time-outline" {...props} />,
  schedule: (props) => <Ionicons name="calendar-outline" {...props} />,
  timer: (props) => <Ionicons name="timer" {...props} />,
  stopwatch: (props) => <Ionicons name="stopwatch" {...props} />,
  
  // Tasks & Productivity
  task: (props) => <Ionicons name="checkbox" {...props} />,
  todo: (props) => <Ionicons name="checkbox-outline" {...props} />,
  checklist: (props) => <Ionicons name="list" {...props} />,
  clipboard: (props) => <Ionicons name="clipboard" {...props} />,
  document: (props) => <Ionicons name="document-text" {...props} />,
  note: (props) => <Ionicons name="create" {...props} />,
  tag: (props) => <Ionicons name="pricetag" {...props} />,
  flag: (props) => <Ionicons name="flag" {...props} />,
  
  // Social & Community
  community: (props) => <Ionicons name="people-circle" {...props} />,
  group: (props) => <Ionicons name="people" {...props} />,
  team: (props) => <MaterialIcons name="groups" {...props} />,
  collaboration: (props) => <MaterialIcons name="handshake" {...props} />,
  handshake: (props) => <MaterialIcons name="handshake" {...props} />,
  "thumbs-up": (props) => <Ionicons name="thumbs-up" {...props} />,
  "thumbs-down": (props) => <Ionicons name="thumbs-down" {...props} />,
  
  // Technology & Code
  code: (props) => <Ionicons name="code-slash" {...props} />,
  terminal: (props) => <Ionicons name="terminal" {...props} />,
  database: (props) => <Ionicons name="server" {...props} />,
  server: (props) => <Ionicons name="server-outline" {...props} />,
  cloud: (props) => <Ionicons name="cloud" {...props} />,
  wifi: (props) => <Ionicons name="wifi" {...props} />,
  bluetooth: (props) => <Ionicons name="bluetooth" {...props} />,
  battery: (props) => <Ionicons name="battery-full" {...props} />,
  
  // Location & Maps
  location: (props) => <Ionicons name="location" {...props} />,
  map: (props) => <Ionicons name="map" {...props} />,
  pin: (props) => <Ionicons name="location-outline" {...props} />,
  compass: (props) => <Ionicons name="compass" {...props} />,
  globe: (props) => <Ionicons name="globe" {...props} />,
  
  // Theme & Display
  sun: (props) => <Ionicons name="sunny" {...props} />,
  moon: (props) => <Ionicons name="moon" {...props} />,
  eye: (props) => <Ionicons name="eye" {...props} />,
  "eye-off": (props) => <Ionicons name="eye-off" {...props} />,
  "color-palette": (props) => <Ionicons name="color-palette" {...props} />,
  brightness: (props) => <Ionicons name="sunny-outline" {...props} />,
  
  // Shopping & E-commerce
  cart: (props) => <Ionicons name="cart" {...props} />,
  bag: (props) => <Ionicons name="bag" {...props} />,
  "price-tag": (props) => <Ionicons name="pricetag" {...props} />,
  gift: (props) => <Ionicons name="gift" {...props} />,
  coupon: (props) => <MaterialIcons name="local-offer" {...props} />,
  
  // Health & Fitness
  "heart-pulse": (props) => <FontAwesome name="heartbeat" {...props} />,
  activity: (props) => <Ionicons name="pulse" {...props} />,
  fitness: (props) => <Ionicons name="fitness" {...props} />,
  health: (props) => <Ionicons name="medical" {...props} />,
  
  // Custom App Icons (placeholder for custom SVGs)
  logo: (props) => <Ionicons name="logo-react" {...props} />, // Replace with custom Logo SVG
  "app-icon": (props) => <Ionicons name="apps" {...props} />, // Replace with custom App Icon SVG
};

export type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  style?: ViewStyle;
  testID?: string;
};

/**
 * Central Icon component
 * 
 * @param name - The icon name from IconName type
 * @param size - Size of the icon (default: 24)
 * @param color - Color of the icon (default: "black")
 * @param style - Additional style properties
 * @param testID - Test identifier for testing
 */
export const Icon = ({ 
  name, 
  size = 24, 
  color = "black", 
  style,
  testID 
}: IconProps) => {
  const IconComponent = iconRegistry[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in registry`);
    return null;
  }

  return (
    <View style={style} testID={testID}>
      <IconComponent 
        width={size} 
        height={size} 
        size={size}
        fill={color} 
        color={color} 
      />
    </View>
  );
};