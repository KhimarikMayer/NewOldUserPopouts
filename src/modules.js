import { Webpack, Patcher } from 'betterdiscord';
import { lazy } from 'react';

export const [
    IconUtils,
    entireProfileModal,
    ActivityActions,
    ActivityTimer,
    ActivityButtons,
    ActivityCardClasses,
    AvatarClasses,
    AvatarFetch,
    AvatarWrapper,
    EmojiRenderer,
    RoleAddPopout,
    RoleUpdater,
    MarkdownRenderer,
    MediaProgressBar,
    MessageBar,
    MessagePrompt,
    ModalAccessUtils,
    Tooltip,
    TagGuildRenderer,
    Popout,
    SpotifyButtons,
    CallButtons,
    VoiceList,
    VoiceIcon,
    BotTagRenderer,
    FormSwitch,
    GameProfile,
    GameProfileCheck,
    DisplayNameStyleConfigurator,
    FocusRing,
    intl,
    Clamp,
    ClampedText
] = /* @__PURE__ */ Webpack.getBulk(
    { filter: Webpack.Filters.byKeys("getGuildIconURL") },
    { filter: Webpack.Filters.bySource('forceShowPremium', 'pendingThemeColors', 'profileThemeClassName') },
    { filter: Webpack.Filters.byStrings('display', 'getUserOutbox') },
    { filter: Webpack.Filters.byStrings('timestamps', '.TEXT_FEEDBACK_POSITIVE'), searchExports: true },
    { filter: Webpack.Filters.byStrings('activity', 'USER_PROFILE_ACTIVITY_BUTTONS') },
    { filter: Webpack.Filters.byKeys('gameState', 'clickableImage') },
    { filter: Webpack.Filters.byKeys('avatar', 'clickable', 'focusRing') },
    { filter: Webpack.Filters.byStrings('STREAMING', 'isVROnline'), searchExports: true },
    { filter: Webpack.Filters.byStrings('statusBackdropColor', 'voiceDb'), searchExports: true },
    { filter: Webpack.Filters.byStrings('translateSurrogatesToInlineEmoji') },
    { filter: Webpack.Filters.byStrings('roleFilter', 'getSortedRoles'), searchExports: true },
    { filter: x => x.updateMemberRoles },
    { filter: Webpack.Filters.byStrings('userBio', 'className', '.parseBioReact') },
    { filter: Webpack.Filters.byStrings('start', 'end', 'duration', 'percentage') },
    { filter: Webpack.Filters.byStrings('.USER_PROFILE', 'SEND_DIRECT_MESSAGE') },
    { filter: Webpack.Filters.byStrings('shareToChannelMode should only be true if a valid channel is passed'), searchExports: true },
    { filter: x => x.openUserProfileModal },
    { filter: Webpack.Filters.byPrototypeKeys('renderTooltip'), searchExports: true },
    { filter: Webpack.Filters.byStrings('guildId', 'name', 'setPopoutRef', 'onClose', 'fetchGuildProfile') },
    { filter: Webpack.Filters.byStrings('Unsupported animation config:'), searchExports: true },
    { filter: Webpack.Filters.byStrings('activity', 'PRESS_PLAY_ON_SPOTIFY_BUTTON') },
    { filter: Webpack.Filters.byStrings('PRESS_JOIN_CALL_BUTTON') },
    { filter: Webpack.Filters.byStrings('maxUsers', 'guildId') },
    { filter: Webpack.Filters.byStrings('channel', 'isGuildStageVoice', 'isDM', '.CONNECT') },
    { filter: Webpack.Filters.bySource('.BOT', 'invertColor') },
    { filter: Webpack.Filters.byStrings('hasIcon', 'switchIconsEnabled'), searchExports: true },
    { filter: x => x.openGameProfileModal },
    { filter: Webpack.Filters.byStrings('gameProfileModalChecks', 'onOpened') },
    { filter: x => Webpack.Filters.byStrings('data-username-with-effects')(x?.type) },
    { filter: Webpack.Filters.byStrings('"aria-describedby"', 'onDoubleClick'), searchExports: true },
    { filter: x => x.t && x.t.formatToMarkdownString },
    { filter: Webpack.Filters.byStrings('delay', 'lineClamp') },
    { filter: Webpack.Filters.byStrings('warn', 'preview', 'messageType'), searchExports: true }
);

