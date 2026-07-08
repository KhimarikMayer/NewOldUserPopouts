import { Utils } from 'betterdiscord';
import React, { useState, useEffect } from 'react';
import { 
    ApplicationStore,
    ChannelStore, 
    GuildStore, 
    StreamStore, 
    ApplicationStreamPreviewStore,
    RelationshipStore,
    NewGameStore, 
    useStateFromStores, 
    EmojiRenderer, 
    ActivityTimer,
    ActivityCardClasses, 
    MediaProgressBar, 
    ActivityButtons,
    Tooltip, 
    SpotifyButtons, 
    CallButtons, 
    VoiceBox, 
    VoiceList, 
    VoiceIcon,
    VoiceStateStore,
    UserStore,
    GameProfile, 
    intl,
    CustomProgressBar,
    ActivityTimerLocalized,
    headers,
    userVoice,
    BotAddButtonComponent,
    RolePermissionHook,
    getIntlString
} from "./modules";
import { TooltipBuilder, activityCheck } from "./builders";

function FallbackAsset(props) {
    return React.createElement("svg", props, 
        React.createElement("path", {
            style: { transform: "scale(1.65)" },
            fill: "white",
            d: "M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3H5Zm6.81 7c-.54 0-1 .26-1.23.61A1 1 0 0 1 8.92 8.5 3.49 3.49 0 0 1 11.82 7c1.81 0 3.43 1.38 3.43 3.25 0 1.45-.98 2.61-2.27 3.06a1 1 0 0 1-1.96.37l-.19-1a1 1 0 0 1 .98-1.18c.87 0 1.44-.63 1.44-1.25S12.68 9 11.81 9ZM13 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm7-10.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM18.5 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM7 18.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM5.5 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
        })
    );
}

