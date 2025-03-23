export enum BatchConfig {
    TICK = 30,
    BATCH_SEPARATION = 4 * TICK,
    TIME_BUFFER = 500,
    BATCH_TARGET_CYCLES = 5,
    MAX_WAVE_SIZE = Infinity,
    GROW_BUFFER = 1.05,
    MAX_MULTIPLIER = 0.8, // 0.X
}