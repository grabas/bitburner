const CORES_STORAGE_KEY = 'cores';

export const increamentNumberOfCores = () => {
    localStorage.setItem(CORES_STORAGE_KEY, (getNumberOfCores() + 1).toString());
}

export const getNumberOfCores = () => {
    return parseInt(localStorage.getItem(CORES_STORAGE_KEY) || '1');
}

export const setNumberOfCores = (cores: number) => {
    localStorage.setItem(CORES_STORAGE_KEY, cores.toString());
}