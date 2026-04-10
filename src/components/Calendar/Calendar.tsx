import React from 'react';
import { motion } from 'motion/react';
import { useCalendar } from '../../hooks/useCalendar';
import { Sidebar } from './layout/Sidebar';
import { Header } from './layout/Header';
import { MobileNav } from './layout/MobileNav';
import { MonthlyView } from './views/MonthlyView';
import { YearlyView } from './views/YearlyView';
import { PinnedNotesView } from './views/PinnedNotesView';
import { AcademyView } from './views/AcademyView';
import { NoteModal } from './modals/NoteModal';
import { SubjectModal } from './modals/SubjectModal';
import { DeleteModal } from './modals/DeleteModal';
import { ProfileModal } from './modals/ProfileModal';
import { SearchOverlay } from './modals/SearchOverlay';
import { NotificationsPanel } from './modals/NotificationsPanel';
import { OnboardingModal } from './modals/OnboardingModal';
import { useAcademy } from '../../hooks/useAcademy';

export default function Calendar() {
  const cal = useCalendar();
  const academy = useAcademy();

  return (
    <div
      className="flex min-h-screen bg-surface overflow-x-hidden transition-colors duration-1000"
      style={{ '--primary-theme': cal.themeColor } as React.CSSProperties}
    >
      {/* Color Splash Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{
            backgroundColor: cal.themeColor,
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.05, 0.03],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%] rounded-full blur-[120px]"
        />
      </div>

      <Sidebar
        viewMode={cal.viewMode}
        themeColor={cal.themeColor}
        onViewChange={cal.setViewMode}
        onAddEntry={() => cal.setIsNoteModalOpen(true)}
      />

      <main className="flex-1 flex flex-col">
        <Header
          viewMode={cal.viewMode}
          monthInfo={cal.monthInfo}
          yearToView={cal.yearToView}
          themeColor={cal.themeColor}
          range={cal.range}
          notifications={cal.notifications}
          userProfile={cal.userProfile}
          onGoToToday={cal.goToToday}
          onPrev={() => {
            if (cal.viewMode === 'monthly') cal.prevMonth();
            else cal.setYearToView(cal.yearToView - 1);
          }}
          onNext={() => {
            if (cal.viewMode === 'monthly') cal.nextMonth();
            else cal.setYearToView(cal.yearToView + 1);
          }}
          onClearRange={() => cal.setRange({ start: null, end: null })}
          onExport={cal.exportView}
          onOpenSearch={() => cal.setIsSearchOverlayOpen(true)}
          onToggleNotifications={() => cal.setIsNotificationsOpen(!cal.isNotificationsOpen)}
          onOpenProfile={() => cal.setIsProfileModalOpen(true)}
        />

        <div ref={cal.exportRef} className="px-4 sm:px-8 lg:px-12 pb-20 max-w-7xl mx-auto w-full">
          {cal.viewMode === 'monthly' ? (
            <MonthlyView
              monthKey={cal.monthKey}
              monthInfo={cal.monthInfo}
              direction={cal.direction}
              days={cal.days}
              currentDate={cal.currentDate}
              range={cal.range}
              notes={cal.notes}
              themeColor={cal.themeColor}
              searchQuery={cal.searchQuery}
              setSearchQuery={cal.setSearchQuery}
              filterType={cal.filterType}
              setFilterType={cal.setFilterType}
              currentMonthNotes={cal.currentMonthNotes}
              onDayClick={cal.handleDateClick}
              onAddNote={() => cal.setIsNoteModalOpen(true)}
              onReorder={cal.handleReorder}
              onTogglePin={cal.togglePin}
              onEditNote={cal.handleEditNote}
            />
          ) : cal.viewMode === 'yearly' ? (
            <YearlyView
              year={cal.yearToView}
              notes={cal.notes}
              themeColor={cal.themeColor}
              onMonthClick={(monthDate) => {
                cal.setCurrentDate(monthDate);
                cal.setViewMode('monthly');
              }}
            />
          ) : cal.viewMode === 'academy' ? (
            <AcademyView themeColor={cal.themeColor} academy={academy} />
          ) : (
            <PinnedNotesView
              notes={cal.notes}
              themeColor={cal.themeColor}
              onEdit={cal.handleEditNote}
              onTogglePin={cal.togglePin}
            />
          )}
        </div>
      </main>

      <MobileNav
        viewMode={cal.viewMode}
        themeColor={cal.themeColor}
        userProfile={cal.userProfile}
        onViewChange={cal.setViewMode}
        onOpenProfile={() => cal.setIsProfileModalOpen(true)}
      />

      <NoteModal
        isOpen={cal.isNoteModalOpen}
        onClose={cal.closeNoteModal}
        editingNote={cal.editingNote}
        setEditingNote={cal.setEditingNote}
        noteType={cal.noteType}
        setNoteType={cal.setNoteType}
        themeColor={cal.themeColor}
        isDatePickerOpen={cal.isDatePickerOpen}
        setIsDatePickerOpen={cal.setIsDatePickerOpen}
        range={cal.range}
        setRange={cal.setRange}
        recurrence={cal.recurrence}
        setRecurrence={cal.setRecurrence}
        newNoteContent={cal.newNoteContent}
        setNewNoteContent={cal.setNewNoteContent}
        newNoteLabel={cal.newNoteLabel}
        setNewNoteLabel={cal.setNewNoteLabel}
        reminderTime={cal.reminderTime}
        setReminderTime={cal.setReminderTime}
        onDeleteNote={cal.handleDeleteNote}
        onSave={cal.handleAddNote}
      />

      <DeleteModal
        note={cal.noteToDelete}
        onConfirm={cal.confirmDelete}
        onCancel={() => cal.setNoteToDelete(null)}
      />

      <SubjectModal
        isOpen={academy.isSubjectModalOpen}
        onClose={() => academy.setIsSubjectModalOpen(false)}
        editingSubject={academy.editingSubject}
        onSave={academy.addOrUpdateSubject}
        themeColor={cal.themeColor}
      />

      <ProfileModal
        isOpen={cal.isProfileModalOpen}
        onClose={() => cal.setIsProfileModalOpen(false)}
        userProfile={cal.userProfile}
        setUserProfile={cal.setUserProfile}
        themeColor={cal.themeColor}
      />

      <SearchOverlay
        isOpen={cal.isSearchOverlayOpen}
        onClose={() => cal.setIsSearchOverlayOpen(false)}
        query={cal.globalSearchQuery}
        setQuery={cal.setGlobalSearchQuery}
        notes={cal.notes}
        onResultClick={(date) => {
          cal.setCurrentDate(date);
          cal.setViewMode('monthly');
          cal.setIsSearchOverlayOpen(false);
        }}
      />

      <NotificationsPanel
        isOpen={cal.isNotificationsOpen}
        onClose={() => cal.setIsNotificationsOpen(false)}
        notifications={cal.notifications}
        onClearAll={() => cal.setNotifications([])}
      />

      <OnboardingModal
        isOpen={cal.isOnboardingOpen}
        onClose={() => cal.setIsOnboardingOpen(false)}
        userProfile={cal.userProfile}
        setUserProfile={cal.setUserProfile}
        onComplete={cal.completeOnboarding}
        themeColor={cal.themeColor}
      />
    </div>
  );
}
