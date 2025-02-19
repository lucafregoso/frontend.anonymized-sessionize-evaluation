"use client";

import type React from "react";
import { useLayoutEffect, useRef } from "react";

interface AccordionItemProps {
  id: string;
  title: string | React.ReactNode;
  buttons?: {
    text: string;
    onClick: (evt: React.MouseEvent<HTMLButtonElement>) => void;
    data?: {
      session_id?: string;
      vote_id?: string;
    };
  }[];
}
const AccordionItem: React.FC<AccordionItemProps> = ({ title, buttons }) => {
  return (
    <div className="border-b border-gray-200">
      <div className="flex w-full items-center justify-between py-4 text-left">
        {title && title}
        {buttons && (
          <div className="flex gap-2">
            {buttons.map((button, index) => (
              <button
                key={index}
                className="text-sm text-gray-500 hover:text-gray-700"
                onClick={button.onClick}
                data-session_id={button.data?.session_id}
                data-vote_id={button.data?.vote_id}
              >
                {button.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface AccordionProps {
  title?: string | React.ReactNode;
  items: AccordionItemProps[];
  fixed?: false;
}

const AccordionThin: React.FC<AccordionProps> = ({
  title,
  items,
  fixed = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (fixed && containerRef.current && accordionRef.current) {
      const container = containerRef.current;
      const accordion = accordionRef.current;
      const containerRect = container.getBoundingClientRect();

      console.log({
        containerRect,
        containerTop: containerRect.top,
        windowScrollY: window.scrollY,
        containerRef,
        accordionRef,
      });

      const onScroll = () => {
        const containerTop = containerRect.top;
        if (containerTop < window.scrollY) {
          accordion.style.position = "fixed";
          accordion.style.top = "0";
          accordion.style.width = `${containerRect.width - 50}px`;
          accordion.style.left = `${containerRect.left + 25}px`;
          accordion.style.overflowY = "scroll";
          accordion.style.maxHeight = "calc(100vh - 2rem)";
        } else {
          accordion.style.position = "relative";
          accordion.style.width = "100%";
          accordion.style.left = "0";
          accordion.style.overflowY = "auto";
          accordion.style.maxHeight = "none";
        }
      };

      window.addEventListener("scroll", onScroll);
      return () => window.removeEventListener("scroll", onScroll);
    }
  }, [fixed]);

  return (
    <div
      ref={containerRef}
      className="w-full bg-white rounded-lg shadow-sm overflow-hidden p-6"
    >
      <div
        ref={accordionRef}
        className={`divide-y divide-gray-200 ${
          fixed ? "accordion-thin-fixed" : ""
        }`}
      >
        {title ? (
          typeof title == "string" ? (
            <h3 className="text-lg pb-3">{title}</h3>
          ) : (
            title
          )
        ) : null}
        {items.map((item, index) => (
          <AccordionItem
            key={index}
            title={item.title}
            id={item.id}
            buttons={item.buttons}
          />
        ))}
      </div>
    </div>
  );
};

export default AccordionThin;
