export enum BatchConfig {
    TICK = 200,
    BATCH_SEPARATION = 4 * TICK,
    TIME_BUFFER = 500,
    BATCH_TARGET_CYCLES = 10,
    DEBUG_LOOP = 20,
    GROW_BUFFER = 1.05
}