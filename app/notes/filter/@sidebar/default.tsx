import css from "./SidebarNotes.module.css";
import Link from "next/link";

const SidebarNotes = () => {
  const tags = ["All", "Work", "Personal", "Meeting", "Shopping", "Todo"];
  return (
    <ul className={css.menuList}>
      {tags.map((tag) => {
        return (
          <li key={tag} className={css.menuItem}>
            <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
              {tag}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarNotes;
