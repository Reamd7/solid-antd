import * as React from 'solid-js';
import { JSXElement } from 'solid-js';

export type SizeType = 'small' | 'middle' | 'large' | undefined;

const SizeContext = React.createContext<SizeType>(undefined);

export interface SizeContextProps {
  size?: SizeType;
  children?: JSXElement;
}

export const SizeContextProvider = ({ children, size }: SizeContextProps) => {
  const originSize = React.useContext(SizeContext);
  return <SizeContext.Provider value={size || originSize}>{children}</SizeContext.Provider>
}

export default SizeContext;
