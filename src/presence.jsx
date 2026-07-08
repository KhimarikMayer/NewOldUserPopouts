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
    return (
        <svg {...props}>
            <path
                style={{ transform: "scale(1.65)" }}
                fill="white" 
                d="M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3H5Zm6.81 7c-.54 0-1 .26-1.23.61A1 1 0 0 1 8.92 8.5 3.49 3.49 0 0 1 11.82 7c1.81 0 3.43 1.38 3.43 3.25 0 1.45-.98 2.61-2.27 3.06a1 1 0 0 1-1.96.37l-.19-1a1 1 0 0 1 .98-1.18c.87 0 1.44-.63 1.44-1.25S12.68 9 11.81 9ZM13 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm7-10.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM18.5 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM7 18.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM5.5 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
            />
        </svg> 
    );
}

function ActivityCard({ user, activity, check }) {
    const [shouldLargeFallback, setShouldLargeFallback] = useState(false);
    const [shouldSmallFallback, setShouldSmallFallback] = useState(false);
    const filterCheck = activityCheck({ activities: [activity] });
    const gameId = activity?.application_id;

    const game = NewGameStore.getGame(gameId);
    const application = ApplicationStore.getApplication(activity?.application_id);

    return (
        <>
            <h3 className="headerTextNormal headerText size12" style={{ color: "var(--white)", marginBottom: "8px" }}>
                {
                    (check?.listening || check?.watching) && ([2, 3].includes(activity?.type)) ? headers()[activity.type] + activity?.name 
                    : (filterCheck?.xbox || filterCheck?.playstation) ? getIntlString("A17aM8", { platform: activity?.platform })
                    : headers()[activity.type] 
                }
            </h3>
            <div className={activity?.assets ? "bodyAlignCenter" : "bodyNormal"} style={{ display: "flex", alignItems: "center", width: "auto" }}>
                <div className="assets" style={{ position: "relative" }}
                    onMouseOver={(e) => game && e.currentTarget.classList.add(`${ActivityCardClasses.clickableImage}`)}
                    onMouseLeave={(e) => game && e.currentTarget.classList.remove(`${ActivityCardClasses.clickableImage}`)}
                    onClick={() => game && GameProfile.openGameProfileModal({
                        applicationId: gameId,
                        gameProfileModalChecks: {
                            shouldOpenGameProfile: true,
                            applicationId: gameId
                        },
                        source: "tony",
                        sourceUserId: user.id,
                        appContext: {}    
                    })}>
                    { 
                        activity?.assets && activity?.assets.large_image && <TooltipBuilder note={activity.assets.large_text || activity?.details}>
                            { shouldLargeFallback ? ( <FallbackAsset className="assetsLargeImage assetsLargeImageUserPopout" /> ) :
                            <img 
                                className="assetsLargeImage assetsLargeImageUserPopout"
                                aria-label={activity?.assets?.large_text}
                                alt={activity?.assets?.large_text}
                                src={
                                    activity?.assets?.large_image?.includes('external') ? 'https://media.discordapp.net/external' + activity.assets.large_image.substring(activity.assets.large_image.indexOf('/'))
                                    : 'https://cdn.discordapp.com/app-assets/' + activity.application_id + '/' + activity?.assets.large_image + ".png"
                                }
                                onError={ () => (setShouldLargeFallback(true))}
                            />
                            }
                        </TooltipBuilder> 
                    }
                    {
                        activity?.platform?.includes('xbox') && <img 
                            className="assetsLargeImageXbox assetsLargeImage assetsLargeImageUserPopout" 
                            style={{ width: "60px", height: "60px" }}
                            src="https://discord.com/assets/d8e257d7526932dcf7f88e8816a49b30.png"
                        />
                    }
                    {
                        activity?.platform?.includes('ps5') && <img 
                            className="assetsLargeImagePlaystation assetsLargeImage assetsLargeImageUserPopout"
                            style={{ width: "60px", height: "60px" }}
                            src={'https://media.discordapp.net/external' + activity.assets.small_image.substring(activity.assets.small_image.indexOf('/'))} 
                        />
                    }
                    {
                        activity?.application_id && (!activity?.assets || !activity?.assets.large_image) && !activity?.platform?.includes('xbox') && 
                        shouldLargeFallback ? ( <FallbackAsset className="gameIcon" style={{ width: "40px", height: "40px" }} /> ) :
                        activity?.application_id && (!activity?.assets || !activity?.assets.large_image) && !activity?.platform?.includes('xbox') && <img 
                            className="gameIcon" 
                            style={{ width: "40px", height: "40px" }}
                            src={'https://cdn.discordapp.com/app-icons/' + activity.application_id + '/' + application?.icon + ".png"}
                            onError={ () => (setShouldLargeFallback(true))}
                        />   
                    }
                    {
                        !(user.bot || activity?.assets || activity?.application_id || application?.icon) && 
                        <FallbackAsset style={{ width: "40px", height: "40px" }} />
                    }
                    {
                        activity?.assets && activity?.assets?.large_image && activity?.assets?.small_image && <TooltipBuilder note={activity.assets.small_text || activity?.details}>
                            { shouldSmallFallback ? ( <FallbackAsset className="assetsSmallImage assetsSmallImageUserPopout" /> ) :
                            <img 
                                className="assetsSmallImage assetsSmallImageUserPopout"
                                aria-label={activity?.assets?.small_text}
                                alt={activity?.assets?.small_text}
                                src={
                                    activity?.assets?.small_image?.includes('external') ? 'https://media.discordapp.net/external' + activity.assets.small_image.substring(activity.assets.small_image.indexOf('/'))
                                    : 'https://cdn.discordapp.com/app-assets/' + activity.application_id + '/' + activity?.assets.small_image + ".png"
                                }
                                onError={ () => (setShouldSmallFallback(true))}
                            />
                            }
                        </TooltipBuilder> 
                    }
                </div>
                <div className={Utils.className(activity?.assets ? "contentImagesUserPopout" : (application || activity?.timestamps) ? "contentGameImageUserPopout" : "contentNoImagesUserPopout", "content")} style={{ display: "grid", flex: "1", marginBottom: "3px" }}>
                    <div className="nameNormal textRow ellipsis" style={{ fontWeight: "600" }}>{(check?.listening || check?.watching) && ([2, 3].includes(activity?.type)) ? activity.details : activity.name}</div>
                    { !(filterCheck?.listening || filterCheck?.watching) && <div className="details textRow ellipsis">{activity.details}</div> }
                    <div className="state textRow ellipsis">
                        {
                            activity?.state && activity?.party && activity?.party?.size ? 
                                activity.state + " (" + activity.party.size[0] + " of " + activity.party.size[1] + ")"
                            :
                            activity?.party && activity?.party?.size ?
                                `Party: (${activity.party.size[0]} of ${activity.party.size[1]})`
                            :
                                activity.state
                        }
                    </div>
                    { 
                        activity?.timestamps?.end ? <div className="mediaProgressBarContainer">
                            <CustomProgressBar start={activity?.timestamps?.start || activity?.created_at} end={activity?.timestamps?.end} />
                        </div>
                        : <ActivityTimerLocalized activity={activity} />
                    }
                </div>
            </div>
            <div className="buttonsWrapper actionsUserPopout">
                {activity?.buttons?.length && <ActivityButtons user={user} activity={activity} />}
            </div>
        </>
    );
}

