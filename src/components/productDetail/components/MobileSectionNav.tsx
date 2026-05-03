"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";

export interface SectionItem {
  id: string;
  label: string;
}

interface MobileSectionNavProps {
  sections: SectionItem[];
  /** The ID of the element that, once scrolled past, makes the nav sticky-visible */
  triggerElementId: string;
}

const MobileSectionNav: React.FC<MobileSectionNavProps> = ({
  sections,
  triggerElementId,
}) => {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || "");
  const [isVisible, setIsVisible] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const isScrollingToSection = useRef(false);

  // Show/hide sticky nav based on trigger element visibility
  useEffect(() => {
    const triggerEl = document.getElementById(triggerElementId);
    if (!triggerEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show nav when trigger element leaves viewport (scrolled past)
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-56px 0px 0px 0px" }
    );

    observer.observe(triggerEl);
    return () => observer.disconnect();
  }, [triggerElementId]);

  // Track which section is currently in view using scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (isScrollingToSection.current) return;

      const navHeight = 48;
      // The point we check against: just below the sticky nav
      const checkPosition = window.scrollY + navHeight + 20;

      let currentSectionId = sections[0]?.id;

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const elementTop = el.getBoundingClientRect().top + window.scrollY;
          if (checkPosition >= elementTop) {
            currentSectionId = section.id;
          }
        }
      }

      if (currentSectionId && currentSectionId !== activeSection) {
        setActiveSection(currentSectionId);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections, activeSection]);

  // Auto-scroll the nav to keep active tab visible
  useEffect(() => {
    if (activeTabRef.current && navRef.current) {
      const nav = navRef.current;
      const tab = activeTabRef.current;
      const navRect = nav.getBoundingClientRect();
      const tabRect = tab.getBoundingClientRect();

      if (tabRect.left < navRect.left || tabRect.right > navRect.right) {
        tab.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeSection]);

  const handleTap = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;

    isScrollingToSection.current = true;
    setActiveSection(sectionId);

    // Account for the sticky nav height (48px)
    const navHeight = 48;
    const elementTop =
      el.getBoundingClientRect().top + window.scrollY - navHeight - 8;

    window.scrollTo({ top: elementTop, behavior: "smooth" });

    // Reset the flag after scroll completes
    setTimeout(() => {
      isScrollingToSection.current = false;
    }, 800);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div
        ref={navRef}
        className="flex overflow-x-auto scrollbarHide px-1"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              ref={isActive ? activeTabRef : null}
              onClick={() => handleTap(section.id)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 relative ${
                isActive
                  ? "text-black"
                  : "text-gray-400"
              }`}
            >
              {section.label}
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-black rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

MobileSectionNav.displayName = "MobileSectionNav";

export default React.memo(MobileSectionNav);
