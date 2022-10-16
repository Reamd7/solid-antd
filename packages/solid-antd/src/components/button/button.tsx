import { Component, createSignal, JSX, JSXElement, Ref, splitProps, useContext, If, Switch, Match } from "solid-js";
import { ConfigContext } from "../config-provider/context";
import DisabledContext from "../config-provider/DisabledContext";
import SizeContext, { SizeType } from "../config-provider/SizeContext";
import { GroupSizeContext } from "./button-group";
import warning from '../_util/warning';

export type ButtonType = "link" | "text" | "primary" | "dashed" | "default" | "ghost";
export type ButtonShape = "circle" | "default" | "round";
export type ButtonHTMLType = "button" | "submit" | "reset"

export type LegacyButtonType = ButtonType | 'danger';

export interface BaseButtonProps {
  type?: ButtonType;
  icon?: JSXElement;
  /**
   * Shape of Button
   *
   * @default default
   */
  shape?: ButtonShape;
  size?: SizeType;
  disabled?: boolean;
  loading?: boolean | { delay?: number };
  prefixCls?: string;
  className?: string;
  ghost?: boolean;
  danger?: boolean;
  block?: boolean;
  children?: JSXElement;
}

// Typescript will make optional not optional if use Pick with union.
// Should change to `AnchorButtonProps | NativeButtonProps` and `any` to `HTMLAnchorElement | HTMLButtonElement` if it fixed.
// ref: https://github.com/ant-design/ant-design/issues/15930
export type AnchorButtonProps = {
  href: string;
  target?: string;
  onClick?: JSX.EventHandler<HTMLAnchorElement, MouseEvent>
  ref?: Ref<HTMLAnchorElement>
} & BaseButtonProps 
& Omit<JSX.AnchorHTMLAttributes<HTMLAnchorElement>, 'type' | 'onClick'| 'ref'>;

export type NativeButtonProps = {
  htmlType?: ButtonHTMLType;
  onClick?: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
  ref?: Ref<HTMLButtonElement>
} & BaseButtonProps 
& Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick' | 'ref'>;

export type ButtonProps = AnchorButtonProps | NativeButtonProps;

function isUnBorderedButtonType(type: ButtonType | undefined) {
  return type === 'text' || type === 'link';
}

type Loading = number | boolean;

const AnchorButton: Component<AnchorButtonProps> = (props) => {
  const [
    local, rest
  ] = splitProps(props, [
    "loading",
    "prefixCls",
    "type",
    "danger",
    "shape",
    "size",
    "disabled",
    "className",
    "children",
    "icon",
    "ghost",
    "block",
  ])
  return null
}

const NativeButton: Component<NativeButtonProps> = (props) => {
  const [
    local, rest
  ] = splitProps(props, [
    "loading",
    "prefixCls",
    "type",
    "danger",
    "shape",
    "size",
    "disabled",
    "className",
    "children",
    "icon",
    "ghost",
    "block",
    "htmlType"
  ])

  const {
    loading = false,
    prefixCls: customizePrefixCls,
    type = 'default',
    danger,
    shape = 'default',
    size: customizeSize,
    disabled: customDisabled,
    className,
    children,
    icon,
    ghost = false,
    block = false,
    /** If we extract items here, we don't need use omit.js */
    // React does not recognize the `htmlType` prop on a DOM element. Here we pick it out of `rest`.
    htmlType = 'button',
  } = local;

  const { getPrefixCls, autoInsertSpaceInButton, direction } = useContext(ConfigContext);
  const prefixCls = getPrefixCls('btn', customizePrefixCls);

  const size = useContext(SizeContext);
  // ===================== Disabled =====================
  const disabled = useContext(DisabledContext);
  const mergedDisabled = customDisabled ?? disabled;

  const groupSize = useContext(GroupSizeContext);

  const [innerLoading, setLoading] = createSignal<Loading>(!!loading);
  const [hasTwoCNChar, setHasTwoCNChar] = createSignal(false);

  let buttonRef: HTMLButtonElement;
  // const isNeedInserted = () =>
  //   React.Children.count(children) === 1 && !icon && !isUnBorderedButtonType(type);
  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
    const { onClick } = props;
    // https://github.com/ant-design/ant-design/issues/30207
    if (innerLoading() || mergedDisabled) {
      e.preventDefault();
      return;
    }
    (onClick)?.(e);
  };

  warning(
    !(typeof icon === 'string' && icon.length > 2),
    'Button',
    `\`icon\` is using ReactNode instead of string naming in v4. Please check \`${icon}\` at https://ant.design/components/icon`,
  );

  warning(
    !(ghost && isUnBorderedButtonType(type)),
    'Button',
    "`link` or `text` button can't be a `ghost` button.",
  );

  const ButtonNode = <button 
    {...rest}
    type={htmlType} 
    ref={(el) => {
      buttonRef = el;
      if (props.ref instanceof HTMLElement) {
        props.ref = el;
      } else if (props.ref) {
        props.ref(el);
      }
    }}
    disabled={mergedDisabled}
    class={props.className}
    // className={classes}
    onClick={props.onClick}
  >
    {props.children}
  </button>
  return ButtonNode
}

const InternalButton: Component<ButtonProps> = (props) => {
  return <Switch>
    <Match when={'href' in props && props.href}>
      <AnchorButton {...props as AnchorButtonProps} />
    </Match>
    <Match when={(props as AnchorButtonProps).href === undefined}>
      <NativeButton {...props as NativeButtonProps} />
    </Match>
  </Switch>

}

export default InternalButton