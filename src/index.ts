interface EmojiData {
    emoji: string;
    name: string;
    group: EmojiGroup;
    sub_group: EmojiSubGroup;
    codepoints: string;
}

export const emojis = require("./emojis.json") as EmojiData[];
const cache = new Map<string, Emoji>();
let allCache: Emoji[], arranged: Record<EmojiGroup, Emoji[]>;

export type EmojiGroup = "Smileys & Emotion" | "People & Body" | "Animals & Nature" | "Food & Drink" | "Travel & Places" | "Activities" | "Objects" | "Symbols" | "Flags";
export type EmojiSubGroup = "face-smiling" | "face-affection" | "face-tongue" | "face-hand" | "face-neutral-skeptical" | "face-sleepy" | "face-unwell" | "face-hat" | "face-glasses" | "face-concerned" | "face-negative" | "face-costume" | "cat-face" | "monkey-face" | "emotion" | "hand-fingers-open" | "hand-fingers-partial" | "hand-single-finger" | "hand-fingers-closed" | "hands" | "hand-prop" | "body-parts" | "person" | "person-gesture" | "person-role" | "person-fantasy" | "person-activity" | "person-sport" | "person-resting" | "family" | "person-symbol" | "animal-mammal" | "animal-bird" | "animal-amphibian" | "animal-reptile" | "animal-marine" | "animal-bug" | "plant-flower" | "plant-other" | "food-fruit" | "food-vegetable" | "food-prepared" | "food-asian" | "food-marine" | "food-sweet" | "drink" | "dishware" | "place-map" | "place-geographic" | "place-building" | "place-religious" | "place-other" | "transport-ground" | "transport-water" | "transport-air" | "hotel" | "time" | "sky & weather" | "event" | "award-medal" | "sport" | "game" | "arts & crafts" | "clothing" | "sound" | "music" | "musical-instrument" | "phone" | "computer" | "light & video" | "book-paper" | "money" | "mail" | "writing" | "office" | "lock" | "tool" | "science" | "medical" | "household" | "other-object" | "transport-sign" | "warning" | "arrow" | "religion" | "zodiac" | "av-symbol" | "gender" | "math" | "punctuation" | "currency" | "other-symbol" | "keycap" | "alphanum" | "geometric" | "flag" | "country-flag" | "subdivision-flag";

export class Emoji {
    /**
     * Represents an emoji
     * @param _data The emoji data
     */
    public constructor(private readonly _data: EmojiData) {}

    /**
     * The Emoji
     */
    public get emoji() {
        return this._data.emoji;
    }

    /**
     * The emoji name
     */
    public get name() {
        return this._data.name;
    }

    /**
     * The emoji name
     */
    public get formattedName() {
        return (this._data.name).split(" ").map(m => `${m.charAt(0).toUpperCase()}${m.substring(1).toLowerCase()}`).join(" ");
    }

    /**
     * The emoji group
     */
    public get group() {
        return this._data.group;
    }

    /**
     * The emoji subgroup
     */
    public get subGroup() {
        return this._data.sub_group;
    }

    /**
     * The emoji code points
     */
    public get codePoints() {
        return this._data.codepoints.split(" ");
    }

    /**
     * Twemoji url of this emoji 
     */
    public twemoji(opt?: { size?: string; format?: "png" | "svg" }) {
        const { format, size } = (opt ??= { size: "72x72", format: "png" });
        return `https://twemoji.maxcdn.com/v/latest/${format === 'svg' ? "svg" : size}/${this.toUnicode().toLowerCase()}.${format}`;
    }

    /**
     * Returns fancy name of this emoji
     */
    public get fancyName() {
        return `:${this.name.replace(/\W/g, "_").toLowerCase()}:`;
    }

    /**
     * Unicode of this emoji
     */
    public toUnicode() {
        return emojiToUnicode(this.emoji);
    }

    /**
     * String representation of this emoji
     */
    public toString() {
        return this.emoji;
    }

    /**
     * Array representation of this emoji
     */
    public toArray() {
        return [this.toJSON()];
    }

    /**
     * Static method to create emoji instance
     * @param emoji The emoji data
     */
    public static from(emoji: EmojiData) {
        return new Emoji(emoji);
    }

    /**
     * JSON representation of this emoji
     */
    public toJSON() {
        return {
            ...this._data,
            fancyName: this.fancyName,
            twemoji: this.twemoji(),
            unicode: this.toUnicode(),
            formattedName: this.formattedName
        };
    }
}

/**
 * Returns all emoji
 */
export function all(): Emoji[] {
    if (allCache) return allCache;
    return allCache = emojis.map(m => new Emoji(m));
}

/**
 * Returns arranged emojis
 */
export function arrange() {
    if (arranged) return arranged;
    arranged = {} as any;
    const every = all();

    for (const emoji of every) {
        arranged[emoji.group] ? arranged[emoji.group].push(emoji) : arranged[emoji.group] = [emoji];
    }

    return arranged;
}

/**
 * Get specific emoji
 * @param emoji The emoji to find
 */
export function get(emoji: string): Emoji | null {
    if (cache.has(emoji)) return cache.get(emoji);
    const found = all().find(em => em.emoji === emoji);
    if (!found) return null;
    cache.set(emoji, found);
    return found;
}

/**
 * Filter emoji by its data
 * @param fn Filter fn
 */
export function filter(fn: (emoji: Emoji) => boolean): Emoji[] {
    return all().filter(e => fn(e));
}

/**
 * Get random emoji
 */
export function random(): Emoji {
    const emojis = all();
    const em = emojis[Math.floor(Math.random() * emojis.length)];
    return em;
}

/**
 * Get random emoji from a specific group
 * @param group The group name
 * @param subGroup The subgroup name
 */
export function randomFromGroup(group: EmojiGroup, subGroup?: EmojiSubGroup): Emoji {
    const emojis = all();
    const groupFilter = emojis.filter(g => g.group.toLowerCase() === group.toLowerCase() && !subGroup ? true : subGroup.toLowerCase() === g.subGroup.toLowerCase());
    const em = groupFilter[Math.floor(Math.random() * groupFilter.length)];
    return em;
}

/**
 * Find emoji by name
 * @param name The emoji name
 */
export function findByName(name: string): Emoji | null {
    const found = all().find(e => e.name.toLowerCase() === name.toLowerCase());
    return found || null;
}

/**
 * Convert emoji to unicode
 * @param emoji The emoji
 */
export function emojiToUnicode(emoji: string): string {
    if (emoji.length === 1) return emoji.charCodeAt(0).toString(16);
    let comp = ((emoji.charCodeAt(0) - 0xD800) * 0x400 + (emoji.charCodeAt(1) - 0xDC00) + 0x10000);
    if (comp < 0) return emoji.charCodeAt(0).toString(16);
    return comp.toString(16).toUpperCase();
}

/**
 * Convert unicode to emoji
 * @param unicode The unicode
 */
export function unicodeToEmoji(unicode: string): string {
    return String.fromCodePoint(parseInt(unicode, 16));
}