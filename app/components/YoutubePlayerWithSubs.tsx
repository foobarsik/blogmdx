"use client";
import {useEffect, useRef, useState} from 'react';

declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

interface Line {
    start: number;
    end: number;
    source: string;
    target: string;
    notes: string[];
}

export default function YouTubePlayerWithSubs({
                                                  videoId,
                                                  subtitles
                                              }: {
    videoId: string;
    subtitles: Line[];
}) {
    const playerRef = useRef<any>(null);
    const [currentBlock, setCurrentBlock] = useState<React.ReactNode>('…');
    const lastPausedIndex = useRef<number>(-1); // чтобы не дёргать паузу дважды
    const lastShownIndex = useRef<number>(-1);  // чтобы не перерисовывать лишний раз

    useEffect(() => {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);

        const PAUSE_BEFORE_END = 0.2; // сек до конца реплики
        const PAUSE_DURATION = 1000;  // мс длительность паузы

        (window as any).onYouTubeIframeAPIReady = () => {
            playerRef.current = new (window as any).YT.Player('yt-player', {
                height: '200',
                width: '380',
                videoId,
                playerVars: {hl: 'pl', cc_load_policy: 0},
                events: {
                    onReady: () => {
                        setInterval(() => {
                            const t = playerRef.current?.getCurrentTime?.();
                            if (t == null) return;

                            const idx = subtitles.findIndex(s => t >= s.start && t <= s.end);
                            if (idx === -1) return;

                            const sub = subtitles[idx];
                            const timeToEnd = sub.end - t;

                            /* 1️⃣ авто‑пауза перед концом строки */
                            if (timeToEnd <= PAUSE_BEFORE_END && idx !== lastPausedIndex.current) {
                                lastPausedIndex.current = idx;
                                playerRef.current.pauseVideo();
                                setTimeout(() => playerRef.current.playVideo(), PAUSE_DURATION);
                            }

                            /* 2️⃣ обновляем вывод, если поменялся индекс */
                            if (idx !== lastShownIndex.current) {
                                lastShownIndex.current = idx;
                                setCurrentBlock(
                                    <>
                                        <div style={{
                                            fontWeight: 600,
                                            paddingBottom: '4px',
                                            borderBottom: '1px solid #666'
                                        }}>{sub.source}</div>

                                        <div style={{
                                            fontSize: 14,
                                            paddingBottom: '4px',
                                            color: 'black',
                                            borderBottom: '1px solid #666'
                                        }}>
                                            {sub.notes.join(', ')}
                                        </div>

                                        <div style={{color: '#444'}}>{sub.target}</div>
                                    </>
                                );
                            }
                        }, 200);
                    }
                }
            });
        };
    }, [videoId, subtitles]);

    return (
        <div style={{width: 380, position: 'relative'}}>
            <div id="yt-player"/>
            <div
                style={{
                    marginTop: 16,
                    fontSize: 16,
                    background: '#f1f1f1',
                    padding: 10,
                    lineHeight: 1.35
                }}
            >
                {currentBlock}
            </div>
        </div>
    );
}
