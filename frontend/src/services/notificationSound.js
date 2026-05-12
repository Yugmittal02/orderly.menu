/**
 * New Order Notification Sound
 * Uses Web Audio API — no external audio file needed.
 * Plays a LOUD, attention-grabbing multi-bell chime when a new order arrives.
 * Plays TWICE for urgency.
 */

let audioContext = null;

function getAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume context if suspended (browser autoplay policy)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    return audioContext;
}

/**
 * Play a single bell strike at a given time offset
 */
function playBellStrike(ctx, startTime, frequency, volume, duration) {
    // Main tone
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(frequency, startTime);
    osc.type = 'sine';
    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    osc.start(startTime);
    osc.stop(startTime + duration);

    // Harmonic overtone for brightness (makes it louder and richer)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.frequency.setValueAtTime(frequency * 2, startTime);
    osc2.type = 'square';
    gain2.gain.setValueAtTime(volume * 0.15, startTime);
    gain2.gain.exponentialRampToValueAtTime(0.01, startTime + duration * 0.6);
    osc2.start(startTime);
    osc2.stop(startTime + duration * 0.6);

    // Sub-harmonic for body
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.frequency.setValueAtTime(frequency * 0.5, startTime);
    osc3.type = 'sine';
    gain3.gain.setValueAtTime(volume * 0.3, startTime);
    gain3.gain.exponentialRampToValueAtTime(0.01, startTime + duration * 0.8);
    osc3.start(startTime);
    osc3.stop(startTime + duration * 0.8);
}

/**
 * Play a complete bell chime pattern
 */
function playChimePattern(ctx, baseTime) {
    // Bell pattern: ding-ding-DONG (ascending, loud)
    playBellStrike(ctx, baseTime, 880, 0.7, 0.4);          // A5 — first ding
    playBellStrike(ctx, baseTime + 0.2, 1108.73, 0.8, 0.4); // C#6 — second ding
    playBellStrike(ctx, baseTime + 0.4, 1318.51, 0.9, 0.6); // E6 — big DONG
    playBellStrike(ctx, baseTime + 0.65, 1760, 0.6, 0.5);   // A6 — high sparkle
}

/**
 * Play a loud, attention-grabbing notification
 * Plays the chime pattern TWICE for urgency
 */
export function playOrderSound() {
    try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;

        // First chime
        playChimePattern(ctx, now);

        // Second chime (repeat after short gap for urgency)
        playChimePattern(ctx, now + 1.2);

    } catch (err) {
        console.warn('Could not play notification sound:', err);
    }
}

export default playOrderSound;
