import * as Icons from "@/assets/icons/index";
import { SvgProps } from "react-native-svg";

export type IconProps = SvgProps & {
  name: keyof typeof Icons; // keyof typeof Icons: Icons 객체의 key들을 union type으로 만들어줌
  size?: number;
  onPress?: () => void;
};

export type IconName = keyof typeof Icons;
