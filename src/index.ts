import { Parser, EmojiRawData, EmojiImage } from "./Parser"
import { Emoji } from "./Emoji";
import { singleton } from "./decorators/Singleton";
import Collection from "./Collection";

@singleton
class EmojiAPI {
    public cache = new Collection<string, Emoji>();

    async get(emoji: string, force = false): Promise<Emoji> {
        if (!force) {
            const cached = this.cache.findOne(emoji);
            if (cached) return cached;
        }

        const basicInfo = await this.getBasicInfo(emoji);
        if (!basicInfo) throw new Error("Emoji not found!");
        const em = new Emoji(basicInfo);
        this.cache.set(emoji, em);
        return em;
    }

    async getBasicInfo(emoji: string): Promise<EmojiRawData> {
        try {
            const raw = await Parser.getHTML(emoji);
            if (!raw) return null;
            const basicInfo = Parser.fetchData(raw);

            return basicInfo;
        } catch {
            return null;
        }
    }

    EmojiToUnicode(emoji: string) {
        return Parser.emojiUnicode(emoji);
    }

    UnicodeToEmoji(unicode: string) {
        return String.fromCodePoint(parseInt(unicode, 16));
    }

}

export { EmojiAPI, Parser, EmojiRawData, EmojiImage, Emoji }
export default EmojiAPI;