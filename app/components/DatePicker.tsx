'use client';
import { useState, useRef, useEffect } from 'react';

interface DatePickerProps {
  name: string;
  endDateName?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  min?: string;
  max?: string;
  lang?: string;
  className?: string;
  /** Show red border when dates missing / invalid */
  error?: boolean;
}

export default function DatePicker({
  name,
  endDateName,
  value = '',
  onChange,
  required = false,
  disabled = false,
  min,
  max,
  lang = 'EN',
  className = '',
  error = false,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value || '');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [yearRangeStart, setYearRangeStart] = useState(new Date().getFullYear() - 50);
  const pickerRef = useRef<HTMLDivElement>(null);

  const d = (val: number | string) => {
    return val;
  };

  useEffect(() => {
    if (value) {
      setSelectedDate(value);
      const date = new Date(value);
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth()));
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: PointerEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('pointerdown', handleClickOutside);
    }
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [isOpen]);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const getDaysInMonth = (date: Date): number => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date): number => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateString = formatDate(newDate);

    if (endDateName) {
      if (!selectedDate || (selectedDate && selectedEndDate)) {
        // Start a new range explicitly
        setSelectedDate(dateString);
        setSelectedEndDate('');
        
        // Update both hidden inputs
        const startInput = document.querySelector(`input[name="${name}"][type="hidden"]`) as HTMLInputElement;
        const endInput = document.querySelector(`input[name="${endDateName}"][type="hidden"]`) as HTMLInputElement;
        if (startInput) {
          startInput.value = dateString;
          startInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
        if (endInput) {
          endInput.value = '';
          endInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      } else {
        // We have start, need end
        if (new Date(dateString) < new Date(selectedDate)) {
          // Clicked before start date -> make it the new start date instead
          setSelectedDate(dateString);
          const startInput = document.querySelector(`input[name="${name}"][type="hidden"]`) as HTMLInputElement;
          if (startInput) {
            startInput.value = dateString;
            startInput.dispatchEvent(new Event('change', { bubbles: true }));
          }
        } else {
          // Valid end date -> Set and close
          setSelectedEndDate(dateString);
          setIsOpen(false);
          
          const startInput = document.querySelector(`input[name="${name}"][type="hidden"]`) as HTMLInputElement;
          const endInput = document.querySelector(`input[name="${endDateName}"][type="hidden"]`) as HTMLInputElement;
          if (startInput) {
            startInput.value = selectedDate;
            startInput.dispatchEvent(new Event('change', { bubbles: true }));
          }
          if (endInput) {
            endInput.value = dateString;
            endInput.dispatchEvent(new Event('change', { bubbles: true }));
          }
          if (onChange) onChange(`${selectedDate} to ${dateString}`);
        }
      }
    } else {
      setSelectedDate(dateString);
      const hiddenInput = document.querySelector(`input[name="${name}"][type="hidden"]`) as HTMLInputElement;
      if (hiddenInput) {
        hiddenInput.value = dateString;
        hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (onChange) onChange(dateString);
      setIsOpen(false);
    }
  };

  const canGoToPrevMonth = (): boolean => {
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
    if (min) {
      const minDate = new Date(min);
      const minMonth = new Date(minDate.getFullYear(), minDate.getMonth());
      return prevMonth >= minMonth;
    }
    return true;
  };

  const canGoToNextMonth = (): boolean => {
    if (!max) return true;
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
    const maxDate = new Date(max);
    const maxMonth = new Date(maxDate.getFullYear(), maxDate.getMonth());
    return nextMonth <= maxMonth;
  };

  const handlePrevMonth = () => canGoToPrevMonth() && setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const handleNextMonth = () => canGoToNextMonth() && setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  const handlePrevYear = () => setYearRangeStart(yearRangeStart - 100);
  const handleNextYear = () => {
    const nextStart = yearRangeStart + 100;
    if (!max) {
      setYearRangeStart(nextStart);
      return;
    }
    if (nextStart <= new Date(max).getFullYear()) {
      setYearRangeStart(nextStart);
    }
  };
  const handleYearSelect = (year: number) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth()));
    setShowYearPicker(false);
    if (year < yearRangeStart || year > yearRangeStart + 99) setYearRangeStart(year - 50);
  };
  const handleMonthSelect = (month: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), month));
    setShowMonthPicker(false);
  };

  const getYearRange = () => {
    const startYear = yearRangeStart;
    const endYear = max ? Math.min(startYear + 99, new Date(max).getFullYear()) : startYear + 99;
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  };

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonths = months;

  const isDateDisabled = (day: number): boolean => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    date.setHours(0, 0, 0, 0);
    if (min) {
      const minDate = new Date(min);
      minDate.setHours(0, 0, 0, 0);
      if (date < minDate) return true;
    }
    if (max) {
      const maxDate = new Date(max);
      maxDate.setHours(23, 59, 59, 999);
      if (date > maxDate) return true;
    }
    return false;
  };

  const isDateSelected = (day: number): boolean => {
    const str = formatDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    return str === selectedDate || str === selectedEndDate;
  };

  const isDateInRange = (day: number): boolean => {
    if (!endDateName || !selectedDate || !selectedEndDate) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date > new Date(selectedDate) && date < new Date(selectedEndDate);
  };

  const isToday = (day: number): boolean => formatDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)) === formatDate(new Date());

  const getDisplayValue = () => {
    const format = (dStr: string) => {
      const date = new Date(dStr);
      const day = date.getDate();
      const month = currentMonths[date.getMonth()];
      const year = date.getFullYear();
      
      const formatted = `${month} ${day}, ${year}`;
      return d(formatted);
    };
    if (endDateName) {
      if (selectedDate && selectedEndDate) return `${format(selectedDate)} - ${format(selectedEndDate)}`;
      if (selectedDate) return format(selectedDate);
      return '';
    }
    return selectedDate ? format(selectedDate) : '';
  };

  const displayValue = getDisplayValue();

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="w-9 h-9 sm:w-10 sm:h-10" />);
  
  for (let day = 1; day <= daysInMonth; day++) {
    const disabled = isDateDisabled(day);
    const selected = isDateSelected(day);
    const inRange = isDateInRange(day);
    const today = isToday(day);
    days.push(
      <button
        key={day}
        type="button"
        onClick={() => !disabled && handleDateSelect(day)}
        disabled={disabled}
        className={`
          w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-medium transition-all
          ${disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-rose-50 cursor-pointer'}
          ${selected ? 'bg-[#FF385C] text-white hover:bg-[#E31C5F]' : ''}
          ${inRange && !selected ? 'bg-rose-50 text-[#222222] font-semibold' : ''}
          ${today && !selected && !inRange ? 'bg-rose-100 text-[#E31C5F] font-semibold' : ''}
          ${!disabled && !selected && !today && !inRange ? 'hover:bg-gray-100' : ''}
        `}
      >
        {d(day)}
      </button>
    );
  }

  return (
    <div ref={pickerRef} className={`relative min-w-0 w-full ${className}`}>
      <input type="hidden" name={name} value={selectedDate} required={required} disabled={disabled} />
      {endDateName && (
        <input type="hidden" name={endDateName} value={selectedEndDate} required={required} disabled={disabled} />
      )}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!disabled) setIsOpen(!isOpen);
        }}
        disabled={disabled}
        className={`
          w-full min-h-[3rem] md:min-h-[3.25rem] text-left flex items-center justify-between rounded-xl border px-4 md:px-5 bg-white font-medium text-base transition-shadow outline-none
          ${error ? 'border-red-500 bg-red-50/50 ring-1 ring-red-200' : 'border-[#B0B0B0] focus:border-[#222222] focus:ring-2 focus:ring-[#222222] focus:ring-offset-0'}
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        `}
      >
        <span className={displayValue ? 'text-gray-900' : 'text-gray-500'}>
          {displayValue || (endDateName ? 'Select dates' : 'Select a date')}
        </span>
        <svg className="w-5 h-5 text-[#FF385C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-[100] mt-2 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 w-[min(100vw-1.5rem,22rem)] max-w-[22rem] bg-white rounded-2xl shadow-xl border border-[#E8E8E8] p-3 sm:p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button type="button" onClick={handlePrevMonth} disabled={!canGoToPrevMonth()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => { setShowMonthPicker(!showMonthPicker); setShowYearPicker(false); }} className="px-3 py-1 text-lg font-semibold text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                {currentMonths[currentMonth.getMonth()]}
              </button>
              <button type="button" onClick={() => { setShowYearPicker(!showYearPicker); setShowMonthPicker(false); }} className="px-3 py-1 text-lg font-semibold text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                {d(currentMonth.getFullYear())}
              </button>
            </div>
            <button type="button" onClick={handleNextMonth} disabled={!canGoToNextMonth()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          {/* Year Picker */}
          {showYearPicker && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <button type="button" onClick={handlePrevYear} className="p-1 hover:bg-gray-200 rounded transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
                <span className="text-sm font-medium text-gray-600">{d(yearRangeStart)} - {d(yearRangeStart + 99)}</span>
                <button type="button" onClick={handleNextYear} className="p-1 hover:bg-gray-200 rounded transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {getYearRange().map((year) => {
                  const isCurrentYear = year === currentMonth.getFullYear();
                  const isDisabled = (min && year < new Date(min).getFullYear()) || (max && year > new Date(max).getFullYear());
                  return (
                    <button key={year} type="button" onClick={() => handleYearSelect(year)} disabled={isDisabled as boolean} className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${isCurrentYear ? 'bg-[#FF385C] text-white' : 'bg-white text-gray-700 hover:bg-rose-50'} ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}>{d(year)}</button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Month Picker */}
          {showMonthPicker && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-600 mb-2 text-center">Select Month</div>
              <div className="grid grid-cols-3 gap-2">
                {currentMonths.map((month, index) => (
                  <button key={month} type="button" onClick={() => handleMonthSelect(index)} className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${index === currentMonth.getMonth() ? 'bg-[#FF385C] text-white' : 'bg-white text-gray-700 hover:bg-rose-50'} cursor-pointer`}>{month.substring(0, 3)}</button>
                ))}
              </div>
            </div>
          )}

          {/* Day labels */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="w-9 sm:w-10 h-8 flex items-center justify-center text-[10px] sm:text-xs font-semibold text-gray-500">{day}</div>)}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-0.5 sm:gap-1">{days}</div>

          {/* Close button */}
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
            <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
