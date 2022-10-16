import * as React from 'solid-js';
import { JSXElement } from 'solid-js';

export type DisabledType = true | false | undefined;

const DisabledContext = React.createContext<DisabledType>(false);

export interface DisabledContextProps {
  disabled?: DisabledType;
  children?: JSXElement;
}

export const DisabledContextProvider: React.Component<DisabledContextProps> = ({ children, disabled }) => {
  const originDisabled = React.useContext(DisabledContext);
  return (
    <DisabledContext.Provider value={disabled || originDisabled}>
      {children}
    </DisabledContext.Provider>
  );
};

export default DisabledContext;
