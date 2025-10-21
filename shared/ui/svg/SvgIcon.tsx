import * as Icons from '@/assets/icons';

import { IconProps } from '../svg/icon';

export function Icon({ name, size, onPress }: IconProps) {
  const iconsMap = Icons as unknown as Record<string, React.ComponentType<any>>;
  const SvgIcon = iconsMap[name];

  if (!SvgIcon) {
    console.error(`Invalid icon name: "${name}". Please check Icons object.`);
    return null; // 유효하지 않은 아이콘 이름 처리
  }

  // svg 아이콘은 정사각형으로 제작했기 때문에 width, height값 둘다 size 적용
  const width = size;
  const height = size;

  const sizeProps = {
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
  };

  return <SvgIcon {...sizeProps} onPress={onPress} />;
}

