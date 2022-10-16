import { createContext, JSX, JSXElement } from 'solid-js';
import type { SizeType } from '../config-provider/SizeContext';


export interface ButtonGroupProps {
  size?: SizeType;
  style?: JSX.CSSProperties;
  className?: string;
  prefixCls?: string;
  children?: JSXElement;
}

export const GroupSizeContext = createContext<SizeType | undefined>(undefined);
