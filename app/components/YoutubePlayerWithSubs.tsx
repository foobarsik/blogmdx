"use client";
import {useEffect, useRef, useState} from 'react';

declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

export default function YouTubePlayerWithSubs({videoId, subtitles}) {
    const playerRef = useRef<any>(null);
    const [currentSub, setCurrentSub] = useState<string>('');

    useEffect(() => {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);

        window.onYouTubeIframeAPIReady = () => {
            playerRef.current = new window.YT.Player('yt-player', {
                height: '200',
                width: '380',
                videoId: videoId,
                playerVars: {
                    // Set the preferred language to Polish ('pl') to influence audio track selection
                    hl: 'pl',
                    // Optional: Ensure captions are off by default, or set to 'pl' if you want Polish subtitles
                    cc_lang_pref: 'pl',
                    cc_load_policy: 0 // 0 to disable captions by default, 1 to enable
                },
                events: {
                    onReady: () => {
                        setInterval(() => {
                            const time = playerRef.current?.getCurrentTime?.();
                            if (time) {
                                const sub = subtitles.find(
                                    s => time >= s.start && time <= s.end
                                );
                                if (sub?.text !== currentSub) setCurrentSub(sub?.text || '');
                            }
                        }, 300);
                    }
                }
            });
        };
    }, [videoId, subtitles]);

    return (
        <div style={{width: '380px', position: 'relative'}}>
            <div>
                <div id="yt-player"/>
            </div>
            <div style={{marginTop: 16, fontSize: 18, background: '#f1f1f1', padding: 10}}>
                {currentSub || '...'}
            </div>
        </div>
    );
};
