"use client";

import type React from "react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";

interface AccordionItemProps {
  id: string;
  title: string | React.ReactNode;
  children?: string | React.ReactNode;
}
const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children = <></>,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        className="flex w-full items-center justify-between py-4 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title && title}
        <ChevronDown
          className={cn(
            "h-4 w-4 text-gray-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      {isOpen && children}
    </div>
  );
};

interface AccordionProps {
  title?: string | React.ReactNode;
  items: AccordionItemProps[];
}

const Accordion: React.FC<AccordionProps> = ({ title, items }) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden p-6">
      <div className="divide-y divide-gray-200">
        {title ? (
          typeof title == "string" ? (
            <h3 className="text-lg pb-3">{title}</h3>
          ) : (
            title
          )
        ) : null}
        {items.map((item, index) => (
          <AccordionItem key={index} title={item.title} id={item.id}>
            {item.children}
          </AccordionItem>
        ))}
      </div>
    </div>
  );
};

export default Accordion;
