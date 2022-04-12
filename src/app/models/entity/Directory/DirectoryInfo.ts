import { OSFolder } from './OSFolder';
import { OSFile } from './OSFile';

export class DirectoryInfo {
    path: string;
    folders: OSFolder[];
    files: OSFile[];
}
