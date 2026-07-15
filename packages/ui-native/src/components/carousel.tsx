import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  Text,
  View,
  type ListRenderItemInfo,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
  type ViewToken,
} from "react-native";
import { useTheme } from "../theme";
import { cn } from "../utils/cn";

interface CarouselContextValue {
  index: number;
  setIndex: (i: number) => void;
  scrollTo: (i: number) => void;
  count: number;
  setCount: (n: number) => void;
  itemWidth: number;
}

const CarouselContext = createContext<CarouselContextValue | null>(null);

function useCarousel() {
  const ctx = useContext(CarouselContext);
  if (!ctx) throw new Error("Carousel components must be used within Carousel");
  return ctx;
}

export interface CarouselProps extends ViewProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  itemWidth?: number;
}

export function Carousel({
  children,
  style,
  itemWidth = Dimensions.get("window").width - 48,
  ...props
}: CarouselProps) {
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const listRef = useRef<FlatList>(null);

  const scrollTo = useCallback(
    (i: number) => {
      listRef.current?.scrollToIndex({ index: i, animated: true });
      setIndex(i);
    },
    [],
  );

  return (
    <CarouselContext.Provider
      value={{ index, setIndex, scrollTo, count, setCount, itemWidth }}
    >
      <View style={cn({ position: "relative" }, style)} {...props}>
        {/* inject list ref via CarouselContent */}
        <CarouselListBridge listRef={listRef}>{children}</CarouselListBridge>
      </View>
    </CarouselContext.Provider>
  );
}

const ListRefContext = createContext<React.RefObject<FlatList | null> | null>(
  null,
);

function CarouselListBridge({
  listRef,
  children,
}: {
  listRef: React.RefObject<FlatList | null>;
  children?: ReactNode;
}) {
  return (
    <ListRefContext.Provider value={listRef}>{children}</ListRefContext.Provider>
  );
}

export interface CarouselContentProps {
  data?: ReactNode[];
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Pass either `data` as an array of slides, or children (each child = one slide).
 */
export function CarouselContent({ data, children, style }: CarouselContentProps) {
  const ctx = useCarousel();
  const listRef = useContext(ListRefContext);
  const slides =
    data ??
    (Array.isArray(children) ? children : children != null ? [children] : []);

  const { setCount } = ctx;
  useEffect(() => {
    setCount(slides.length);
  }, [slides.length, setCount]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const first = viewableItems[0];
      if (first?.index != null) ctx.setIndex(first.index);
    },
  ).current;

  return (
    <FlatList
      ref={listRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      data={slides}
      keyExtractor={(_, i) => String(i)}
      style={style}
      snapToInterval={ctx.itemWidth}
      decelerationRate="fast"
      onMomentumScrollEnd={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const i = Math.round(
          e.nativeEvent.contentOffset.x / Math.max(1, ctx.itemWidth),
        );
        ctx.setIndex(i);
      }}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
      renderItem={({ item }: ListRenderItemInfo<ReactNode>) => (
        <View style={{ width: ctx.itemWidth }}>{item}</View>
      )}
      getItemLayout={(_, index) => ({
        length: ctx.itemWidth,
        offset: ctx.itemWidth * index,
        index,
      })}
    />
  );
}

export function CarouselItem({
  children,
  style,
}: {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const ctx = useCarousel();
  return <View style={cn({ width: ctx.itemWidth }, style)}>{children}</View>;
}

export function CarouselPrevious({
  style,
}: {
  style?: StyleProp<ViewStyle>;
}) {
  const { theme, colors } = useTheme();
  const ctx = useCarousel();
  const disabled = ctx.index <= 0;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Previous slide"
      disabled={disabled}
      onPress={() => ctx.scrollTo(Math.max(0, ctx.index - 1))}
      style={cn(
        {
          position: "absolute",
          left: 8,
          top: "45%",
          width: 36,
          height: 36,
          borderRadius: theme.radii.full,
          backgroundColor: colors.glassChromeBgEnv,
          borderWidth: 1,
          borderColor: colors.glassChromeBorder,
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.4 : 1,
          zIndex: 2,
        },
        style,
      )}
    >
      <Text style={{ color: colors.foreground }}>‹</Text>
    </Pressable>
  );
}

export function CarouselNext({ style }: { style?: StyleProp<ViewStyle> }) {
  const { theme, colors } = useTheme();
  const ctx = useCarousel();
  const disabled = ctx.index >= ctx.count - 1;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Next slide"
      disabled={disabled}
      onPress={() =>
        ctx.scrollTo(Math.min(ctx.count - 1, ctx.index + 1))
      }
      style={cn(
        {
          position: "absolute",
          right: 8,
          top: "45%",
          width: 36,
          height: 36,
          borderRadius: theme.radii.full,
          backgroundColor: colors.glassChromeBgEnv,
          borderWidth: 1,
          borderColor: colors.glassChromeBorder,
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.4 : 1,
          zIndex: 2,
        },
        style,
      )}
    >
      <Text style={{ color: colors.foreground }}>›</Text>
    </Pressable>
  );
}

export type CarouselApi = {
  index: number;
  scrollTo: (i: number) => void;
  count: number;
};

export function useCarouselApi(): CarouselApi {
  const ctx = useCarousel();
  return { index: ctx.index, scrollTo: ctx.scrollTo, count: ctx.count };
}
