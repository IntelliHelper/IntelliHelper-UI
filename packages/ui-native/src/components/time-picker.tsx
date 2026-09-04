import { Input } from "./input";
import { Calendar } from "./calendar";

export function TimePicker({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <Input
      placeholder="09:30"
      keyboardType="numbers-and-punctuation"
      value={value}
      onChangeText={onChange}
    />
  );
}

export function MonthPicker({
  value,
  onChange,
}: {
  value?: Date;
  onChange?: (value: Date | undefined) => void;
}) {
  return (
    <Calendar
      mode="single"
      selected={value}
      onSelect={(next) => onChange?.(next instanceof Date ? next : undefined)}
    />
  );
}

export function DateTimePicker({
  date,
  time,
  onDateChange,
  onTimeChange,
}: {
  date?: Date;
  time?: string;
  onDateChange?: (value: Date | undefined) => void;
  onTimeChange?: (value: string) => void;
}) {
  return (
    <>
      <Calendar
        mode="single"
        selected={date}
        onSelect={(next) => onDateChange?.(next instanceof Date ? next : undefined)}
      />
      <TimePicker value={time} onChange={onTimeChange} />
    </>
  );
}