function ActivityCard({ user, activity, check }) {
    const [shouldLargeFallback, setShouldLargeFallback] = useState(false);
    const [shouldSmallFallback, setShouldSmallFallback] = useState(false);
    const filterCheck = activityCheck({ activities: [activity] });
    const gameId = activity?.application_id;
    const game = NewGameStore.getGame(gameId);
    const application = ApplicationStore.getApplication(activity?.application_id);

    return React.createElement(React.Fragment, null,
        React.createElement("h3", { 
            className: "headerTextNormal headerText size12", 
            style: { color: "var(--white)", marginBottom: "8px" } 
        },
            (check?.listening || check?.watching) && [2, 3].includes(activity?.type) ? headers()[activity.type] + activity?.name 
            : (filterCheck?.xbox || filterCheck?.playstation) ? getIntlString("A17aM8", { platform: activity?.platform })
            : headers()[activity.type] 
        ),
        React.createElement("div", { 
            className: activity?.assets ? "bodyAlignCenter" : "bodyNormal", 
            style: { display: "flex", alignItems: "center", width: "auto" } 
        },
            React.createElement("div", { 
                className: "assets", 
                style: { position: "relative" },
                onMouseOver: (e) => game && e.currentTarget.classList.add(`${ActivityCardClasses.clickableImage}`),
                onMouseLeave: (e) => game && e.currentTarget.classList.remove(`${ActivityCardClasses.clickableImage}`),
                onClick: () => game && GameProfile.openGameProfileModal({
                    applicationId: gameId,
                    gameProfileModalChecks: {
                        shouldOpenGameProfile: true,
                        applicationId: gameId
                    },
                    source: "tony",
                    sourceUserId: user.id,
                    appContext: {}    
                })
            },
                activity?.assets && activity?.assets.large_image && 
                    React.createElement(TooltipBuilder, { note: activity.assets.large_text || activity?.details },
                        shouldLargeFallback ? 
                            React.createElement(FallbackAsset, { className: "assetsLargeImage assetsLargeImageUserPopout" }) :
                            React.createElement("img", {
                                className: "assetsLargeImage assetsLargeImageUserPopout",
                                "aria-label": activity?.assets?.large_text,
                                alt: activity?.assets?.large_text,
                                src: activity?.assets?.large_image?.includes('external') ? 
                                    'https://media.discordapp.net/external' + activity.assets.large_image.substring(activity.assets.large_image.indexOf('/')) :
                                    'https://cdn.discordapp.com/app-assets/' + activity.application_id + '/' + activity?.assets.large_image + ".png",
                                onError: () => setShouldLargeFallback(true)
                            })
                    ),
                activity?.platform?.includes('xbox') && 
                    React.createElement("img", {
                        className: "assetsLargeImageXbox assetsLargeImage assetsLargeImageUserPopout",
                        style: { width: "60px", height: "60px" },
                        src: 'https://discord.com/assets/d8e257d7526932dcf7f88e8816a49b30.png'
                    }),
                activity?.platform?.includes('ps5') && 
                    React.createElement("img", {
                        className: "assetsLargeImagePlaystation assetsLargeImage assetsLargeImageUserPopout",
                        style: { width: "60px", height: "60px" },
                        src: 'https://media.discordapp.net/external' + activity.assets.small_image.substring(activity.assets.small_image.indexOf('/'))
                    }),
                activity?.application_id && (!activity?.assets || !activity?.assets.large_image) && !activity?.platform?.includes('xbox') && 
                    (shouldLargeFallback ? 
                        React.createElement(FallbackAsset, { className: "gameIcon", style: { width: "40px", height: "40px" } }) :
                        React.createElement("img", {
                            className: "gameIcon",
                            style: { width: "40px", height: "40px" },
                            src: 'https://cdn.discordapp.com/app-icons/' + activity.application_id + '/' + application?.icon + ".png",
                            onError: () => setShouldLargeFallback(true)
                        })
                    ),
                !(user.bot || activity?.assets || activity?.application_id || application?.icon) && 
                    React.createElement(FallbackAsset, { style: { width: "40px", height: "40px" } }),
                activity?.assets && activity?.assets?.large_image && activity?.assets?.small_image && 
                    React.createElement(TooltipBuilder, { note: activity.assets.small_text || activity?.details },
                        shouldSmallFallback ? 
                            React.createElement(FallbackAsset, { className: "assetsSmallImage assetsSmallImageUserPopout" }) :
                            React.createElement("img", {
                                className: "assetsSmallImage assetsSmallImageUserPopout",
                                "aria-label": activity?.assets?.small_text,
                                alt: activity?.assets?.small_text,
                                src: activity?.assets?.small_image?.includes('external') ? 
                                    'https://media.discordapp.net/external' + activity.assets.small_image.substring(activity.assets.small_image.indexOf('/')) :
                                    'https://cdn.discordapp.com/app-assets/' + activity.application_id + '/' + activity?.assets.small_image + ".png",
                                onError: () => setShouldSmallFallback(true)
                            })
                    )
            ),
            React.createElement("div", { 
                className: Utils.className(
                    activity?.assets ? "contentImagesUserPopout" : 
                    (application || activity?.timestamps) ? "contentGameImageUserPopout" : 
                    "contentNoImagesUserPopout", 
                    "content"
                ), 
                style: { display: "grid", flex: "1", marginBottom: "3px" } 
            },
                React.createElement("div", { 
                    className: "nameNormal textRow ellipsis", 
                    style: { fontWeight: "600" } 
                },
                    (check?.listening || check?.watching) && [2, 3].includes(activity?.type) ? activity.details : activity.name
                ),
                !(filterCheck?.listening || filterCheck?.watching) && 
                    React.createElement("div", { className: "details textRow ellipsis" }, activity.details),
                React.createElement("div", { className: "state textRow ellipsis" },
                    activity?.state && activity?.party && activity?.party?.size ? 
                        activity.state + " (" + activity.party.size[0] + " of " + activity.party.size[1] + ")" :
                        activity?.party && activity?.party?.size ?
                            `Party: (${activity.party.size[0]} of ${activity.party.size[1]})` :
                            activity.state
                ),
                activity?.timestamps?.end ? 
                    React.createElement("div", { className: "mediaProgressBarContainer" },
                        React.createElement(CustomProgressBar, { 
                            start: activity?.timestamps?.start || activity?.created_at, 
                            end: activity?.timestamps?.end 
                        })
                    ) :
                    React.createElement(ActivityTimerLocalized, { activity })
            )
        ),
        React.createElement("div", { className: "buttonsWrapper actionsUserPopout" },
            activity?.buttons?.length && React.createElement(ActivityButtons, { user, activity })
        )
    );
}

