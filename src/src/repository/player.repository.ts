import {getSave} from "/src/database/save.database";
import {PlayerDto} from "/src/entity/player/player.dto";

export const getPlayerDto = async (): Promise<PlayerDto> => {
    const saveFile =  await getSave();

    return new PlayerDto(JSON.parse(saveFile.data.PlayerSave).data)
}