import { useMemo, useState } from "react";
import {
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { useTheme } from "../theme";
import { cn } from "../utils/cn";

export interface DateRange {
  from?: Date;
  to?: Date;
}

export type CalendarMode = "single" | "range";

export interface CalendarProps {
  mode?: CalendarMode;
  selected?: Date | DateRange;
  onSelect?: (value: Date | DateRange | undefined) => void;
  month?: Date;
  onMonthChange?: (month: Date) => void;
  disabled?: (date: Date) => boolean;
  style?: StyleProp<ViewStyle>;
}

export function Calendar({
  mode = "single",
  selected,
  onSelect,
  month: monthProp,
  onMonthChange,
  disabled,
  style,
}: CalendarProps) {
  const { theme, colors } = useTheme();
  const [internalMonth, setInternalMonth] = useState(new Date());
  const month = monthProp ?? internalMonth;

  const setMonth = (m: Date) => {
    if (!monthProp) setInternalMonth(m);
    onMonthChange?.(m);
  };

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [month]);

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const isSelected = (day: Date) => {
    if (mode === "single" && selected instanceof Date) {
      return isSameDay(day, selected);
    }
    if (mode === "range" && selected && !(selected instanceof Date)) {
      if (selected.from && isSameDay(day, selected.from)) return true;
      if (selected.to && isSameDay(day, selected.to)) return true;
    }
    return false;
  };

  const isInRange = (day: Date) => {
    if (mode !== "range" || !selected || selected instanceof Date) return false;
    if (!selected.from || !selected.to) return false;
    return day >= selected.from && day <= selected.to;
  };

  const handleSelect = (day: Date) => {
    if (disabled?.(day)) return;
    if (mode === "single") {
      onSelect?.(day);
      return;
    }
    const range = (selected && !(selected instanceof Date)
      ? selected
      : {}) as DateRange;
    if (!range.from || (range.from && range.to)) {
      onSelect?.({ from: day, to: undefined });
    } else if (day < range.from) {
      onSelect?.({ from: day, to: range.from });
    } else {
      onSelect?.({ from: range.from, to: day });
    }
  };

  return (
    <View
      style={cn(
        {
          padding: theme.spacing[3],
          borderRadius: theme.radii["2xl"],
          backgroundColor: colors.glassChromeBgEnv,
          borderWidth: 1,
          borderColor: colors.glassChromeBorder,
          width: 320,
        },
        style,
      )}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: theme.spacing[3],
        }}
      >
        <Pressable
          onPress={() => setMonth(subMonths(month, 1))}
          accessibilityLabel="Previous month"
          style={{
            width: 36,
            height: 36,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: theme.radii.lg,
          }}
        >
          <Text style={{ color: colors.foreground, fontSize: 18 }}>‹</Text>
        </Pressable>
        <Text
          style={{
            color: colors.foreground,
            fontWeight: theme.fontWeights.semibold,
            fontSize: theme.fontSizes.sm,
          }}
        >
          {format(month, "MMMM yyyy")}
        </Text>
        <Pressable
          onPress={() => setMonth(addMonths(month, 1))}
          accessibilityLabel="Next month"
          style={{
            width: 36,
            height: 36,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: theme.radii.lg,
          }}
        >
          <Text style={{ color: colors.foreground, fontSize: 18 }}>›</Text>
        </Pressable>
      </View>

      <View style={{ flexDirection: "row", marginBottom: theme.spacing[1] }}>
        {weekDays.map((d) => (
          <View key={d} style={{ flex: 1, alignItems: "center", paddingVertical: 4 }}>
            <Text
              style={{
                color: colors.mutedForeground,
                fontSize: theme.fontSizes.xs,
                fontWeight: theme.fontWeights.medium,
              }}
            >
              {d}
            </Text>
          </View>
        ))}
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {days.map((day) => {
          const outside = !isSameMonth(day, month);
          const selectedDay = isSelected(day);
          const inRange = isInRange(day);
          const today = isToday(day);
          const isDisabled = disabled?.(day);

          return (
            <Pressable
              key={day.toISOString()}
              disabled={isDisabled}
              onPress={() => handleSelect(day)}
              style={{
                width: `${100 / 7}%`,
                aspectRatio: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: selectedDay
                  ? colors.primary
                  : inRange
                    ? "rgba(128,128,128,0.15)"
                    : "transparent",
                borderRadius: theme.radii.lg,
                opacity: outside ? 0.35 : isDisabled ? 0.35 : 1,
                borderWidth: today && !selectedDay ? 1 : 0,
                borderColor: colors.ring,
              }}
            >
              <Text
                style={{
                  color: selectedDay
                    ? colors.primaryForeground
                    : colors.foreground,
                  fontSize: theme.fontSizes.sm,
                  fontWeight: selectedDay
                    ? theme.fontWeights.semibold
                    : theme.fontWeights.normal,
                }}
              >
                {format(day, "d")}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function CalendarDayButton() {
  return null;
}
