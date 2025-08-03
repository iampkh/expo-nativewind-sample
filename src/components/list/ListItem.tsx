import React from 'react';
import { DefaultVariant } from './DefaultVariant';
import { NoteVariant } from './NoteVariant';
import { TodoVariant } from './TodoVariant';
import { ContactVariant } from './ContactVariant';
import { ListItemProps } from './types';

export function ListItem({
  variant = 'default',
  completed = false,
  ...props
}: ListItemProps) {
  switch (variant) {
    case 'note':
      return <NoteVariant {...props} completed={completed} />;
    case 'todo':
      return <TodoVariant {...props} completed={completed} />;
    case 'contact':
      return <ContactVariant {...props} />;
    case 'default':
    default:
      return <DefaultVariant {...props} />;
  }
}