function VoiceCards({ voice, stream }) {
    const channel = useStateFromStores([ ChannelStore ], () => ChannelStore.getChannel(voice));

    if (stream || !channel) return null;
    return (
        <>
            <div className="activityUserPopoutContainerVoice">
                <h3 className="headerTextNormal headerText size12" style={{ color: "var(--white)", marginBottom: "8px" }}>{getIntlString("msxteM")}</h3>
                <div className="bodyNormal" style={{ display: "flex", alignItems: "center", width: "auto" }}>
                    <VoiceBox users={userVoice({voice})} channel={channel} themeType="MODAL" />
                    <div className="contentImagesUserPopout content">
                        <h3 className="textRow" style={{ display: "flex", alignItems: "center" }}>
                            {VoiceIcon({channel: channel})}
                            <h3 className="nameWrap nameNormal textRow" style={{ fontWeight: "600" }}>{channel.name || RelationshipStore.getNickname(channel.getRecipientId())}</h3>
                        </h3>
                        { 
                            GuildStore.getGuild(channel.guild_id)?.name && 
                            <div className="state textRow ellipsis">
                                {getIntlString("Xe4de2", { channelName: GuildStore.getGuild(channel.guild_id)?.name })}
                            </div> 
                        }
                    </div>
                </div>
                <div className="buttonsWrapper actionsUserPopout">
                    <CallButtons channel={channel} />
                </div>
            </div>
        </>
    );
}

