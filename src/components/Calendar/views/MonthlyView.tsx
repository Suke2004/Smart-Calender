import React from 'react';
import { DateRange, Note, CalendarMonth, Subject } from '../../../types';
import { HeroSection } from '../calendar/HeroSection';
import { CalendarGrid } from '../calendar/CalendarGrid';
import { NotesList } from '../notes/NotesList';
import { FilterType } from '../../../hooks/useCalendar';

interface MonthlyViewProps {
  monthKey: string;
  monthInfo: CalendarMonth;
  direction: number;
  days: Date[];
  currentDate: Date;
  range: DateRange;
  notes: Note[];
  themeColor: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterType: FilterType;
  setFilterType: (type: FilterType) => void;
  currentMonthNotes: Note[];
  subjects: Subject[];
  onDayClick: (day: Date) => void;
  onAddNote: () => void;
  onReorder: (notes: Note[]) => void;
  onTogglePin: (id: string) => void;
  onEditNote: (note: Note) => void;
}

export function MonthlyView({
  monthKey,
  monthInfo,
  direction,
  days,
  currentDate,
  range,
  notes,
  themeColor,
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  currentMonthNotes,
  subjects,
  onDayClick,
  onAddNote,
  onReorder,
  onTogglePin,
  onEditNote,
}: MonthlyViewProps) {
  return (
    <>
      <HeroSection
        monthKey={monthKey}
        monthInfo={monthInfo}
        direction={direction}
      />
      <CalendarGrid
        days={days}
        monthKey={monthKey}
        direction={direction}
        currentDate={currentDate}
        range={range}
        notes={notes}
        themeColor={themeColor}
        monthName={monthInfo.name}
        monthYear={monthInfo.year}
        subjects={subjects}
        onDayClick={onDayClick}
      />
      <NotesList
        monthName={monthInfo.name}
        notes={currentMonthNotes}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterType={filterType}
        setFilterType={setFilterType}
        onAddNote={onAddNote}
        onReorder={onReorder}
        onTogglePin={onTogglePin}
        onEditNote={onEditNote}
        themeColor={themeColor}
      />
    </>
  );
}
