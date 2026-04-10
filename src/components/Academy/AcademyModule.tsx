import React from 'react';
import { useAcademy } from '../../hooks/useAcademy';
import { AcademyView } from '../Calendar/views/AcademyView';
import { SubjectModal } from '../Calendar/modals/SubjectModal';
import { SubjectDeepDive } from './SubjectDeepDive';

export default function AcademyModule() {
  const academy = useAcademy();
  // Using a distinct, consistent theme color specifically for the Academy Module
  const themeColor = "#ec4899"; 

  return (
    <div 
      className="min-h-screen flex justify-center pb-24 transition-colors duration-1000 overflow-x-hidden relative"
      style={{ '--primary-theme': themeColor } as React.CSSProperties}
    >
      <main className="flex-1 w-full">
        {/* We reuse the AcademyView which already contains the sophisticated layouts */}
        <AcademyView themeColor={themeColor} academy={academy} />
      </main>

      <SubjectModal
        isOpen={academy.isSubjectModalOpen}
        onClose={() => academy.setIsSubjectModalOpen(false)}
        editingSubject={academy.editingSubject}
        onSave={academy.addOrUpdateSubject}
        themeColor={themeColor}
      />
      {academy.deepDiveSubject && (
        <SubjectDeepDive
          subject={academy.deepDiveSubject}
          academy={academy}
          onClose={() => academy.setDeepDiveSubject(null)}
        />
      )}
    </div>
  );
}
