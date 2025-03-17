import {getSave} from "/src/database/save.database";
import {Bitnode} from "/src/entity/bitnode/bitnode";

export const getBitnode = async (): Promise<Bitnode> => {
    const saveFile =  await getSave();

    return new Bitnode(JSON.parse(saveFile.data.PlayerSave).data.bitNodeN);
}