function StreamCards({ user, voice }) {
    const streams = useStateFromStores([ StreamStore ], () => StreamStore.getAllApplicationStreamsForChannel(voice));
    const _streams = streams.filter(streams => streams && streams.ownerId == user.id);
    const channel = useStateFromStores([ ChannelStore ], () => ChannelStore.getChannel(voice));

    return (
        _streams.map(stream =>
            <div className="activityUserPopoutContainerStream" key={stream?.id || stream?.ownerId}>
                <h3 className="headerTextNormal headerText size12" style={{ color: "var(--white)", marginBottom: "8px" }}>
                    {getIntlString("sddlGK", { server: GuildStore.getGuild(channel.guild_id)?.name || channel.name || getIntlString("jN2DfZ") })}
                </h3>
                <div className="bodyNormal" style={{ display: "flex", alignItems: "center", width: "auto" }}>
                    { 
                        ApplicationStreamPreviewStore.getPreviewURLForStreamKey(stream?.streamType + ":" + stream?.guildId + ":" + stream?.channelId + ":" + stream?.ownerId)
                        ? <img
                            className="streamPreviewImage"
                            src={ApplicationStreamPreviewStore.getPreviewURLForStreamKey(stream?.streamType + ":" + stream?.guildId + ":" + stream?.channelId + ":" + stream?.ownerId)}
                        />
                        : <img 
                            className="streamPreviewPlaceholder"
                            src="https://discord.com/assets/6b1a461f35c05c7a.svg"
                        />
                    }
                    <div className="contentImagesUserPopout content">
                        <h3 className="textRow" style={{ display: "flex", alignItems: "center" }}>
                            {VoiceIcon({channel: channel})}
                            <h3 className="nameWrap nameNormal textRow" style={{ fontWeight: "600" }}>{channel.name || RelationshipStore.getNickname(channel.getRecipientId())}</h3>
                        </h3>
                        <VoiceList 
                            className="userList" 
                            users={userVoice({voice})} 
                            maxUsers={userVoice({voice}).length} 
                            guildId={stream.guildId} 
                            channelId={stream.channelId}
                        />
                    </div>
                </div>
                <div className="buttonsWrapper actionsUserPopout">
                    <CallButtons channel={channel} />
                </div>
            </div>
        )
    );
}

export function ActivityCards({ user, activities, voice, stream, check }) {
    const _activities = activities.filter(activity => activity && ([0, 2, 3, 5].includes(activity?.type)) && activity?.type !== 4 && activity.name && !activity.name.includes("Spotify"));
    const filterCheck = activityCheck({ activities: _activities });

    if (voice) {
        return (
            <div className="activityUserPopout activity" id={voice} key={voice}>
                { !stream ? <VoiceCards voice={voice} stream={stream} /> : <StreamCards user={user} voice={voice} /> }
            </div>
        );
    }

    return (
        <div className="activityUserPopout activity" id={_activities[0].created_at + "-" + _activities[0].type} key={_activities[0].created_at + "-" + _activities[0].type}>
            <ActivityCard user={user} activity={_activities[0]} check={filterCheck} />
        </div>
    );
}

