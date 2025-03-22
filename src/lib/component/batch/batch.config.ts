export enum BatchConfig {
    TICK = 300,
    BATCH_SEPARATION = 4 * TICK,
    TIME_BUFFER = 500,
    BATCH_TARGET_CYCLES = 5,
    MAX_WAVE_SIZE = 200,
    GROW_BUFFER = 1.05
}