'use client';
import { useState, useRef, useEffect } from 'react';

interface DatePickerProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  min?: string;
  max?: string;
  className?: string;
}

export default function DatePicker({
  name,
  value = '',
  onChange,
  required = false,
  disabled = false,
  min,
  max,
  className = '',
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value || '');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [yearRangeStart, setYearRangeStart] = useState(1900);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setSelectedDate(value);
      const date = new Date(value);
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth()));
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateString = formatDate(newDate);
    setSelectedDate(dateString);
    
    // Update the hidden input
    const hiddenInput = document.querySelector(`input[name="${name}"][type="hidden"]`) as HTMLInputElement;
    if (hiddenInput) {
      hiddenInput.value = dateString;
      // Trigger change event for form validation
      hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    if (onChange) {
      onChange(dateString);
    }
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handlePrevYear = () => {
    // Move back 100 years (one full range)
    setYearRangeStart(yearRangeStart - 100);
  };

  const handleNextYear = () => {
    // Move forward 100 years (one full range), but don't go beyond max year
    const maxYear = max ? new Date(max).getFullYear() : new Date().getFullYear();
    const nextStart = yearRangeStart + 100;
    if (nextStart <= maxYear) {
      setYearRangeStart(nextStart);
    }
  };

  const handleYearSelect = (year: number) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth()));
    setShowYearPicker(false);
    // Adjust year range to center around selected year if needed
    if (year < yearRangeStart || year > yearRangeStart + 99) {
      setYearRangeStart(year - 50);
    }
  };

  const handleMonthSelect = (month: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), month));
    setShowMonthPicker(false);
  };

  const getYearRange = () => {
    // Show 100 years at a time
    const startYear = yearRangeStart;
    const maxYear = max ? new Date(max).getFullYear() : new Date().getFullYear();
    const endYear = Math.min(yearRangeStart + 99, maxYear);
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return years;
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const isDateDisabled = (day: number): boolean => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    date.setHours(0, 0, 0, 0);
    
    // Check minimum date
    if (min) {
      const minDate = new Date(min);
      minDate.setHours(0, 0, 0, 0);
      if (date < minDate) return true;
    }
    
    // Check maximum date (default to today if not specified)
    const maxDate = max ? new Date(max) : new Date();
    maxDate.setHours(23, 59, 59, 999);
    if (date > maxDate) return true;
    
    return false;
  };

  const isDateSelected = (day: number): boolean => {
    if (!selectedDate) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return formatDate(date) === selectedDate;
  };

  const isToday = (day: number): boolean => {
    const today = new Date();
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return formatDate(date) === formatDate(today);
  };

  const displayValue = selectedDate
    ? new Date(selectedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const days = [];
  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="w-12 h-12" />);
  }
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const disabled = isDateDisabled(day);
    const selected = isDateSelected(day);
    const today = isToday(day);
    days.push(
      <button
        key={day}
        type="button"
        onClick={() => !disabled && handleDateSelect(day)}
        disabled={disabled}
        className={`
          w-12 h-12 rounded-lg text-sm font-medium transition-all
          ${disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-blue-50 cursor-pointer'}
          ${selected ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
          ${today && !selected ? 'bg-blue-100 text-blue-700 font-semibold' : ''}
          ${!disabled && !selected && !today ? 'hover:bg-gray-100' : ''}
        `}
      >
        {day}
      </button>
    );
  }

  return (
    <div ref={pickerRef} className={`relative ${className}`}>
      <input 
        type="hidden" 
        name={name} 
        value={selectedDate} 
        required={required}
        disabled={disabled}
      />
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!disabled) {
            setIsOpen(!isOpen);
          }
        }}
        disabled={disabled}
        className={`
          input w-full text-left flex items-center justify-between
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        `}
      >
        <span className={selectedDate ? 'text-gray-900' : 'text-gray-500'}>
          {displayValue || 'Select a date'}
        </span>
        <svg
          className="w-5 h-5 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-[100] mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Previous month"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowMonthPicker(!showMonthPicker);
                  setShowYearPicker(false);
                }}
                className="px-3 py-1 text-lg font-semibold text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {currentMonth.toLocaleDateString('en-US', { month: 'long' })}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowYearPicker(!showYearPicker);
                  setShowMonthPicker(false);
                }}
                className="px-3 py-1 text-lg font-semibold text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {currentMonth.getFullYear()}
              </button>
            </div>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Next month"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Year Picker */}
          {showYearPicker && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <button
                  type="button"
                  onClick={handlePrevYear}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  title="Previous 100 years"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-sm font-medium text-gray-600">
                  {yearRangeStart} - {yearRangeStart + 99}
                </span>
                <button
                  type="button"
                  onClick={handleNextYear}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  title="Next 100 years"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {getYearRange().map((year) => {
                  const isCurrentYear = year === currentMonth.getFullYear();
                  const minYear = min ? new Date(min).getFullYear() : null;
                  const maxYear = max ? new Date(max).getFullYear() : new Date().getFullYear();
                  const isDisabled = (minYear !== null && year < minYear) || year > maxYear;
                  return (
                    <button
                      key={year}
                      type="button"
                      onClick={() => handleYearSelect(year)}
                      disabled={isDisabled}
                      className={`
                        py-2 px-3 rounded-lg text-sm font-medium transition-colors
                        ${isCurrentYear ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-blue-50'}
                        ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      {year}
                    </button>
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
                {months.map((month, index) => {
                  const isCurrentMonth = index === currentMonth.getMonth();
                  return (
                    <button
                      key={month}
                      type="button"
                      onClick={() => handleMonthSelect(index)}
                      className={`
                        py-2 px-3 rounded-lg text-sm font-medium transition-colors
                        ${isCurrentMonth ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-blue-50'}
                        cursor-pointer
                      `}
                    >
                      {month.substring(0, 3)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Day labels */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="w-12 h-8 flex items-center justify-center text-xs font-semibold text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">{days}</div>

          {/* Close button */}
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