function VoiceCards({ voice, stream }) {
    const channel = useStateFromStores([ ChannelStore ], () => ChannelStore.getChannel(voice));

    if (stream || !channel) return null;
    
    return React.createElement(React.Fragment, null,
        React.createElement("div", { className: "activityUserPopoutContainerVoice" },
            React.createElement("h3", { 
                className: "headerTextNormal headerText size12", 
                style: { color: "var(--white)", marginBottom: "8px" } 
            }, getIntlString("msxteM")),
            React.createElement("div", { 
                className: "bodyNormal", 
                style: { display: "flex", alignItems: "center", width: "auto" } 
            },
                React.createElement(VoiceBox, { 
                    users: userVoice({ voice }), 
                    channel, 
                    themeType: "MODAL" 
                }),
                React.createElement("div", { className: "contentImagesUserPopout content" },
                    React.createElement("h3", { className: "textRow", style: { display: "flex", alignItems: "center" } },
                        React.createElement(VoiceIcon, { channel }),
                        React.createElement("h3", { 
                            className: "nameWrap nameNormal textRow", 
                            style: { fontWeight: "600" } 
                        }, channel.name || RelationshipStore.getNickname(channel.getRecipientId()))
                    ),
                    GuildStore.getGuild(channel.guild_id)?.name && 
                        React.createElement("div", { className: "state textRow ellipsis" },
                            getIntlString("Xe4de2", { channelName: GuildStore.getGuild(channel.guild_id)?.name })
                        )
                )
            ),
            React.createElement("div", { className: "buttonsWrapper actionsUserPopout" },
                React.createElement(CallButtons, { channel })
            )
        )
    );
}

function StreamCards({ user, voice }) {
    const streams = useStateFromStores([ StreamStore ], () => StreamStore.getAllApplicationStreamsForChannel(voice));
    const _streams = streams.filter(streams => streams && streams.ownerId == user.id);
    const channel = useStateFromStores([ ChannelStore ], () => ChannelStore.getChannel(voice));

    return _streams.map(stream =>
        React.createElement("div", { className: "activityUserPopoutContainerStream", key: stream?.id || stream?.ownerId },
            React.createElement("h3", { 
                className: "headerTextNormal headerText size12", 
                style: { color: "var(--white)", marginBottom: "8px" } 
            },
                getIntlString("sddlGK", { server: GuildStore.getGuild(channel.guild_id)?.name || channel.name || getIntlString("jN2DfZ") })
            ),
            React.createElement("div", { 
                className: "bodyNormal", 
                style: { display: "flex", alignItems: "center", width: "auto" } 
            },
                ApplicationStreamPreviewStore.getPreviewURLForStreamKey(stream?.streamType + ":" + stream?.guildId + ":" + stream?.channelId + ":" + stream?.ownerId)
                    ? React.createElement("img", {
                        className: "streamPreviewImage",
                        src: ApplicationStreamPreviewStore.getPreviewURLForStreamKey(stream?.streamType + ":" + stream?.guildId + ":" + stream?.channelId + ":" + stream?.ownerId)
                    })
                    : React.createElement("img", {
                        className: "streamPreviewPlaceholder",
                        src: 'https://discord.com/assets/6b1a461f35c05c7a.svg'
                    }),
                React.createElement("div", { className: "contentImagesUserPopout content" },
                    React.createElement("h3", { className: "textRow", style: { display: "flex", alignItems: "center" } },
                        React.createElement(VoiceIcon, { channel }),
                        React.createElement("h3", { 
                            className: "nameWrap nameNormal textRow", 
                            style: { fontWeight: "600" } 
                        }, channel.name || RelationshipStore.getNickname(channel.getRecipientId()))
                    ),
                    React.createElement(VoiceList, {
                        className: "userList",
                        users: userVoice({ voice }),
                        maxUsers: userVoice({ voice }).length,
                        guildId: stream.guildId,
                        channelId: stream.channelId
                    })
                )
            ),
            React.createElement("div", { className: "buttonsWrapper actionsUserPopout" },
                React.createElement(CallButtons, { channel })
            )
        )
    );
}

export function ActivityCards({ user, activities, voice, stream, check }) {
    const _activities = activities.filter(activity => activity && [0, 2, 3, 5].includes(activity?.type) && activity?.type !== 4 && activity.name && !activity.name.includes("Spotify"));
    const filterCheck = activityCheck({ activities: _activities });

    if (voice) {
        return React.createElement("div", { className: "activityUserPopout activity", id: voice, key: voice },
            !stream ? React.createElement(VoiceCards, { voice, stream }) : React.createElement(StreamCards, { user, voice })
        );
    }

    return React.createElement("div", { 
        className: "activityUserPopout activity", 
        id: _activities[0].created_at + "-" + _activities[0].type, 
        key: _activities[0].created_at + "-" + _activities[0].type 
    },
        React.createElement(ActivityCard, { user, activity: _activities[0], check: filterCheck })
    );
}