export const RoleRenderer = /* @__PURE__ */ lazy(async () => ({
    default: await /* @__PURE__ */ Webpack.waitForModule(
        Webpack.Filters.byStrings('roles', 'guild', 'canRemoveAnyRoles', 'map(e'),
        { searchExports: true }
    )
}));

export const AccessibilityStore = /* @__PURE__ */ Webpack.getStore("AccessibilityStore");
export const ActivityStore = /* @__PURE__ */ Webpack.getStore("PresenceStore");
export const ApplicationStore = /* @__PURE__ */ Webpack.getStore("ApplicationStore");
export const ApplicationStreamPreviewStore = /* @__PURE__ */ Webpack.getStore("ApplicationStreamPreviewStore");
export const AuthenticationStore = /* @__PURE__ */ Webpack.getStore("AuthenticationStore");
export const ChannelStore = /* @__PURE__ */ Webpack.getStore("ChannelStore");
export const RelationshipStore = /* @__PURE__ */ Webpack.getStore("RelationshipStore");
export const GuildStore = /* @__PURE__ */ Webpack.getStore("GuildStore");
export const GuildMemberStore = /* @__PURE__ */ Webpack.getStore("GuildMemberStore");
export const GuildRoleStore = /* @__PURE__ */ Webpack.getStore("GuildRoleStore");
export const NewGameStore = /* @__PURE__ */ Webpack.getStore("NewGameStore");
export const PermissionStore = /* @__PURE__ */ Webpack.getStore("PermissionStore");
export const StreamStore = /* @__PURE__ */ Webpack.getStore("ApplicationStreamingStore");
export const UserStore = /* @__PURE__ */ Webpack.getStore("UserStore");
export const VoiceStateStore = /* @__PURE__ */ Webpack.getStore("VoiceStateStore");

export const { useStateFromStores } = /* @__PURE__ */ Webpack.getMangled(m => m.Store, {
    useStateFromStores: /* @__PURE__ */ Webpack.Filters.byStrings("useStateFromStores")
}, { raw: true });

export let BotAddButton;
export let RolePermissionCheck;

export const UserNote = /* @__PURE__ */ lazy(() => {
    const modalModule = /* @__PURE__ */ Webpack.getMangled("onCloseRequest:null==", {
        openModalLazy: /* @__PURE__ */ Webpack.Filters.byRegex(/^async function/)
    });

    const { promise, resolve } = Promise.withResolvers();

    const openUserModal = /* @__PURE__ */ Webpack.getByKeys("openUserProfileModal");

    const undo = Patcher.instead(modalModule, "openModalLazy", (that, args, original) => {
        if (!String(args[1]?.modalKey).startsWith("USER_PROFILE_MODAL_KEY:")) return original.apply(that, args);

        args[0]().then(() => {
            resolve({
                default: /* @__PURE__ */ Webpack.getByStrings('hidePersonalInformation', 'onUpdate', 'placeholder')
            });
        });

        undo();
    });

    openUserModal.openUserProfileModal({
        userId: /* @__PURE__ */ UserStore.getCurrentUser().id
    });

    return promise;
});

export function getIntlString(hash, parameter) {
    if (parameter) return intl.intl.formatToPlainString(intl.t[`${hash}`], parameter);
    return intl.intl.formatToPlainString(intl.t[`${hash}`]);
}

export function BotAddButtonComponent({ user }) {
    BotAddButton ??= /* @__PURE__ */ Webpack.getByStrings('"user-bot-profile-add-app"');
    return BdApi.React.createElement(BotAddButton, { user, text: getIntlString("E64YCz") });
}

export function RolePermissionHook({ guildId }) {
    RolePermissionCheck ??= /* @__PURE__ */ Webpack.getByStrings('.ADMINISTRATOR', '.MANAGE_MESSAGES');
    return RolePermissionCheck({ guildId });
}

