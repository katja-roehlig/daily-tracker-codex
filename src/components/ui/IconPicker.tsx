import { useState } from "react";
import emojis from "emojibase-data/de/data.json";
import metaGroups from "emojibase-data/meta/groups.json";
import styles from "./IconPicker.module.css";

import {
  SmileyIcon,
  PersonIcon,
  CatIcon,
  CheeseIcon,
  CarIcon,
  VolleyballIcon,
  SockIcon,
  HeartIcon,
  FlagIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react";

//cut out the conponent-category
const groupEntries = Object.entries(metaGroups.groups).filter(
  ([strId]) => strId !== "2",
);

// an Icon for each category
const categoryIcons: Record<string, React.ComponentType<any>> = {
  "smileys-emotion": SmileyIcon,
  "people-body": PersonIcon,
  "animals-nature": CatIcon,
  "food-drink": CheeseIcon,
  "travel-places": CarIcon,
  activities: VolleyballIcon,
  objects: SockIcon,
  symbols: HeartIcon,
  flags: FlagIcon,
};

const groupLabels: Record<string, string> = {
  "smileys-emotion": "Smileys & Emotionen",
  "people-body": "Personen & Körper",
  "animals-nature": "Tiere & Natur",
  "food-drink": "Essen & Trinken",
  "travel-places": "Reisen & Orte",
  activities: "Aktivitäten",
  objects: "Gegenstände",
  symbols: "Symbole",
  flags: "Flaggen",
};

export function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (icon: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("0"); // Startet bei der ersten Kategorie

  const scrollToCategory = (id: string) => {
    const element = document.getElementById(`cat-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className={styles.iconPicker}>
      <div className={styles.searchWrapper}>
        <div className="searchContainer">
          {!searchQuery && (
            <MagnifyingGlassIcon size={20} className={styles.searchIcon} />
          )}
          <input
            type="text"
            placeholder="Emojis durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {!searchQuery && (
        <div className={styles.tabBar}>
          {groupEntries.map(([strId, groupKey]) => {
            const IconComponent = categoryIcons[groupKey] || SmileyIcon;

            return (
              <button
                key={strId}
                type="button"
                className={`${styles.tabButton} ${activeTab === strId ? styles.tabActive : ""}`}
                onClick={() => {
                  setActiveTab(strId);
                  document
                    .getElementById(`cat-${strId}`)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                <IconComponent size={22} weight="regular" />
              </button>
            );
          })}
        </div>
      )}

      {/* Scrollbereich für die Emojis */}
      <div className={styles.scrollContainer}>
        {groupEntries.map(([strId, groupKey]) => {
          const numericGroupId = parseInt(strId, 10);
          const germanTitle = groupLabels[groupKey] || groupKey;

          const groupEmojis = emojis.filter(
            (emoji) => emoji.group === numericGroupId,
          );

          const filteredEmojis = groupEmojis.filter((item) =>
            searchQuery
              ? item.label.toLowerCase().includes(searchQuery.toLowerCase())
              : true,
          );

          if (filteredEmojis.length === 0) return null;

          return (
            <div
              key={strId}
              id={`cat-${strId}`}
              className={styles.categorySection}
            >
              <h4 className={styles.categoryTitle}>{germanTitle}</h4>

              <div className={styles.emojiGrid}>
                {filteredEmojis.map((item) => (
                  <button
                    type="button"
                    aria-label={`Emoji ${item.label}`}
                    className={value === item.emoji ? styles.iconChosen : ""}
                    onClick={() => onChange(item.emoji)}
                    key={item.emoji}
                  >
                    {item.emoji}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