export function SpotifyCards({ user, activities }) {
    const _activities = activities.filter(activity => activity && activity.name && activity.name.includes("Spotify"));
    return (
        <>
            {_activities.map(activity => <div className="activityUserPopout activity" key={activity?.created_at || activity?.timestamps?.start}>
                <h3 className="headerTextNormal headerText size12" style={{ color: "var(--white)", marginBottom: "8px" }}>{headers()[activity.type] + activity?.name}</h3>
                <div className="bodyNormal" style={{ display: "flex", alignItems: "center", width: "auto" }}>
                    <div className="assets" style={{ position: "relative" }}>
                        { 
                            activity?.assets && activity?.assets.large_image ? <TooltipBuilder note={activity.assets.large_text || activity?.details}>
                                <img 
                                    className="assetsLargeImageUserPopout"
                                    aria-label={activity?.assets?.large_text}
                                    alt={activity?.assets?.large_text}
                                    src={'https://i.scdn.co/image/' + activity.assets.large_image.substring(activity.assets.large_image.indexOf(':')+1)}
                                />
                            </TooltipBuilder> 
                            :
                            <svg style={{ width: "60px", height: "60px" }}>
                                <path
                                    style={{ transform: "scale(1.65)" }}
                                    fill="white" 
                                    d="M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3H5Zm6.81 7c-.54 0-1 .26-1.23.61A1 1 0 0 1 8.92 8.5 3.49 3.49 0 0 1 11.82 7c1.81 0 3.43 1.38 3.43 3.25 0 1.45-.98 2.61-2.27 3.06a1 1 0 0 1-1.96.37l-.19-1a1 1 0 0 1 .98-1.18c.87 0 1.44-.63 1.44-1.25S12.68 9 11.81 9ZM13 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm7-10.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM18.5 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM7 18.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM5.5 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                                />
                            </svg> 
                        }
                    </div>
                    <div className="contentImagesUserPopout content">
                        <div className="nameNormal textRow ellipsis" style={{ fontWeight: "600" }}>{activity.details}</div>
                        {activity.state && <div className="details textRow ellipsis">{"by " + activity.state}</div>}
                        {activity.assets?.large_text && <div className="state textRow ellipsis">{"on " + activity.assets?.large_text}</div>}
                        { 
                            activity?.timestamps?.end ? null : <ActivityTimerLocalized activity={activity} />
                        }
                    </div>
                </div>
                <div className="mediaProgressBarContainer">
                    <MediaProgressBar start={activity?.timestamps?.start} end={activity?.timestamps?.end} />
                </div>
                <div className="buttonsWrapper actionsUserPopout">
                    <SpotifyButtons user={user} activity={activity} />
                </div>
            </div>)}
        </>
    );
}

export function TwitchCards({ user, activities }) {
    const _activities = activities.filter(activity => activity && activity.name && activity.type === 1);
    const __activities = [_activities[0]];

    if (!__activities.length) return null;

    return (
        <div className="activityUserPopoutContainerTwitch">
            {__activities.map(activity => <div className="activityUserPopout activity" key={activity?.created_at || activity?.timestamps?.start}>
                <h3 className="headerTextNormal headerText size12" style={{ color: "var(--white)", marginBottom: "8px" }}>{getIntlString("Dzgz4u", { platform: (activity?.name || getIntlString("5AyH/p")) })}</h3>
                <div className="bodyNormal" style={{ display: "flex", alignItems: "center", width: "auto" }}>
                    <div className="assets" style={{ position: "relative" }}>
                        { 
                            activity?.assets && activity?.assets.large_image ?
                                <div>
                                    <img 
                                        className="assetsLargeImageTwitch assetsLargeImageUserPopout"
                                        aria-label={activity?.assets?.large_text}
                                        alt={activity?.assets?.large_text}
                                        src={
                                            activity.name.includes('YouTube') ? 'https://i.ytimg.com/vi/' + activity.assets.large_image.substring(activity.assets.large_image.indexOf(':')+1) + '/hqdefault_live.jpg'
                                            : 'https://static-cdn.jtvnw.net/previews-ttv/live_user_' + activity.assets.large_image.substring(activity.assets.large_image.indexOf(':')+1) + '-162x90.jpg'
                                        }
                                        onError={ (e) => e.currentTarget.src = 'https://static-cdn.jtvnw.net/ttv-static/404_preview-162x90.jpg' }
                                    />
                                </div>
                            :
                            <svg style={{ width: "40px", height: "40px" }}>
                                <path
                                    style={{ transform: "scale(1.65)" }}
                                    fill="white" 
                                    d="M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3H5Zm6.81 7c-.54 0-1 .26-1.23.61A1 1 0 0 1 8.92 8.5 3.49 3.49 0 0 1 11.82 7c1.81 0 3.43 1.38 3.43 3.25 0 1.45-.98 2.61-2.27 3.06a1 1 0 0 1-1.96.37l-.19-1a1 1 0 0 1 .98-1.18c.87 0 1.44-.63 1.44-1.25S12.68 9 11.81 9ZM13 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm7-10.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM18.5 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM7 18.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM5.5 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                                />
                            </svg> 
                        }
                    </div>
                    <div className="contentImagesUserPopout content">
                        <div className="nameNormal textRow ellipsis" style={{ fontWeight: "600" }}>{activity.details}</div>
                        { activity.state && <div className="state textRow ellipsis">{getIntlString("BMTj29") + " " + activity.state}</div> }
                    </div>
                </div>
                <div className="buttonsWrapper actionsUserPopout">
                    <ActivityButtons user={user} activity={activity} />
                </div>
            </div>)}
        </div>
    );
}