export const headers = () => ({
    0: intl.intl.formatToPlainString(intl.t["2TbM/G"]),
    1: intl.intl.formatToPlainString(intl.t["4CQq9Q"], { name: "" }),
    2: intl.intl.formatToPlainString(intl.t["NF5xop"], { name: "" }),
    3: intl.intl.formatToPlainString(intl.t["pW3Ip3"], { name: "" }),
    5: intl.intl.formatToPlainString(intl.t["QQ2wVE"], { name: "" })
});

export const CustomProgressBar = ({ start, end }) => {
    const [currentTime, setCurrentTime] = react.useState(Date.now());
    
    react.useEffect(() => {
        const update = () => setCurrentTime(Date.now());
        update();
        const interval = setInterval(update, 100);
        return () => clearInterval(interval);
    }, []);
    
    const isRussian = () => {
        try {
            const localeModule = betterdiscord.Webpack.getModule(m => m?.locale && typeof m.locale === 'string');
            return localeModule?.locale === 'ru';
        } catch(e) {
            return false;
        }
    };
    
    const startMs = start < 1e11 ? start * 1000 : start;
    const endMs = end < 1e11 ? end * 1000 : end;
    const total = endMs - startMs;
    const elapsed = Math.min(Math.max(0, currentTime - startMs), total);
    const remaining = total - elapsed;
    
    if (remaining <= 0) return null;
    
    const formatTimer = (ms) => {
        const seconds = Math.floor(ms / 1000);
        if (seconds <= 0) return "0:00";
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    
    const timerText = formatTimer(remaining);
    
    const displayText = isRussian() ? `Осталось ${timerText}` : `${timerText} left`;
    
    return react.createElement("span", { 
        className: "timestamp textRow ellipsis"
    }, displayText);
};

export const ActivityTimerLocalized = ({ activity }) => {
    const [currentTime, setCurrentTime] = react.useState(Date.now());
    
    react.useEffect(() => {
        if (!activity) return;
        const update = () => setCurrentTime(Date.now());
        update();
        const interval = setInterval(update, 100);
        return () => clearInterval(interval);
    }, [activity]);
    
    const isRussian = () => {
        try {
            const localeModule = betterdiscord.Webpack.getModule(m => m?.locale && typeof m.locale === 'string');
            return localeModule?.locale === 'ru';
        } catch(e) {
            return false;
        }
    };
    
    const isGameIconUsed = () => {
        if (activity?.name?.includes("Spotify")) return false;
        if (activity?.type === 1) return false;
        if (!activity?.assets?.large_image && !activity?.application_id) return true;
        if (activity?.assets?.large_image && !activity?.application_id) return true;
        if (!activity?.assets?.large_image && activity?.application_id) return true;
        return false;
    };
    
    const formatTimer = (seconds) => {
        if (seconds < 0) seconds = 0;
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    
    const formatRussianWithWords = (seconds) => {
        if (seconds < 0) seconds = 0;
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (seconds < 60) {
            return "Начал(-а) играть только что";
        }
        if (days > 0) {
            if (days % 10 === 1 && days % 100 !== 11) return `${days} день`;
            if (days % 10 >= 2 && days % 10 <= 4 && (days % 100 < 10 || days % 100 >= 20)) return `${days} дня`;
            return `${days} дней`;
        }
        if (hours > 0) {
            if (hours % 10 === 1 && hours % 100 !== 11) return `уже ${hours} час`;
            if (hours % 10 >= 2 && hours % 10 <= 4 && (hours % 100 < 10 || hours % 100 >= 20)) return `уже ${hours} часа`;
            return `уже ${hours} часов`;
        }
        if (minutes > 0) {
            if (minutes % 10 === 1 && minutes % 100 !== 11) return `уже ${minutes} минуту`;
            if (minutes % 10 >= 2 && minutes % 10 <= 4 && (minutes % 100 < 10 || minutes % 100 >= 20)) return `уже ${minutes} минуты`;
            return `уже ${minutes} минут`;
        }
        return "Начал(-а) играть только что";
    };
    
    const formatEnglishWithWords = (seconds) => {
        if (seconds < 0) seconds = 0;
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (seconds < 60) {
            return "Just started playing";
        }
        if (days > 0) return `${days} day${days !== 1 ? 's' : ''}`;
        if (hours > 0) return `for ${hours} hour${hours !== 1 ? 's' : ''}`;
        if (minutes > 0) return `for ${minutes} minute${minutes !== 1 ? 's' : ''}`;
        return "Just started playing";
    };
    
    let text = "";
    
    if ((activity?.type === 0 || activity?.type === 5) && activity?.timestamps?.end && !activity?.name?.includes("Spotify")) {
        const endMs = activity.timestamps.end < 1e11 ? activity.timestamps.end * 1000 : activity.timestamps.end;
        const remaining = Math.max(0, Math.floor((endMs - currentTime) / 1000));
        if (remaining > 0) {
            const formatted = formatTimer(remaining);
            text = isRussian() ? `Осталось ${formatted}` : `${formatted} left`;
        }
    }
    else if (activity?.timestamps?.start || activity?.created_at) {
        if (activity?.name?.includes("Spotify")) return null;
        
        const startMs = (activity.timestamps?.start || activity.created_at) < 1e11 
            ? (activity.timestamps?.start || activity.created_at) * 1000 
            : (activity.timestamps?.start || activity.created_at);
        const elapsed = Math.floor((currentTime - startMs) / 1000);
        
        if (elapsed > 0) {
            if (elapsed < 60) {
                text = isRussian() ? "Начал(-а) играть только что" : "Just started playing";
            } else if (isGameIconUsed()) {
                text = isRussian() 
                    ? formatRussianWithWords(elapsed)
                    : formatEnglishWithWords(elapsed);
            } else {
                const formatted = formatTimer(elapsed);
                text = isRussian() ? `Прошло ${formatted}` : `${formatted} elapsed`;
            }
        }
    }
    
    if (!text) return null;
    
    return react.createElement("span", {
        className: "timestamp textRow ellipsis"
    }, text);
};

export function userVoice({ voice }) {
    let participants = [];
    const channelParticipants = Object.keys(VoiceStateStore.getVoiceStatesForChannel(voice));
    for (let i = 0; i < channelParticipants.length; i++) {
        participants.push(UserStore.getUser(channelParticipants[i]));
    }
    return participants;
}

export function FlexInfo(props) {
    const { className, style, channel, type } = props;
    
    const getChannelName = () => {
        if (!channel) return null;
        if (channel.type === 1 && channel.recipients && channel.recipients.length > 0) {
            const recipientId = channel.recipients[0];
            const user = UserStore.getUser(recipientId);
            const nickname = RelationshipStore.getNickname(recipientId);
            return nickname || user?.globalName || user?.username || "Unknown User";
        }
        if (channel.type === 3 && channel.recipients) {
            const names = channel.recipients
                .map(id => {
                    const user = UserStore.getUser(id);
                    return user?.globalName || user?.username || "Unknown";
                })
                .join(", ");
            return names || "Group DM";
        }
        return channel.name || "Voice Channel";
    };
    
    const channelName = getChannelName();
    if (!channelName) return null;
    
    const guildName = GuildStore.getGuild(channel.guild_id)?.name;
    const shouldShowState = guildName || type === "STREAM";
    const stateText = type === "STREAM" ? 
        intl.intl.formatToPlainString(intl.t["sddlGK"], { server: guildName || "Unknown Server" }) :
        guildName ? intl.intl.formatToPlainString(intl.t["Xe4de2"], { channelName: guildName }) : null;
    
    return BdApi.React.createElement("div", { className, style }, 
        BdApi.React.createElement("h3", { className: "textRow", style: { display: "flex", alignItems: "center" } }, 
            VoiceIcon({ channel }),
            BdApi.React.createElement("h3", { className: "nameWrap nameNormal textRow", style: { fontWeight: "600" } }, channelName)
        ),
        shouldShowState && stateText && BdApi.React.createElement("div", { className: "state textRow ellipsis" }, stateText)
    );
}
