"use client";
import css from "./TagsMenu.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";

const TagsMenu = () => {
  const tags = ["All", "Work", "Personal", "Meeting", "Shopping", "Todo"];
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${css.menuContainer}`)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={css.menuContainer}>
      <button className={css.menuButton} onClick={toggleMenu} type="button">
        Notes ▾
      </button>
      {isOpen && (
        <ul className={css.menuList}>
          {tags.map((tag) => {
            return (
              <li key={tag} className={css.menuItem}>
                <Link
                  href={`/notes/filter/${tag}`}
                  className={css.menuLink}
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  {tag}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default TagsMenu;
