"use client";

import { useModal } from "@/components/modal-context";
import { ExperienceModal } from "@/components/experience/experience-modal";

/**
 * Renders the currently active modal.
 * Add new modals here as they are built.
 */
export function ModalContainer() {
  const { activeModal, closeModal } = useModal();

  return (
    <>
      <ExperienceModal
        isOpen={activeModal === "experience"}
        onClose={closeModal}
      />
      {/* Future modals:
        <ProjectsModal  isOpen={activeModal === "projects"}  onClose={closeModal} />
        <StreakModal    isOpen={activeModal === "streak"}    onClose={closeModal} />
        <ResumeModal    isOpen={activeModal === "resume"}    onClose={closeModal} />
        <LinksModal     isOpen={activeModal === "links"}     onClose={closeModal} />
      */}
    </>
  );
}