export function SpotifyCards({ user, activities }) {
    const _activities = activities.filter(activity => activity && activity.name && activity.name.includes("Spotify"));
    
    return React.createElement(React.Fragment, null,
        _activities.map(activity => 
            React.createElement("div", { className: "activityUserPopout activity", key: activity?.created_at || activity?.timestamps?.start },
                React.createElement("h3", { 
                    className: "headerTextNormal headerText size12", 
                    style: { color: "var(--white)", marginBottom: "8px" } 
                }, headers()[activity.type] + activity?.name),
                React.createElement("div", { 
                    className: "bodyNormal", 
                    style: { display: "flex", alignItems: "center", width: "auto" } 
                },
                    React.createElement("div", { className: "assets", style: { position: "relative" } },
                        activity?.assets && activity?.assets.large_image ? 
                            React.createElement(TooltipBuilder, { note: activity.assets.large_text || activity?.details },
                                React.createElement("img", {
                                    className: "assetsLargeImageUserPopout",
                                    "aria-label": activity?.assets?.large_text,
                                    alt: activity?.assets?.large_text,
                                    src: 'https://i.scdn.co/image/' + activity.assets.large_image.substring(activity.assets.large_image.indexOf(':') + 1)
                                })
                            ) :
                            React.createElement(FallbackAsset, { style: { width: "60px", height: "60px" } })
                    ),
                    React.createElement("div", { className: "contentImagesUserPopout content" },
                        React.createElement("div", { 
                            className: "nameNormal textRow ellipsis", 
                            style: { fontWeight: "600" } 
                        }, activity.details),
                        activity.state && 
                            React.createElement("div", { className: "details textRow ellipsis" }, "by " + activity.state),
                        activity.assets?.large_text && 
                            React.createElement("div", { className: "state textRow ellipsis" }, "on " + activity.assets?.large_text),
                        activity?.timestamps?.end ? null : React.createElement(ActivityTimerLocalized, { activity })
                    )
                ),
                React.createElement("div", { className: "mediaProgressBarContainer" },
                    React.createElement(MediaProgressBar, { start: activity?.timestamps?.start, end: activity?.timestamps?.end })
                ),
                React.createElement("div", { className: "buttonsWrapper actionsUserPopout" },
                    React.createElement(SpotifyButtons, { user, activity })
                )
            )
        )
    );
}

export function TwitchCards({ user, activities }) {
    const _activities = activities.filter(activity => activity && activity.name && activity.type === 1);
    const __activities = [_activities[0]];

    if (!__activities.length) return null;

    return React.createElement("div", { className: "activityUserPopoutContainerTwitch" },
        __activities.map(activity => 
            React.createElement("div", { className: "activityUserPopout activity", key: activity?.created_at || activity?.timestamps?.start },
                React.createElement("h3", { 
                    className: "headerTextNormal headerText size12", 
                    style: { color: "var(--white)", marginBottom: "8px" } 
                }, getIntlString("Dzgz4u", { platform: (activity?.name || getIntlString("5AyH/p")) })),
                React.createElement("div", { 
                    className: "bodyNormal", 
                    style: { display: "flex", alignItems: "center", width: "auto" } 
                },
                    React.createElement("div", { className: "assets", style: { position: "relative" } },
                        activity?.assets && activity?.assets.large_image ?
                            React.createElement("div", null,
                                React.createElement("img", {
                                    className: "assetsLargeImageTwitch assetsLargeImageUserPopout",
                                    "aria-label": activity?.assets?.large_text,
                                    alt: activity?.assets?.large_text,
                                    src: activity.name.includes('YouTube') ? 
                                        'https://i.ytimg.com/vi/' + activity.assets.large_image.substring(activity.assets.large_image.indexOf(':') + 1) + '/hqdefault_live.jpg' :
                                        'https://static-cdn.jtvnw.net/previews-ttv/live_user_' + activity.assets.large_image.substring(activity.assets.large_image.indexOf(':') + 1) + '-162x90.jpg',
                                    onError: (e) => e.currentTarget.src = 'https://static-cdn.jtvnw.net/ttv-static/404_preview-162x90.jpg'
                                })
                            ) :
                            React.createElement(FallbackAsset, { style: { width: "40px", height: "40px" } })
                    ),
                    React.createElement("div", { className: "contentImagesUserPopout content" },
                        React.createElement("div", { 
                            className: "nameNormal textRow ellipsis", 
                            style: { fontWeight: "600" } 
                        }, activity.details),
                        activity.state && 
                            React.createElement("div", { className: "state textRow ellipsis" }, 
                                getIntlString("BMTj29") + " " + activity.state
                            )
                    )
                ),
                React.createElement("div", { className: "buttonsWrapper actionsUserPopout" },
                    React.createElement(ActivityButtons, { user, activity })
                )
            )
        )
    );
}
